import { db, eq } from "@workspace/db"
import { roadmapItems } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateRoadmapItemSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [item] = await db
      .select()
      .from(roadmapItems)
      .where(eq(roadmapItems.id, id))
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Roadmap item with ID '${id}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateRoadmapItemSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CONTENT",
      actionType: "ROADMAP_ITEM_UPDATED",
      entityType: "roadmap_items",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(roadmapItems)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(roadmapItems.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Roadmap item with ID '${id}' not found.`)
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
      actionType: "ROADMAP_ITEM_DELETED",
      entityType: "roadmap_items",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(roadmapItems)
      .where(eq(roadmapItems.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Roadmap item with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
