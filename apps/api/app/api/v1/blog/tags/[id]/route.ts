import { db, eq, or } from "@workspace/db"
import { tags } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateTagSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const idOrSlug = String(params.id)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug
      )

    const [item] = await db
      .select()
      .from(tags)
      .where(
        isUuid
          ? or(eq(tags.id, idOrSlug), eq(tags.slug, idOrSlug))
          : eq(tags.slug, idOrSlug)
      )
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Tag '${idOrSlug}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateTagSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CONTENT",
      actionType: "TAG_UPDATED",
      entityType: "tags",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(tags)
      .set(body)
      .where(eq(tags.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Tag with ID '${id}' not found.`)
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
      actionType: "TAG_DELETED",
      entityType: "tags",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db.delete(tags).where(eq(tags.id, id)).returning()

    if (!deleted) {
      throw new NotFoundError(`Tag with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
