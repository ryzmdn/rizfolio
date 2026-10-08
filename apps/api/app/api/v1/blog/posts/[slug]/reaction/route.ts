import { db, eq, sql, and, or } from "@workspace/db"
import { posts, postReactions } from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { postReactionSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: postReactionSchema,
  },
  async (_, { params, body }) => {
    const slugOrId = String(params.slug)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        slugOrId
      )

    const [post] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        isUuid
          ? or(eq(posts.id, slugOrId), eq(posts.slug, slugOrId))
          : eq(posts.slug, slugOrId)
      )
      .limit(1)

    if (!post) {
      throw new NotFoundError(`Post '${slugOrId}' not found.`)
    }

    const reactionType = body.reactionType || "LIKE"

    const [existing] = await db
      .select()
      .from(postReactions)
      .where(
        and(
          eq(postReactions.postId, post.id),
          eq(postReactions.reactionType, reactionType)
        )
      )
      .limit(1)

    if (existing) {
      const [updated] = await db
        .update(postReactions)
        .set({
          count: sql`${postReactions.count} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(postReactions.id, existing.id))
        .returning()

      return apiSuccess({
        postId: post.id,
        reactionType,
        count: updated ? updated.count : existing.count + 1,
      })
    }

    const [created] = await db
      .insert(postReactions)
      .values({
        postId: post.id,
        reactionType,
        count: 1,
        updatedAt: new Date(),
      })
      .returning()

    return apiSuccess({
      postId: post.id,
      reactionType,
      count: created ? created.count : 1,
    })
  }
)
