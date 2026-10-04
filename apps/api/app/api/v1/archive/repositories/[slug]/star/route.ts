import { db, eq, sql, or } from "@workspace/db"
import { repositories } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
  },
  async (_, { params }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [updated] = await db
      .update(repositories)
      .set({
        starsCount: sql`${repositories.starsCount} + 1`,
        updatedAt: new Date(),
      })
      .where(
        isUuid
          ? or(eq(repositories.id, slugOrId), eq(repositories.slug, slugOrId))
          : eq(repositories.slug, slugOrId)
      )
      .returning()

    if (!updated) {
      throw new NotFoundError(`Repository '${slugOrId}' not found.`)
    }

    return apiSuccess({
      slug: updated.slug,
      starsCount: updated.starsCount,
    })
  }
)
