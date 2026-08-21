"use server"

import { db, postViews, sql } from "@workspace/db"

export async function incrementPostView(postId: string): Promise<{ success: boolean; viewCount?: number }> {
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
