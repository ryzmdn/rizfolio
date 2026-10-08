import { db, eq, sql } from "@workspace/db"
import { bioLinks } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
  },
  async (_, { params }) => {
    const id = String(params.id)

    const [updated] = await db
      .update(bioLinks)
      .set({
        clickCount: sql`${bioLinks.clickCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(bioLinks.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Bio link with ID '${id}' not found.`)
    }

    return apiSuccess({
      id: updated.id,
      clickCount: updated.clickCount,
    })
  }
)
