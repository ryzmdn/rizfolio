import { db, eq, or } from "@workspace/db"
import {
  posts,
  postCategories,
  postTags,
  postViews,
  postReactions,
  categories,
  tags,
} from "@workspace/db/schema"
import { createApiHandler, apiSuccess, NotFoundError } from "@/lib/api"
import { updatePostSchema } from "@/lib/validations"

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

    const [post] = await db
      .select()
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

    // Fetch categories
    const postCats = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(postCategories)
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(postCategories.postId, post.id))

    // Fetch tags
    const postTagList = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, post.id))

    // Fetch views
    const [views] = await db
      .select()
      .from(postViews)
      .where(eq(postViews.postId, post.id))
      .limit(1)

    // Fetch reactions
    const reactionList = await db
      .select()
      .from(postReactions)
      .where(eq(postReactions.postId, post.id))

    return apiSuccess({
      ...post,
      categories: postCats,
      tags: postTagList,
      views: views?.viewCount ?? 0,
      reactions: reactionList,
    })
  }
)

export const PUT = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: updatePostSchema,
    auditConfig: (_, { params, body }) => ({
      domain: "CONTENT",
      actionType: "POST_UPDATED",
      entityType: "posts",
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
      .from(posts)
      .where(
        isUuid
          ? or(eq(posts.id, slugOrId), eq(posts.slug, slugOrId))
          : eq(posts.slug, slugOrId)
      )
      .limit(1)

    if (!existing) {
      throw new NotFoundError(`Post '${slugOrId}' not found.`)
    }

    const { categoryIds, tagIds, publishedAt, ...postData } = body

    const [updated] = await db
      .update(posts)
      .set({
        ...postData,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, existing.id))
      .returning()

    if (categoryIds !== undefined) {
      await db
        .delete(postCategories)
        .where(eq(postCategories.postId, existing.id))

      for (const catId of categoryIds) {
        await db
          .insert(postCategories)
          .values({ postId: existing.id, categoryId: catId })
          .onConflictDoNothing()
      }
    }

    if (tagIds !== undefined) {
      await db.delete(postTags).where(eq(postTags.postId, existing.id))

      for (const tId of tagIds) {
        await db
          .insert(postTags)
          .values({ postId: existing.id, tagId: tId })
          .onConflictDoNothing()
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
      actionType: "POST_DELETED",
      entityType: "posts",
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
      .delete(posts)
      .where(
        isUuid
          ? or(eq(posts.id, slugOrId), eq(posts.slug, slugOrId))
          : eq(posts.slug, slugOrId)
      )
      .returning()

    if (!deleted) {
      throw new NotFoundError(`Post '${slugOrId}' not found.`)
    }

    return apiSuccess({ deleted: true, id: deleted.id, slug: deleted.slug })
  }
)
