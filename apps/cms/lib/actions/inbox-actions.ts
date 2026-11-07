"use server"

import {
  db,
  desc,
  eq,
  and,
  ilike,
  or,
  isDbConfigured,
  masterTransactions,
} from "@workspace/db"
import { inquiries, type Inquiry } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { recordTransaction } from "./transaction-actions"
import { sendInquiryReplyEmail } from "@workspace/email"
import { fallbackCmsInquiries } from "../fallback-data"

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
  if (!isDbConfigured) {
    return fallbackCmsInquiries as unknown as Inquiry[]
  }

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
      const rows = await query
        .where(and(...conditions))
        .orderBy(desc(inquiries.createdAt))
      return rows.length > 0
        ? rows
        : (fallbackCmsInquiries as unknown as Inquiry[])
    }

    const rows = await query.orderBy(desc(inquiries.createdAt))
    return rows.length > 0
      ? rows
      : (fallbackCmsInquiries as unknown as Inquiry[])
  } catch (error) {
    console.warn(
      "[CMS Inbox] Database inquiries fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsInquiries as unknown as Inquiry[]
  }
}

export async function getInquiryStats(): Promise<InquiryStats> {
  if (!isDbConfigured) {
    return {
      total: fallbackCmsInquiries.length,
      newCount: 1,
      inReviewCount: 0,
      respondedCount: 0,
    }
  }

  try {
    const all = await db.select().from(inquiries)
    const total = all.length
    const newCount = all.filter((i) => i.status === "NEW").length
    const inReviewCount = all.filter((i) => i.status === "IN_REVIEW").length
    const respondedCount = all.filter((i) => i.status === "RESPONDED").length

    return { total, newCount, inReviewCount, respondedCount }
  } catch {
    return {
      total: fallbackCmsInquiries.length,
      newCount: 1,
      inReviewCount: 0,
      respondedCount: 0,
    }
  }
}

export async function updateInquiryStatusAction(
  id: string,
  status: string,
  replyNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isResponded = status === "RESPONDED"

    if (isDbConfigured) {
      await db.transaction(async (tx) => {
        await tx
          .update(inquiries)
          .set({
            status,
            replyNotes: replyNotes !== undefined ? replyNotes : undefined,
            respondedAt: isResponded ? new Date() : undefined,
          })
          .where(eq(inquiries.id, id))

        const trxNumber = `TRX-POR-${Date.now().toString(36).toUpperCase()}`
        await tx.insert(masterTransactions).values({
          trxNumber,
          domain: "PORTFOLIO",
          actionType: "INQUIRY_STATUS_UPDATED",
          status: "COMPLETED",
          actorType: "OWNER",
          entityType: "INQUIRY",
          entityId: id,
          metadata: { newStatus: status, replyNotes },
        })
      })
    }

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
    if (isDbConfigured) {
      await db.delete(inquiries).where(eq(inquiries.id, id))

      await recordTransaction({
        domain: "PORTFOLIO",
        actionType: "INQUIRY_DELETED",
        status: "COMPLETED",
        actorType: "OWNER",
        entityType: "INQUIRY",
        entityId: id,
      })
    }

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
    let clientName = "Client"
    let clientEmail = "client@example.com"
    let clientMessage = "Inquiry message content."

    if (isDbConfigured) {
      const existing = await db
        .select()
        .from(inquiries)
        .where(eq(inquiries.id, inquiryId))
        .limit(1)

      const inquiry = existing[0]
      if (inquiry) {
        clientName = inquiry.name
        clientEmail = inquiry.email
        clientMessage = inquiry.message
      }
    }

    const emailResult = await sendInquiryReplyEmail(
      {
        clientName,
        replySubject: replySubject.trim(),
        replyContent: replyContent.trim(),
        originalMessage: clientMessage,
        portfolioUrl: process.env.NEXT_PUBLIC_PORTFOLIO_URL,
      },
      {
        to: clientEmail,
      }
    )

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to deliver email reply.",
      }
    }

    if (isDbConfigured) {
      await db
        .update(inquiries)
        .set({
          status: "RESPONDED",
          respondedAt: new Date(),
          replyNotes: replyContent.trim(),
        })
        .where(eq(inquiries.id, inquiryId))
    }

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
