"use server"

import { db, desc, eq, and, ilike, or } from "@workspace/db"
import { inquiries, type Inquiry } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { recordTransaction } from "./transaction-actions"
import { sendInquiryReplyEmail } from "@workspace/email"

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

export interface SendInquiryReplyInput {
  inquiryId: string
  replySubject: string
  replyContent: string
}

export interface SendInquiryReplyResult {
  success: boolean
  error?: string
}

export async function sendInquiryReplyAction(
  input: SendInquiryReplyInput
): Promise<SendInquiryReplyResult> {
  const { inquiryId, replySubject, replyContent } = input

  if (!inquiryId || !replySubject.trim() || !replyContent.trim()) {
    return {
      success: false,
      error: "Inquiry ID, reply subject, and content are required.",
    }
  }

  try {
    const existing = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, inquiryId))
      .limit(1)

    const inquiry = existing[0]
    if (!inquiry) {
      return {
        success: false,
        error: "Inquiry not found in database.",
      }
    }

    const emailResult = await sendInquiryReplyEmail(
      {
        clientName: inquiry.name,
        replySubject: replySubject.trim(),
        replyContent: replyContent.trim(),
        originalMessage: inquiry.message,
        portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL,
      },
      {
        to: inquiry.email,
      }
    )

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to dispatch email reply via Resend.",
      }
    }

    const respondedAt = new Date()
    await db
      .update(inquiries)
      .set({
        status: "RESPONDED",
        replyNotes: replyContent.trim(),
        respondedAt,
      })
      .where(eq(inquiries.id, inquiryId))

    await recordTransaction({
      domain: "PORTFOLIO",
      actionType: "INQUIRY_REPLIED",
      status: "COMPLETED",
      actorType: "OWNER",
      entityType: "INQUIRY",
      entityId: inquiryId,
      metadata: {
        toEmail: inquiry.email,
        replySubject: replySubject.trim(),
        resendMessageId: emailResult.id,
        isMock: emailResult.mock || false,
      },
    })

    revalidatePath("/inbox")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process inquiry reply.",
    }
  }
}

