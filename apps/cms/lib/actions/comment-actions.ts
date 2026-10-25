"use server"

import { db, eq, desc, or, and, ilike, inArray } from "@workspace/db"
import { postComments, posts } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "../auth-actions"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"

export type CommentStatus = "APPROVED" | "PENDING" | "SPAM" | "REJECTED"

export interface AdminCommentItem {
  id: string
  postId: string
  parentId: string | null
  authorName: string
  authorEmail: string
  content: string
  status: string
  createdAt: Date
  updatedAt: Date
  postTitle: string | null
  postSlug: string | null
}

export interface CommentFilterParams {
  status?: string
  search?: string
  postId?: string
}

export interface CommentStats {
  total: number
  pending: number
  approved: number
  spam: number
  rejected: number
}

export async function getCommentsAdmin(
  filter: CommentFilterParams = {}
): Promise<AdminCommentItem[]> {
  try {
    const conditions = []

    if (filter.status && filter.status !== "ALL") {
      conditions.push(eq(postComments.status, filter.status))
    }

    if (filter.postId) {
      conditions.push(eq(postComments.postId, filter.postId))
    }

    if (filter.search && filter.search.trim()) {
      const term = `%${filter.search.trim()}%`
      conditions.push(
        or(
          ilike(postComments.authorName, term),
          ilike(postComments.authorEmail, term),
          ilike(postComments.content, term),
          ilike(posts.title, term)
        )
      )
    }

    const whereClause =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : and(...conditions)
        : undefined

    const query = db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        parentId: postComments.parentId,
        authorName: postComments.authorName,
        authorEmail: postComments.authorEmail,
        content: postComments.content,
        status: postComments.status,
        createdAt: postComments.createdAt,
        updatedAt: postComments.updatedAt,
        postTitle: posts.title,
        postSlug: posts.slug,
      })
      .from(postComments)
      .leftJoin(posts, eq(postComments.postId, posts.id))
      .orderBy(desc(postComments.createdAt))

    if (whereClause) {
      return (await query.where(whereClause)) as AdminCommentItem[]
    }

    return (await query) as AdminCommentItem[]
  } catch (error) {
    console.error(
      "[CMS Comments] Failed to fetch comments:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getCommentStats(): Promise<CommentStats> {
  try {
    const rows = await db
      .select({ status: postComments.status })
      .from(postComments)

    const stats: CommentStats = {
      total: rows.length,
      pending: 0,
      approved: 0,
      spam: 0,
      rejected: 0,
    }

    for (const row of rows) {
      const s = (row.status || "").toUpperCase()
      if (s === "PENDING") stats.pending++
      else if (s === "APPROVED") stats.approved++
      else if (s === "SPAM") stats.spam++
      else if (s === "REJECTED") stats.rejected++
    }

    return stats
  } catch (error) {
    console.error(
      "[CMS Comments] Failed to calculate comment stats:",
      error instanceof Error ? error.message : error
    )
    return {
      total: 0,
      pending: 0,
      approved: 0,
      spam: 0,
      rejected: 0,
    }
  }
}

export async function updateCommentStatusAction(
  id: string,
  status: CommentStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { success: false, error: "Sesi otentikasi tidak valid." }
    }

    const [comment] = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, id))
      .limit(1)

    if (!comment) {
      return { success: false, error: "Komentar tidak ditemukan." }
    }

    await db
      .update(postComments)
      .set({ status, updatedAt: new Date() })
      .where(eq(postComments.id, id))

    logTransaction({
      domain: "CONTENT",
      actionType: "COMMENT_STATUS_UPDATED",
      status: "COMPLETED",
      actorId: session.userId,
      actorType: "OWNER",
      entityType: "post_comments",
      entityId: id,
      postId: comment.postId,
      metadata: {
        previousStatus: comment.status,
        newStatus: status,
        authorEmail: comment.authorEmail,
      },
    })

    dispatchBackgroundRevalidation([
      { app: "blog", path: "/blog" },
      { app: "blog", path: "/" },
    ])

    revalidatePath("/comments")
    return { success: true }
  } catch (error) {
    console.error(
      "[CMS Comments] Failed to update comment status:",
      error instanceof Error ? error.message : error
    )
    return {
      success: false,
      error: "Gagal memperbarui status komentar.",
    }
  }
}

export async function batchUpdateCommentsStatusAction(
  ids: string[],
  status: CommentStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { success: false, error: "Sesi otentikasi tidak valid." }
    }

    if (!ids || ids.length === 0) {
      return { success: false, error: "Pilih setidaknya satu komentar." }
    }

    await db
      .update(postComments)
      .set({ status, updatedAt: new Date() })
      .where(inArray(postComments.id, ids))

    logTransaction({
      domain: "CONTENT",
      actionType: "COMMENTS_BATCH_STATUS_UPDATED",
      status: "COMPLETED",
      actorId: session.userId,
      actorType: "OWNER",
      entityType: "post_comments",
      entityId: ids[0] || "batch",
      metadata: {
        count: ids.length,
        newStatus: status,
        ids,
      },
    })

    dispatchBackgroundRevalidation([
      { app: "blog", path: "/blog" },
      { app: "blog", path: "/" },
    ])

    revalidatePath("/comments")
    return { success: true }
  } catch (error) {
    console.error(
      "[CMS Comments] Batch status update failed:",
      error instanceof Error ? error.message : error
    )
    return {
      success: false,
      error: "Gagal memperbarui status kumpulan komentar.",
    }
  }
}

export async function deleteCommentAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { success: false, error: "Sesi otentikasi tidak valid." }
    }

    const [comment] = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, id))
      .limit(1)

    if (!comment) {
      return { success: false, error: "Komentar tidak ditemukan." }
    }

    await db.delete(postComments).where(eq(postComments.id, id))

    logTransaction({
      domain: "CONTENT",
      actionType: "COMMENT_DELETED",
      status: "COMPLETED",
      actorId: session.userId,
      actorType: "OWNER",
      entityType: "post_comments",
      entityId: id,
      postId: comment.postId,
      metadata: {
        authorEmail: comment.authorEmail,
        authorName: comment.authorName,
      },
    })

    dispatchBackgroundRevalidation([
      { app: "blog", path: "/blog" },
      { app: "blog", path: "/" },
    ])

    revalidatePath("/comments")
    return { success: true }
  } catch (error) {
    console.error(
      "[CMS Comments] Failed to delete comment:",
      error instanceof Error ? error.message : error
    )
    return {
      success: false,
      error: "Gagal menghapus komentar.",
    }
  }
}

export async function batchDeleteCommentsAction(
  ids: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getCurrentUser()
    if (!session) {
      return { success: false, error: "Sesi otentikasi tidak valid." }
    }

    if (!ids || ids.length === 0) {
      return { success: false, error: "Pilih setidaknya satu komentar." }
    }

    await db.delete(postComments).where(inArray(postComments.id, ids))

    logTransaction({
      domain: "CONTENT",
      actionType: "COMMENTS_BATCH_DELETED",
      status: "COMPLETED",
      actorId: session.userId,
      actorType: "OWNER",
      entityType: "post_comments",
      entityId: ids[0] || "batch",
      metadata: {
        count: ids.length,
        ids,
      },
    })

    dispatchBackgroundRevalidation([
      { app: "blog", path: "/blog" },
      { app: "blog", path: "/" },
    ])

    revalidatePath("/comments")
    return { success: true }
  } catch (error) {
    console.error(
      "[CMS Comments] Batch delete failed:",
      error instanceof Error ? error.message : error
    )
    return {
      success: false,
      error: "Gagal menghapus kumpulan komentar terpilih.",
    }
  }
}
