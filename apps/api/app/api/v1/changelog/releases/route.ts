import { db, desc, asc, eq } from "@workspace/db"
import { changelogs, changelogItems } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, apiCreated } from "@/lib/api"
import { createChangelogSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async () => {
    const releases = await db
      .select()
      .from(changelogs)
      .orderBy(desc(changelogs.createdAt))

    const result = []
    for (const rel of releases) {
      const items = await db
        .select()
        .from(changelogItems)
        .where(eq(changelogItems.changelogId, rel.id))
        .orderBy(asc(changelogItems.displayOrder))

      result.push({
        ...rel,
        items,
      })
    }

    return apiSuccess(result)
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createChangelogSchema,
    auditConfig: (created) => {
      const rel = created as { version?: string; id?: string } | undefined
      return {
        domain: "CONTENT",
        actionType: "CHANGELOG_CREATED",
        entityType: "changelogs",
        entityId: rel?.version || "version",
        changelogId: rel?.id,
        status: "COMPLETED",
      }
    },
  },
  async (_, { body }) => {
    const { items, ...changelogData } = body

    const [created] = await db
      .insert(changelogs)
      .values(changelogData)
      .returning()

    if (!created) {
      throw new Error("Failed to create changelog record.")
    }

    if (items && items.length > 0) {
      for (const item of items) {
        await db.insert(changelogItems).values({
          changelogId: created.id,
          category: item.category,
          description: item.description,
          displayOrder: item.displayOrder,
        })
      }
    }

    return apiCreated(created)
  }
)
