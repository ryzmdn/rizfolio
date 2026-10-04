import { db, desc } from "@workspace/db"
import { roadmapProposals } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createRoadmapProposalSchema } from "@/lib/validations"
import { sanitizeHoneypotFields } from "@/lib/security/honeypot"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const list = await db
      .select()
      .from(roadmapProposals)
      .orderBy(desc(roadmapProposals.upvotesCount), desc(roadmapProposals.createdAt))

    return apiSuccess(list)
  }
)

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    checkHoneypot: true,
    schema: createRoadmapProposalSchema,
    auditConfig: (created) => ({
      domain: "CONTENT",
      actionType: "PROPOSAL_SUBMITTED",
      entityType: "roadmap_proposals",
      entityId: (created as any)?.id || "new",
      status: "COMPLETED",
    }),
  },
  async (_, { body }) => {
    const clean = sanitizeHoneypotFields(body)

    const [created] = await db
      .insert(roadmapProposals)
      .values({
        title: clean.title!,
        scope: clean.scope || "monorepo",
        rationale: clean.rationale!,
        authorName: clean.authorName,
        authorEmail: clean.authorEmail,
        status: "SUBMITTED",
        upvotesCount: 1,
        updatedAt: new Date(),
      })
      .returning()

    if (!created) {
      throw new Error("Failed to submit roadmap proposal.")
    }

    return apiCreated(created)
  }
)
