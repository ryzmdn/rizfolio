"use server"

import { db, eq, desc, asc } from "@workspace/db"
import { posts, categories, tags } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"

export async function getPosts() {
  try {
    return await db.select().from(posts).orderBy(desc(posts.createdAt))
  } catch (error) {
    console.error(
      "[CMS Blog] Failed to fetch posts:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getPostById(id: string) {
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)
    return post || null
  } catch (error) {
    console.error(
      "[CMS Blog] Failed to fetch post by ID:",
      error instanceof Error ? error.message : error
    )
    return null
  }
}

export async function createPost(values: typeof posts.$inferInsert) {
  const [created] = await db.insert(posts).values(values).returning()
  if (created) {
    logTransaction({
      domain: "CONTENT",
      actionType:
        created.status === "PUBLISHED" ? "POST_PUBLISHED" : "POST_DRAFTED",
      status: "COMPLETED",
      entityType: "posts",
      entityId: created.id,
      postId: created.id,
      payloadAfter: {
        slug: created.slug,
        title: created.title,
        status: created.status,
      },
    })
  }
  revalidatePath("/blog")
  return created
}

export async function updatePost(
  id: string,
  values: Partial<typeof posts.$inferInsert>
) {
  const [updated] = await db
    .update(posts)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning()
  if (updated) {
    logTransaction({
      domain: "CONTENT",
      actionType: "POST_UPDATED",
      status: "COMPLETED",
      entityType: "posts",
      entityId: updated.id,
      postId: updated.id,
      payloadAfter: {
        slug: updated.slug,
        title: updated.title,
        status: updated.status,
      },
    })
  }
  revalidatePath("/blog")
  return updated
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id))
  logTransaction({
    domain: "CONTENT",
    actionType: "POST_DELETED",
    status: "COMPLETED",
    entityType: "posts",
    entityId: id,
    postId: id,
  })
  revalidatePath("/blog")
}

export async function getBlogCategories() {
  try {
    return await db.select().from(categories).orderBy(asc(categories.name))
  } catch (error) {
    console.error(
      "[CMS Blog] Failed to fetch categories:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createBlogCategory(
  values: typeof categories.$inferInsert
) {
  const [created] = await db.insert(categories).values(values).returning()
  if (created) {
    logTransaction({
      domain: "CONTENT",
      actionType: "CATEGORY_CREATED",
      status: "COMPLETED",
      entityType: "categories",
      entityId: created.id,
    })
  }
  revalidatePath("/blog")
  return created
}

export async function deleteBlogCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id))
  logTransaction({
    domain: "CONTENT",
    actionType: "CATEGORY_DELETED",
    status: "COMPLETED",
    entityType: "categories",
    entityId: id,
  })
  revalidatePath("/blog")
}

export async function getBlogTags() {
  try {
    return await db.select().from(tags).orderBy(asc(tags.name))
  } catch (error) {
    console.error(
      "[CMS Blog] Failed to fetch tags:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function createBlogTag(values: typeof tags.$inferInsert) {
  const [created] = await db.insert(tags).values(values).returning()
  if (created) {
    logTransaction({
      domain: "CONTENT",
      actionType: "TAG_CREATED",
      status: "COMPLETED",
      entityType: "tags",
      entityId: created.id,
    })
  }
  revalidatePath("/blog")
  return created
}

export async function deleteBlogTag(id: string) {
  await db.delete(tags).where(eq(tags.id, id))
  logTransaction({
    domain: "CONTENT",
    actionType: "TAG_DELETED",
    status: "COMPLETED",
    entityType: "tags",
    entityId: id,
  })
  revalidatePath("/blog")
}
