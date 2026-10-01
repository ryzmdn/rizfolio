"use server"

import { db, desc, eq, and, ilike, or } from "@workspace/db"
import { inquiries, type Inquiry } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { recordTransaction } from "./transaction-actions"

export interface InquiryStats {
  total: number
  newCount: number
  inReviewCount: number
  respondedCount: number
}

export async function getInquiriesAdmin(filter?: {
  status?: string
  search?: string
}): Promise<Inquiry[]> {
  try {
    const conditions = []

    if (filter?.status && filter.status !== "ALL") {
      conditions.push(eq(inquiries.status, filter.status))
    }

    if (filter?.search?.trim()) {
      const term = `%${filter.search.trim()}%`
      conditions.push(
        or(
          ilike(inquiries.name, term),
          ilike(inquiries.email, term),
          ilike(inquiries.subject, term),
          ilike(inquiries.message, term)
        )
      )
    }

    const query = db.select().from(inquiries)
    if (conditions.length > 0) {
      return await query
        .where(and(...conditions))
        .orderBy(desc(inquiries.createdAt))
    }

    return await query.orderBy(desc(inquiries.createdAt))
  } catch (error) {
    console.error(
      "[CMS Inbox] Failed to fetch inquiries:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getInquiryStats(): Promise<InquiryStats> {
  try {
    const all = await db.select().from(inquiries)
    const total = all.length
    const newCount = all.filter((i) => i.status === "NEW").length
    const inReviewCount = all.filter((i) => i.status === "IN_REVIEW").length
    const respondedCount = all.filter((i) => i.status === "RESPONDED").length

    return { total, newCount, inReviewCount, respondedCount }
  } catch {
    return { total: 0, newCount: 0, inReviewCount: 0, respondedCount: 0 }
  }
}

export async function updateInquiryStatusAction(
  id: string,
  status: string,
  replyNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isResponded = status === "RESPONDED"
    await db
      .update(inquiries)
      .set({
        status,
        replyNotes: replyNotes !== undefined ? replyNotes : undefined,
        respondedAt: isResponded ? new Date() : undefined,
      })
      .where(eq(inquiries.id, id))

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "INQUIRY_STATUS_UPDATED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "INQUIRY",
      entityId: id,
      metadata: { newStatus: status, replyNotes },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update inquiry status",
    }
  }
}

export async function deleteInquiryAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id))

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "INQUIRY_DELETED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "INQUIRY",
      entityId: id,
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete inquiry",
    }
  }
}
