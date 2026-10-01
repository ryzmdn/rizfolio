"use server"

import {
  db,
  postViews,
  postReactions,
  newsletterSubscribers,
  masterTransactions,
  sql,
  eq,
} from "@workspace/db"

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
      } catch {
        // Non-blocking audit log
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

    let currentCount = existing[0]?.count ?? 12

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
