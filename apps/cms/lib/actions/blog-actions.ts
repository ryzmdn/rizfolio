"use server"

import { db, eq, desc, asc } from "@workspace/db"
import {
  posts,
  categories,
  tags,
  postCategories,
  postTags,
} from "@workspace/db/schema"
import {
  insertPostSchema,
  insertCategorySchema,
  insertTagSchema,
} from "@workspace/db"
import { revalidatePath } from "next/cache"
import { logTransaction } from "./transaction-actions"
import { dispatchBackgroundRevalidation } from "../revalidate"

export type CreatePostInput = typeof posts.$inferInsert & {
  categoryIds?: string[]
  tagIds?: string[]
}

export type UpdatePostInput = Partial<typeof posts.$inferInsert> & {
  categoryIds?: string[]
  tagIds?: string[]
}

export async function getPosts() {
  try {
    return await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        contentMd: posts.contentMd,
        coverImageUrl: posts.coverImageUrl,
        status: posts.status,
        readingTime: posts.readingTime,
        isFeatured: posts.isFeatured,
        publishedAt: posts.publishedAt,
        seoTitle: posts.seoTitle,
        seoDesc: posts.seoDesc,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
  } catch (error) {
    console.error(
      "[CMS Blog] Failed to fetch posts:",
      error instanceof Error ? error.message : error
    )
    return []
  }
}

export async function getPostRelationsMap() {
  try {
    const [allPostCategories, allPostTags] = await Promise.all([
      db.select().from(postCategories),
      db.select().from(postTags),
    ])

    const postCategoriesMap: Record<string, string[]> = {}
    for (const item of allPostCategories) {
      if (!postCategoriesMap[item.postId]) {
        postCategoriesMap[item.postId] = []
      }
      postCategoriesMap[item.postId]?.push(item.categoryId)
    }

    const postTagsMap: Record<string, string[]> = {}
    for (const item of allPostTags) {
      if (!postTagsMap[item.postId]) {
        postTagsMap[item.postId] = []
      }
      postTagsMap[item.postId]?.push(item.tagId)
    }

    return { postCategoriesMap, postTagsMap }
  } catch (error) {
    console.error(
      "[CMS Blog] Failed to fetch post relations:",
      error instanceof Error ? error.message : error
    )
    return { postCategoriesMap: {}, postTagsMap: {} }
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

export async function createPost(input: CreatePostInput) {
  const { categoryIds, tagIds, ...rawPostValues } = input
  const postValues = insertPostSchema.parse(rawPostValues)

  const created = await db.transaction(async (tx) => {
    const [inserted] = await tx.insert(posts).values(postValues).returning()

    if (inserted) {
      if (categoryIds && categoryIds.length > 0) {
        await tx.insert(postCategories).values(
          categoryIds.map((categoryId) => ({
            postId: inserted.id,
            categoryId,
          }))
        )
      }

      if (tagIds && tagIds.length > 0) {
        await tx.insert(postTags).values(
          tagIds.map((tagId) => ({
            postId: inserted.id,
            tagId,
          }))
        )
      }
    }

    return inserted
  })

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
    dispatchBackgroundRevalidation({ app: "blog", path: "/" })
  }
  revalidatePath("/blog")
  revalidatePath("/")
  return created
}

export async function updatePost(id: string, input: UpdatePostInput) {
  const { categoryIds, tagIds, ...rawPostValues } = input
  const postValues = insertPostSchema.partial().parse(rawPostValues)

  const updated = await db.transaction(async (tx) => {
    const [saved] = await tx
      .update(posts)
      .set({ ...postValues, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning()

    if (saved) {
      if (Array.isArray(categoryIds)) {
        await tx.delete(postCategories).where(eq(postCategories.postId, id))
        if (categoryIds.length > 0) {
          await tx.insert(postCategories).values(
            categoryIds.map((categoryId) => ({
              postId: id,
              categoryId,
            }))
          )
        }
      }

      if (Array.isArray(tagIds)) {
        await tx.delete(postTags).where(eq(postTags.postId, id))
        if (tagIds.length > 0) {
          await tx.insert(postTags).values(
            tagIds.map((tagId) => ({
              postId: id,
              tagId,
            }))
          )
        }
      }
    }

    return saved
  })

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
    dispatchBackgroundRevalidation([
      { app: "blog", path: "/" },
      { app: "blog", slug: updated.slug, path: `/blog/${updated.slug}` },
    ])
  }
  revalidatePath("/blog")
  revalidatePath("/")
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
  dispatchBackgroundRevalidation({ app: "blog", path: "/" })
  revalidatePath("/blog")
  revalidatePath("/")
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
  const validated = insertCategorySchema.parse(values)
  const [created] = await db.insert(categories).values(validated).returning()
  if (created) {
    logTransaction({
      domain: "CONTENT",
      actionType: "CATEGORY_CREATED",
      status: "COMPLETED",
      entityType: "categories",
      entityId: created.id,
    })
    dispatchBackgroundRevalidation({ app: "blog", path: "/" })
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
  dispatchBackgroundRevalidation({ app: "blog", path: "/" })
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
  const validated = insertTagSchema.parse(values)
  const [created] = await db.insert(tags).values(validated).returning()
  if (created) {
    logTransaction({
      domain: "CONTENT",
      actionType: "TAG_CREATED",
      status: "COMPLETED",
      entityType: "tags",
      entityId: created.id,
    })
    dispatchBackgroundRevalidation({ app: "blog", path: "/" })
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
  dispatchBackgroundRevalidation({ app: "blog", path: "/" })
  revalidatePath("/blog")
}
