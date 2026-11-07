"use server"

import { db, eq, desc, asc, isDbConfigured } from "@workspace/db"
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
import {
  fallbackCmsPosts,
  fallbackCmsCategories,
  fallbackCmsTags,
} from "../fallback-data"

export type CreatePostInput = typeof posts.$inferInsert & {
  categoryIds?: string[]
  tagIds?: string[]
}

export type UpdatePostInput = Partial<typeof posts.$inferInsert> & {
  categoryIds?: string[]
  tagIds?: string[]
}

export async function getPosts() {
  if (!isDbConfigured) {
    return fallbackCmsPosts
  }
  try {
    const rows = await db
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

    return rows.length > 0 ? rows : fallbackCmsPosts
  } catch (error) {
    console.warn(
      "[CMS Blog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsPosts
  }
}

export async function getPostRelationsMap() {
  if (!isDbConfigured) {
    return {
      postCategoriesMap: {
        "post-1": ["cat-1", "cat-2"],
        "post-2": ["cat-3"],
      },
      postTagsMap: {
        "post-1": ["tag-1", "tag-3"],
        "post-2": ["tag-4"],
      },
    }
  }
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
    console.warn(
      "[CMS Blog] Database relation fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return {
      postCategoriesMap: {
        "post-1": ["cat-1", "cat-2"],
        "post-2": ["cat-3"],
      },
      postTagsMap: {
        "post-1": ["tag-1", "tag-3"],
        "post-2": ["tag-4"],
      },
    }
  }
}

export async function getPostById(id: string) {
  if (!isDbConfigured) {
    return fallbackCmsPosts.find((p) => p.id === id) || null
  }
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1)
    return post || fallbackCmsPosts.find((p) => p.id === id) || null
  } catch (error) {
    console.warn(
      "[CMS Blog] Database query fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsPosts.find((p) => p.id === id) || null
  }
}

export async function createPost(input: CreatePostInput) {
  const { categoryIds, tagIds, ...rawPostValues } = input
  const postValues = insertPostSchema.parse(rawPostValues)

  let created = null

  if (isDbConfigured) {
    try {
      created = await db.transaction(async (tx) => {
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
    } catch (err) {
      console.warn(
        "[CMS Blog] Create post warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...postValues,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

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
  revalidatePath("/blog")
  revalidatePath("/")
  return created
}

export async function updatePost(id: string, input: UpdatePostInput) {
  const { categoryIds, tagIds, ...rawPostValues } = input
  const postValues = insertPostSchema.partial().parse(rawPostValues)

  let updated = null

  if (isDbConfigured) {
    try {
      updated = await db.transaction(async (tx) => {
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
    } catch (err) {
      console.warn(
        "[CMS Blog] Update post warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!updated) {
    updated = {
      id,
      ...postValues,
      updatedAt: new Date(),
    }
  }

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
  revalidatePath("/blog")
  revalidatePath("/")
  return updated
}

export async function deletePost(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(posts).where(eq(posts.id, id))
    } catch (err) {
      console.warn(
        "[CMS Blog] Delete post warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
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
  if (!isDbConfigured) {
    return fallbackCmsCategories
  }
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.name))
    return rows.length > 0 ? rows : fallbackCmsCategories
  } catch (error) {
    console.warn(
      "[CMS Blog] Database categories fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsCategories
  }
}

export async function createBlogCategory(
  values: typeof categories.$inferInsert
) {
  const validated = insertCategorySchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(categories).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Blog] Create category warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "CONTENT",
    actionType: "CATEGORY_CREATED",
    status: "COMPLETED",
    entityType: "categories",
    entityId: created.id,
  })
  dispatchBackgroundRevalidation({ app: "blog", path: "/" })
  revalidatePath("/blog")
  return created
}

export async function deleteBlogCategory(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(categories).where(eq(categories.id, id))
    } catch (err) {
      console.warn(
        "[CMS Blog] Delete category warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
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
  if (!isDbConfigured) {
    return fallbackCmsTags
  }
  try {
    const rows = await db.select().from(tags).orderBy(asc(tags.name))
    return rows.length > 0 ? rows : fallbackCmsTags
  } catch (error) {
    console.warn(
      "[CMS Blog] Database tags fallback:",
      error instanceof Error ? error.message : String(error)
    )
    return fallbackCmsTags
  }
}

export async function createBlogTag(values: typeof tags.$inferInsert) {
  const validated = insertTagSchema.parse(values)
  let created = null

  if (isDbConfigured) {
    try {
      const [res] = await db.insert(tags).values(validated).returning()
      created = res
    } catch (err) {
      console.warn(
        "[CMS Blog] Create tag warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }

  if (!created) {
    created = {
      id: crypto.randomUUID(),
      ...validated,
    }
  }

  logTransaction({
    domain: "CONTENT",
    actionType: "TAG_CREATED",
    status: "COMPLETED",
    entityType: "tags",
    entityId: created.id,
  })
  dispatchBackgroundRevalidation({ app: "blog", path: "/" })
  revalidatePath("/blog")
  return created
}

export async function deleteBlogTag(id: string) {
  if (isDbConfigured) {
    try {
      await db.delete(tags).where(eq(tags.id, id))
    } catch (err) {
      console.warn(
        "[CMS Blog] Delete tag warning:",
        err instanceof Error ? err.message : String(err)
      )
    }
  }
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
