import { db, eq, or, asc } from "@workspace/db"
import { changelogs, changelogItems } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updateChangelogSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const versionOrId = String(params.version)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        versionOrId
      )

    const [release] = await db
      .select()
      .from(changelogs)
      .where(
        isUuid
          ? or(
              eq(changelogs.id, versionOrId),
              eq(changelogs.version, versionOrId)
            )
          : eq(changelogs.version, versionOrId)
      )
      .limit(1)

    if (!release) {
      throw new NotFoundError(`Changelog release '${versionOrId}' not found.`)
    }

    const items = await db
      .select()
      .from(changelogItems)
      .where(eq(changelogItems.changelogId, release.id))
      .orderBy(asc(changelogItems.displayOrder))

    return apiSuccess({
      ...release,
      items,
    })
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updateChangelogSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CONTENT",
      actionType: "CHANGELOG_UPDATED",
      entityType: "changelogs",
      entityId: String(params.version),
      payloadAfter: body,
      status: "COMPLETED",
    }),
  },
  async (_, { params, body }) => {
    const versionOrId = String(params.version)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        versionOrId
      )

    const [existing] = await db
      .select()
      .from(changelogs)
      .where(
        isUuid
          ? or(
              eq(changelogs.id, versionOrId),
              eq(changelogs.version, versionOrId)
            )
          : eq(changelogs.version, versionOrId)
      )
      .limit(1)

    if (!existing) {
      throw new NotFoundError(`Changelog release '${versionOrId}' not found.`)
    }

    const { items, ...changelogData } = body

    const [updated] = await db
      .update(changelogs)
      .set(changelogData)
      .where(eq(changelogs.id, existing.id))
      .returning()

    if (items !== undefined) {
      await db
        .delete(changelogItems)
        .where(eq(changelogItems.changelogId, existing.id))

      for (const item of items) {
        await db.insert(changelogItems).values({
          changelogId: existing.id,
          category: item.category,
          description: item.description,
          displayOrder: item.displayOrder,
        })
      }
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
      actionType: "CHANGELOG_DELETED",
      entityType: "changelogs",
      entityId: String(params.version),
      status: "COMPLETED",
    }),
  },
  async (_, { params }) => {
    const versionOrId = String(params.version)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        versionOrId
      )

    const [deleted] = await db
      .delete(changelogs)
      .where(
        isUuid
          ? or(
              eq(changelogs.id, versionOrId),
              eq(changelogs.version, versionOrId)
            )
          : eq(changelogs.version, versionOrId)
      )
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Changelog release '${versionOrId}' not found.`)
    }

    return apiSuccess({
      deleted: true,
      id: deleted.id,
      version: deleted.version,
    })
  }
)
