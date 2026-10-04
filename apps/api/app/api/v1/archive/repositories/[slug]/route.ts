import { db, eq, or } from "@workspace/db"
import { repositories } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateRepositorySchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [repo] = await db
      .select()
      .from(repositories)
      .where(
        isUuid
          ? or(eq(repositories.id, slugOrId), eq(repositories.slug, slugOrId))
          : eq(repositories.slug, slugOrId)
      )
      .limit(1)

    if (!repo) {
      throw new NotFoundError(`Repository '${slugOrId}' not found.`)
    }

    return apiSuccess(repo)
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateRepositorySchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CODE_DOCS",
      actionType: "REPOSITORY_UPDATED",
      entityType: "repositories",
      entityId: String(params.slug),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [existing] = await db
      .select()
      .from(repositories)
      .where(
        isUuid
          ? or(eq(repositories.id, slugOrId), eq(repositories.slug, slugOrId))
          : eq(repositories.slug, slugOrId)
      )
      .limit(1)

    if (!existing) {
      throw new NotFoundError(`Repository '${slugOrId}' not found.`)
    }

    const [updated] = await db
      .update(repositories)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(repositories.id, existing.id))
      .returning()

    return apiSuccess(updated)
  }
)

export const DELETE = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    auditConfig: (_, { params }) => ({
      domain: "CODE_DOCS",
      actionType: "REPOSITORY_DELETED",
      entityType: "repositories",
      entityId: String(params.slug),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [deleted] = await db
      .delete(repositories)
      .where(
        isUuid
          ? or(eq(repositories.id, slugOrId), eq(repositories.slug, slugOrId))
          : eq(repositories.slug, slugOrId)
      )
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Repository '${slugOrId}' not found.`)
    }

    return apiSuccess({ deleted: true, id: deleted.id, slug: deleted.slug })
  }
)
