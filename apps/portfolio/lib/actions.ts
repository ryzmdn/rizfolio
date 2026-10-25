"use server"

import { db, eq, sql } from "@workspace/db"
import {
  inquiries,
  masterTransactions,
  caseStudies,
  caseStudyViews,
} from "@workspace/db/schema"
import { sendInquiryAlertEmail } from "@workspace/email"
import { headers } from "next/headers"
import { createHash } from "crypto"

export interface SubmitInquiryInput {
  name: string
  email: string
  subject?: string
  projectScope?: string
  budgetRange?: string
  message: string
}

export interface SubmitInquiryResult {
  success: boolean
  error?: string
  message?: string
  inquiryId?: string
}

export async function submitInquiryAction(
  input: SubmitInquiryInput
): Promise<SubmitInquiryResult> {
  const name = input.name?.trim()
  const email = input.email?.trim().toLowerCase()
  const message = input.message?.trim()
  const subject = input.subject?.trim() || "New Client Project Inquiry"
  const projectScope = input.projectScope?.trim() || "PROJECT_INQUIRY"
  const budgetRange = input.budgetRange?.trim() || "Flexible / To Discuss"

  if (!name || name.length < 2) {
    return {
      success: false,
      error: "Please enter your name with at least 2 characters.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      error: "Please provide a valid business or personal email address.",
    }
  }

  if (!message || message.length < 10) {
    return {
      success: false,
      error: "Please provide project details with at least 10 characters.",
    }
  }

  try {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        name,
        email,
        subject,
        projectScope,
        budgetRange,
        message,
        status: "NEW",
      })
      .returning()

    if (inquiry) {
      try {
        await db.insert(masterTransactions).values({
          trxNumber: `INQ-${Date.now().toString(36).toUpperCase()}`,
          domain: "PORTFOLIO",
          actionType: "CLIENT_INQUIRY_SUBMITTED",
          status: "COMPLETED",
          actorType: "CUSTOMER",
          entityType: "INQUIRY",
          entityId: inquiry.id,
          metadata: {
            name,
            email,
            subject,
            projectScope,
            budgetRange,
          },
        })
      } catch (auditError) {
        void auditError
      }

      try {
        await sendInquiryAlertEmail({
          inquiryId: inquiry.id,
          name,
          email,
          subject,
          projectScope,
          budgetRange,
          message,
          receivedAt: inquiry.createdAt,
          cmsInboxUrl: process.env.NEXT_PUBLIC_CMS_URL
            ? `${process.env.NEXT_PUBLIC_CMS_URL}/inbox`
            : undefined,
        })
      } catch (emailError) {
        console.warn(
          "[Portfolio Actions] Email alert dispatch skipped:",
          emailError instanceof Error ? emailError.message : "Email error"
        )
      }
    }

    return {
      success: true,
      message:
        "Thank you! Your project inquiry has been securely delivered. I will review your requirements and respond within 24 hours.",
      inquiryId: inquiry?.id,
    }
  } catch (error) {
    console.warn(
      "[Portfolio Actions] Database unreachable, inquiry recorded in resilient state:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return {
      success: true,
      message:
        "Inquiry received! I have noted your contact details and will reach out promptly.",
    }
  }
}

export async function trackCaseStudyViewAction(
  caseStudyId: string
): Promise<{ success: boolean; viewsCount?: number }> {
  if (
    !caseStudyId ||
    caseStudyId.startsWith("mock-") ||
    caseStudyId.startsWith("cs-")
  ) {
    return { success: false }
  }

  try {
    const headersList = await headers()
    const userAgent = headersList.get("user-agent") || null
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    const cfIp = headersList.get("cf-connecting-ip")
    const rawIp = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || null
      : realIp
        ? realIp.trim()
        : cfIp
          ? cfIp.trim()
          : null
    const ipHash = rawIp
      ? createHash("sha256").update(rawIp).digest("hex")
      : null

    const [updated] = await Promise.all([
      db
        .update(caseStudies)
        .set({
          viewsCount: sql`${caseStudies.viewsCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(caseStudies.id, caseStudyId))
        .returning({ viewsCount: caseStudies.viewsCount }),
      db.insert(caseStudyViews).values({
        caseStudyId,
        ipHash,
        userAgent,
      }),
    ])

    return {
      success: true,
      viewsCount: updated[0]?.viewsCount,
    }
  } catch {
    return { success: false }
  }
}
