import { db, eq, or } from "@workspace/db"
import { services } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateServiceSchema } from "@/lib/validations"

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
      .from(services)
      .where(
        isUuid
          ? or(eq(services.id, idOrSlug), eq(services.slug, idOrSlug))
          : eq(services.slug, idOrSlug)
      )
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Service '${idOrSlug}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateServiceSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "PORTFOLIO",
      actionType: "SERVICE_UPDATED",
      entityType: "services",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(services)
      .set(body)
      .where(eq(services.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Service with ID '${id}' not found.`)
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
      domain: "PORTFOLIO",
      actionType: "SERVICE_DELETED",
      entityType: "services",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Service with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
