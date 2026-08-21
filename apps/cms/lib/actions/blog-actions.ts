"use server"

import { db, eq, desc, asc } from "@workspace/db"
import { posts, categories, tags } from "@workspace/db/schema"
import { revalidatePath } from "next/cache"

export async function getPosts() {
  return await db.select().from(posts).orderBy(desc(posts.createdAt))
}

export async function getPostById(id: string) {
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  return post || null
}

export async function createPost(values: typeof posts.$inferInsert) {
  const [created] = await db.insert(posts).values(values).returning()
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
  revalidatePath("/blog")
  return updated
}

export async function deletePost(id: string) {
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath("/blog")
}

export async function getBlogCategories() {
  return await db.select().from(categories).orderBy(asc(categories.name))
}

export async function createBlogCategory(
  values: typeof categories.$inferInsert
) {
  const [created] = await db.insert(categories).values(values).returning()
  revalidatePath("/blog")
  return created
}

export async function deleteBlogCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath("/blog")
}

export async function getBlogTags() {
  return await db.select().from(tags).orderBy(asc(tags.name))
}

export async function createBlogTag(values: typeof tags.$inferInsert) {
  const [created] = await db.insert(tags).values(values).returning()
  revalidatePath("/blog")
  return created
}

export async function deleteBlogTag(id: string) {
  await db.delete(tags).where(eq(tags.id, id))
  revalidatePath("/blog")
}
