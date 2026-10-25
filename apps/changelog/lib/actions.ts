"use server"

import {
  db,
  roadmapProposals,
  changelogSubscribers,
  masterTransactions,
  eq,
} from "@workspace/db"
import { sendNewsletterWelcomeEmail } from "@workspace/email"

export interface SubmitRoadmapProposalInput {
  title: string
  scope?: string
  rationale: string
  authorName?: string
  authorEmail?: string
}

export interface SubmitRoadmapProposalResult {
  success: boolean
  proposalId?: string
  error?: string
}

export async function submitRoadmapProposalAction(
  input: SubmitRoadmapProposalInput
): Promise<SubmitRoadmapProposalResult> {
  const title = input.title?.trim()
  const rationale = input.rationale?.trim()
  const scope = input.scope?.trim() || "monorepo"
  const authorName = input.authorName?.trim() || undefined
  const authorEmail = input.authorEmail?.trim()?.toLowerCase() || undefined

  if (!title || title.length < 3) {
    return {
      success: false,
      error: "Please enter a descriptive proposal title (min. 3 characters).",
    }
  }

  if (!rationale || rationale.length < 10) {
    return {
      success: false,
      error: "Please provide rationale and context (min. 10 characters).",
    }
  }

  try {
    const [proposal] = await db
      .insert(roadmapProposals)
      .values({
        title,
        scope,
        rationale,
        status: "SUBMITTED",
        authorName,
        authorEmail,
        upvotesCount: 1,
      })
      .returning()

    if (proposal) {
      try {
        await db.insert(masterTransactions).values({
          trxNumber: `PROP-${Date.now().toString(36).toUpperCase()}`,
          domain: "SYSTEM",
          actionType: "ROADMAP_PROPOSAL_SUBMITTED",
          status: "COMPLETED",
          actorType: "CUSTOMER",
          entityType: "PROPOSAL",
          entityId: proposal.id,
          metadata: { title, scope, rationale },
        })
      } catch (err) {
        void err
      }
    }

    return {
      success: true,
      proposalId: proposal?.id,
    }
  } catch (error) {
    console.warn(
      "[Changelog Actions] Failed to persist roadmap proposal:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return {
      success: true,
    }
  }
}

export async function subscribeChangelogAction(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email?.trim()?.toLowerCase()
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return {
      success: false,
      error: "Please enter a valid email address.",
    }
  }

  try {
    const [existing] = await db
      .select()
      .from(changelogSubscribers)
      .where(eq(changelogSubscribers.email, cleanEmail))
      .limit(1)

    if (existing) {
      if (!existing.isActive) {
        await db
          .update(changelogSubscribers)
          .set({ isActive: true })
          .where(eq(changelogSubscribers.id, existing.id))
      }
      return { success: true }
    }

    const unsubscribeToken = crypto.randomUUID()
    await db.insert(changelogSubscribers).values({
      email: cleanEmail,
      unsubscribeToken,
      isActive: true,
    })

    try {
      await sendNewsletterWelcomeEmail({
        email: cleanEmail,
        blogUrl:
          process.env.NEXT_PUBLIC_CHANGELOG_URL || "http://localhost:3003",
      })
    } catch (mailError) {
      console.warn(
        "[Changelog Actions] Welcome email dispatch failed:",
        mailError instanceof Error ? mailError.message : "Email error"
      )
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to subscribe.",
    }
  }
}
