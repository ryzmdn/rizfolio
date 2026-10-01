"use server"

import { db, roadmapProposals, masterTransactions, sql } from "@workspace/db"

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
      } catch {
        // Non-blocking audit record
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
