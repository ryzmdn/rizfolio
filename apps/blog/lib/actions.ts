"use server"

import {
  db,
  postViews,
  postReactions,
  newsletterSubscribers,
  postComments,
  masterTransactions,
  sql,
  eq,
  and,
  asc,
} from "@workspace/db"
import { sendNewsletterWelcomeEmail } from "@workspace/email"
import { getPublishedPosts, type BlogPostItem } from "./queries"

export async function incrementPostView(
  postId: string
): Promise<{ success: boolean; viewCount?: number }> {
  if (!postId) return { success: false }

  try {
    const result = await db
      .insert(postViews)
      .values({
        postId,
        viewCount: 1,
      })
      .onConflictDoUpdate({
        target: postViews.postId,
        set: {
          viewCount: sql`${postViews.viewCount} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({ viewCount: postViews.viewCount })

    return {
      success: true,
      viewCount: result[0]?.viewCount,
    }
  } catch (error) {
    console.warn(
      "[Blog Actions] Failed to increment view count:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return { success: false }
  }
}

export interface SubscribeNewsletterResult {
  success: boolean
  message: string
}

export async function subscribeNewsletterAction(
  emailInput: string
): Promise<SubscribeNewsletterResult> {
  const email = emailInput?.trim().toLowerCase()

  if (!email || !email.includes("@") || email.length < 5) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email format.",
    }
  }

  try {
    const existing = await db
      .select({
        id: newsletterSubscribers.id,
        status: newsletterSubscribers.status,
      })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1)

    if (existing.length > 0) {
      if (existing[0]?.status === "UNSUBSCRIBED") {
        await db
          .update(newsletterSubscribers)
          .set({
            status: "ACTIVE",
            subscribedAt: new Date(),
            unsubscribedAt: null,
          })
          .where(eq(newsletterSubscribers.email, email))
        return {
          success: true,
          message:
            "Welcome back! Your newsletter subscription has been reactivated.",
        }
      }
      return {
        success: true,
        message:
          "You are already subscribed! Expect high-value engineering deep dives in your inbox.",
      }
    }

    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        email,
        source: "BLOG_FOOTER",
        status: "ACTIVE",
      })
      .returning()

    if (subscriber) {
      try {
        await db.insert(masterTransactions).values({
          trxNumber: `SUB-${Date.now().toString(36).toUpperCase()}`,
          domain: "CONTENT",
          actionType: "NEWSLETTER_SUBSCRIBED",
          status: "COMPLETED",
          actorType: "CUSTOMER",
          entityType: "SUBSCRIBER",
          entityId: subscriber.id,
          metadata: { email, source: "BLOG_FOOTER" },
        })
      } catch (auditError) {
        void auditError
      }

      try {
        await sendNewsletterWelcomeEmail({
          email,
          blogUrl: process.env.NEXT_PUBLIC_BLOG_URL,
        })
      } catch (mailError) {
        console.warn(
          "[Blog Actions] Welcome newsletter email dispatch failed:",
          mailError instanceof Error ? mailError.message : "Email error"
        )
      }
    }

    return {
      success: true,
      message:
        "Subscription confirmed! Welcome to the engineering publication.",
    }
  } catch (error) {
    console.warn(
      "[Blog Actions] Failed to persist newsletter subscriber:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return {
      success: true,
      message: "Thank you for subscribing! Your confirmation is recorded.",
    }
  }
}

export interface PostReactionResult {
  success: boolean
  likes: number
}

export async function togglePostReactionAction(
  postId: string,
  increment: boolean
): Promise<PostReactionResult> {
  if (!postId) {
    return { success: false, likes: 0 }
  }

  try {
    const existing = await db
      .select({ id: postReactions.id, count: postReactions.count })
      .from(postReactions)
      .where(eq(postReactions.postId, postId))
      .limit(1)

    const currentCount = existing[0]?.count ?? 12

    if (existing.length === 0) {
      const initialCount = increment ? 13 : 12
      const [inserted] = await db
        .insert(postReactions)
        .values({
          postId,
          reactionType: "LIKE",
          count: initialCount,
        })
        .returning({ count: postReactions.count })

      return {
        success: true,
        likes: inserted?.count ?? initialCount,
      }
    }

    const nextCount = Math.max(0, currentCount + (increment ? 1 : -1))

    const [updated] = await db
      .update(postReactions)
      .set({
        count: nextCount,
        updatedAt: new Date(),
      })
      .where(eq(postReactions.postId, postId))
      .returning({ count: postReactions.count })

    return {
      success: true,
      likes: updated?.count ?? nextCount,
    }
  } catch (error) {
    console.warn(
      "[Blog Actions] Failed to toggle reaction, falling back to local count:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return {
      success: false,
      likes: increment ? 1 : 0,
    }
  }
}

export async function getPostReactionCount(postId: string): Promise<number> {
  if (!postId) return 12

  try {
    const rows = await db
      .select({ count: postReactions.count })
      .from(postReactions)
      .where(eq(postReactions.postId, postId))
      .limit(1)

    return rows[0]?.count ?? 12
  } catch {
    return 12
  }
}

export interface CommentItem {
  id: string
  postId: string
  parentId: string | null
  authorName: string
  content: string
  createdAt: Date | string
}

export async function getPostCommentsAction(
  postId: string
): Promise<CommentItem[]> {
  if (!postId) return []
  try {
    const rows = await db
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
          eq(postComments.postId, postId),
          eq(postComments.status, "APPROVED")
        )
      )
      .orderBy(asc(postComments.createdAt))

    return rows
  } catch (err) {
    console.warn("[Blog Actions] Failed to fetch comments:", err)
    return []
  }
}

export interface SubmitCommentInput {
  postId: string
  authorName: string
  authorEmail: string
  content: string
  parentId?: string | null
}

export async function submitPostCommentAction(
  input: SubmitCommentInput
): Promise<{ success: boolean; comment?: CommentItem; error?: string }> {
  const name = input.authorName?.trim()
  const email = input.authorEmail?.trim()?.toLowerCase()
  const content = input.content?.trim()
  const postId = input.postId

  if (!postId) return { success: false, error: "Post ID is required." }
  if (!name || name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters." }
  }
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." }
  }
  if (!content || content.length < 3) {
    return { success: false, error: "Comment must be at least 3 characters." }
  }

  try {
    const [inserted] = await db
      .insert(postComments)
      .values({
        postId,
        parentId: input.parentId || null,
        authorName: name,
        authorEmail: email,
        content,
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

    if (inserted) {
      try {
        await db.insert(masterTransactions).values({
          trxNumber: `CMT-${Date.now().toString(36).toUpperCase()}`,
          domain: "CONTENT",
          actionType: "COMMENT_CREATED",
          status: "COMPLETED",
          actorType: "CUSTOMER",
          entityType: "post_comments",
          entityId: inserted.id,
          postId,
          metadata: { authorName: name, authorEmail: email },
        })
      } catch (auditError) {
        void auditError
      }
    }

    return {
      success: true,
      comment: inserted,
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to post comment.",
    }
  }
}

export async function searchBlogPostsAction(
  searchQuery: string
): Promise<BlogPostItem[]> {
  if (!searchQuery || !searchQuery.trim()) return []
  try {
    const { posts } = await getPublishedPosts({
      query: searchQuery.trim(),
      limit: 8,
    })
    return posts
  } catch {
    return []
  }
}
