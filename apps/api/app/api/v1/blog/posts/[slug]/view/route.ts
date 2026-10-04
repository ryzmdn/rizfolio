import { db, eq, sql, or } from "@workspace/db"
import { posts, postViews } from "@workspace/db/schema"
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

    const [updated] = await db
      .insert(postViews)
      .values({
        postId: post.id,
        viewCount: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: postViews.postId,
        set: {
          viewCount: sql`${postViews.viewCount} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning()

    return apiSuccess({
      postId: post.id,
      viewCount: updated ? updated.viewCount : 1,
    })
  }
)
