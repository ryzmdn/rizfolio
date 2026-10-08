import { db, eq, or } from "@workspace/db"
import { categories } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateCategorySchema } from "@/lib/validations"

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
      .from(categories)
      .where(
        isUuid
          ? or(eq(categories.id, idOrSlug), eq(categories.slug, idOrSlug))
          : eq(categories.slug, idOrSlug)
      )
      .limit(1)

    if (!item) {
      throw new NotFoundError(`Category '${idOrSlug}' not found.`)
    }

    return apiSuccess(item)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateCategorySchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CONTENT",
      actionType: "CATEGORY_UPDATED",
      entityType: "categories",
      entityId: String(params.id),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const id = String(params.id)
    const [updated] = await db
      .update(categories)
      .set(body)
      .where(eq(categories.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Category with ID '${id}' not found.`)
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
      actionType: "CATEGORY_DELETED",
      entityType: "categories",
      entityId: String(params.id),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const id = String(params.id)
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Category with ID '${id}' not found.`)
    }

    return apiSuccess({ deleted: true, id })
  }
)
