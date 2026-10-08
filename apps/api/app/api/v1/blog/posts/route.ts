import { db, desc, eq, count, ilike, and } from "@workspace/db"
import {
  posts,
  postCategories,
  postTags,
  postViews,
  postReactions,
} from "@workspace/db/schema"
import { createApiHandler, apiCreated, apiPaginated } from "@/lib/api"
import { queryPostsSchema, createPostSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (request) => {
    const url = new URL(request.url)
    const query = queryPostsSchema.parse({
      page: url.searchParams.get("page") || 1,
      limit: url.searchParams.get("limit") || 10,
      search: url.searchParams.get("search") || undefined,
      status: url.searchParams.get("status") || undefined,
      category: url.searchParams.get("category") || undefined,
      tag: url.searchParams.get("tag") || undefined,
    })

    const conditions = []

    if (query.status) {
      conditions.push(eq(posts.status, query.status))
    }

    if (query.search) {
      conditions.push(ilike(posts.title, `%${query.search}%`))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined
    const offset = (query.page - 1) * query.limit

    const [totalRecord] = await db
      .select({ value: count() })
      .from(posts)
      .where(whereClause)

    const total = totalRecord?.value ?? 0
    const totalPages = Math.ceil(total / query.limit) || 1

    const postList = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
      .limit(query.limit)
      .offset(offset)

    return apiPaginated(postList, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    })
  }
)

export const POST = createApiHandler(
  {
    requireAuth: true,
    requiredRole: "OWNER",
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createPostSchema,
    auditConfig: (created) => {
      const p = created as { id?: string } | undefined
      return {
        domain: "CONTENT",
        actionType: "POST_CREATED",
        entityType: "posts",
        entityId: p?.id || "new",
        postId: p?.id,
        status: "COMPLETED",
      }
    },
  },
  async (_, { body }) => {
    const { categoryIds, tagIds, publishedAt, ...postData } = body

    const [created] = await db
      .insert(posts)
      .values({
        ...postData,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        updatedAt: new Date(),
      })
      .returning()

    if (!created) {
      throw new Error("Failed to create post record in database.")
    }

    if (categoryIds && categoryIds.length > 0) {
      for (const catId of categoryIds) {
        await db
          .insert(postCategories)
          .values({ postId: created.id, categoryId: catId })
          .onConflictDoNothing()
      }
    }

    if (tagIds && tagIds.length > 0) {
      for (const tId of tagIds) {
        await db
          .insert(postTags)
          .values({ postId: created.id, tagId: tId })
          .onConflictDoNothing()
      }
    }

    await db
      .insert(postViews)
      .values({ postId: created.id, viewCount: 0 })
      .onConflictDoNothing()

    await db
      .insert(postReactions)
      .values({ postId: created.id, reactionType: "LIKE", count: 0 })
      .onConflictDoNothing()

    return apiCreated(created)
  }
)
