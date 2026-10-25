import { db, eq, and, asc } from "@workspace/db"
import { posts, postComments, masterTransactions } from "@workspace/db/schema"
import {
  createApiHandler,
  apiSuccess,
  apiCreated,
  NotFoundError,
  BadRequestError,
} from "@/lib/api"
import { createCommentSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export const GET = createApiHandler(
  {
    rateLimitTier: "PUBLIC_READ",
  },
  async (_, { params }) => {
    const slug = String(params.slug)

    const [post] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (!post) {
      throw new NotFoundError(`Post with slug '${slug}' not found.`)
    }

    const comments = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        parentId: postComments.parentId,
        authorName: postComments.authorName,
        content: postComments.content,
        createdAt: postComments.createdAt,
      })
      .from(postComments)
      .where(
        and(
          eq(postComments.postId, post.id),
          eq(postComments.status, "APPROVED")
        )
      )
      .orderBy(asc(postComments.createdAt))

    return apiSuccess(comments)
  }
)

export const POST = createApiHandler(
  {
    rateLimitTier: "PUBLIC_MUTATION",
    schema: createCommentSchema,
  },
  async (_, { params, body }) => {
    const slug = String(params.slug)

    const [post] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (!post) {
      throw new NotFoundError(`Post with slug '${slug}' not found.`)
    }

    if (body.parentId) {
      const [parent] = await db
        .select({ id: postComments.id, postId: postComments.postId })
        .from(postComments)
        .where(eq(postComments.id, body.parentId))
        .limit(1)

      if (!parent || parent.postId !== post.id) {
        throw new BadRequestError("Parent comment not found on this post.")
      }
    }

    const [newComment] = await db
      .insert(postComments)
      .values({
        postId: post.id,
        parentId: body.parentId || null,
        authorName: body.authorName.trim(),
        authorEmail: body.authorEmail.trim().toLowerCase(),
        content: body.content.trim(),
        status: "APPROVED",
      })
      .returning({
        id: postComments.id,
        postId: postComments.postId,
        parentId: postComments.parentId,
        authorName: postComments.authorName,
        content: postComments.content,
        createdAt: postComments.createdAt,
      })

    if (!newComment) {
      throw new BadRequestError("Failed to persist post comment.")
    }

    try {
      await db.insert(masterTransactions).values({
        trxNumber: `CMT-${Date.now().toString(36).toUpperCase()}`,
        domain: "CONTENT",
        actionType: "COMMENT_CREATED",
        status: "COMPLETED",
        actorType: "CUSTOMER",
        entityType: "post_comments",
        entityId: newComment.id,
        postId: post.id,
        metadata: {
          authorName: body.authorName.trim(),
          authorEmail: body.authorEmail.trim().toLowerCase(),
        },
      })
    } catch (auditError) {
      void auditError
    }

    return apiCreated(newComment)
  }
)
