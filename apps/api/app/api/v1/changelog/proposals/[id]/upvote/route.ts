import { db, eq, sql } from "@workspace/db"
import { roadmapProposals } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
  },
  async (_, { params }) => {
    const id = String(params.id)

    const [updated] = await db
      .update(roadmapProposals)
      .set({
        upvotesCount: sql`${roadmapProposals.upvotesCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(roadmapProposals.id, id))
      .returning()

    if (!updated) {
      throw new NotFoundError(`Proposal with ID '${id}' not found.`)
    }

    return apiSuccess({
      id: updated.id,
      upvotesCount: updated.upvotesCount,
    })
  }
)
