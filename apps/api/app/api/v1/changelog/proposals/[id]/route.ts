import { db, eq } from "@workspace/db"
import { roadmapProposals } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateRoadmapProposalStatusSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(roadmapProposals)
      .where(eq(roadmapProposals.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Proposal with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PATCH = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateRoadmapProposalStatusSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CONTENT",
      actionType: "PROPOSAL_STATUS_UPDATED",
      entityType: "roadmap_proposals",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(roadmapProposals)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(roadmapProposals.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Proposal with ID '${id}' not found.`)
    }

    return apiSuccess(updated)
  }
)

export const DELETE = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    auditConfig: (_, { params }) => ({
      domain: "CONTENT",
      actionType: "PROPOSAL_DELETED",
      entityType: "roadmap_proposals",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(roadmapProposals)
      .where(eq(roadmapProposals.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Proposal with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
