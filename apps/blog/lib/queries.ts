import { unstable_cache } from "next/cache"
import {
  db,
  posts,
  categories,
  tags,
  postCategories,
  postTags,
  postViews,
  eq,
  desc,
  asc,
  and,
  or,
  ne,
  ilike,
  sql,
} from "@workspace/db"
import {
  fallbackCategories,
  fallbackPosts,
  type CategoryItem as CategoryWithCount,
  type BlogPostItem,
} from "@/data"

export type { BlogPostItem, CategoryWithCount }

export interface TagWithCount {
  id: string
  name: string
  slug: string
  count: number
}

export interface GetPostsParams {
  categorySlug?: string
  tagSlug?: string
  query?: string
  page?: number
  limit?: number
  sort?: "latest" | "popular"
}

export interface PaginatedPostsResult {
  posts: BlogPostItem[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export { fallbackCategories, fallbackPosts }

async function fetchPublishedPosts({
  categorySlug,
  tagSlug,
  query,
  page = 1,
  limit = 9,
  sort = "latest",
}: GetPostsParams = {}): Promise<PaginatedPostsResult> {
  const offset = (page - 1) * limit

  try {
    const conditions = [eq(posts.status, "PUBLISHED")]

    if (categorySlug && categorySlug !== "all") {
      conditions.push(
        sql`${posts.id} IN (
          SELECT ${postCategories.postId} FROM ${postCategories}
          INNER JOIN ${categories} ON ${postCategories.categoryId} = ${categories.id}
          WHERE LOWER(${categories.slug}) = LOWER(${categorySlug})
        )`
      )
    }

    if (tagSlug) {
      conditions.push(
        sql`${posts.id} IN (
          SELECT ${postTags.postId} FROM ${postTags}
          INNER JOIN ${tags} ON ${postTags.tagId} = ${tags.id}
          WHERE LOWER(${tags.slug}) = LOWER(${tagSlug})
        )`
      )
    }

    if (query && query.trim()) {
      const q = `%${query.trim()}%`
      conditions.push(
        or(
          ilike(posts.title, q),
          ilike(posts.excerpt, q),
          ilike(posts.contentMd, q)
        )!
      )
    }

    const baseQuery = db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        coverImageUrl: posts.coverImageUrl,
        readingTime: posts.readingTime,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        viewsCount: sql<number>`coalesce(${postViews.viewCount}, 0)`.as(
          "viewsCount"
        ),
      })
      .from(posts)
      .leftJoin(postViews, eq(posts.id, postViews.postId))
      .where(and(...conditions))

    const orderByClause =
      sort === "popular"
        ? [
            desc(sql`coalesce(${postViews.viewCount}, 0)`),
            desc(posts.publishedAt),
          ]
        : [desc(posts.publishedAt), desc(posts.createdAt)]

    const [rows, countRows] = await Promise.all([
      baseQuery
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(and(...conditions)),
    ])

    const totalCount = countRows[0]?.count || 0

    if (rows.length > 0) {
      const postIds = rows.map((r) => r.id)

      const [catRows, tagRows] = await Promise.all([
        db
          .select({
            postId: postCategories.postId,
            category: {
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            },
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(sql`${postCategories.postId} IN ${postIds}`),

        db
          .select({
            postId: postTags.postId,
            tag: {
              id: tags.id,
              name: tags.name,
              slug: tags.slug,
            },
          })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(sql`${postTags.postId} IN ${postIds}`),
      ])

      const catsByPost = new Map<
        string,
        Array<{ id: string; name: string; slug: string }>
      >()
      for (const row of catRows) {
        if (!catsByPost.has(row.postId)) catsByPost.set(row.postId, [])
        catsByPost.get(row.postId)!.push(row.category)
      }

      const tagsByPost = new Map<
        string,
        Array<{ id: string; name: string; slug: string }>
      >()
      for (const row of tagRows) {
        if (!tagsByPost.has(row.postId)) tagsByPost.set(row.postId, [])
        tagsByPost.get(row.postId)!.push(row.tag)
      }

      const populatedPosts: BlogPostItem[] = rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        contentMd: "",
        coverImageUrl: r.coverImageUrl,
        readingTime: r.readingTime || 5,
        publishedAt: r.publishedAt,
        createdAt: r.createdAt,
        categories: catsByPost.get(r.id) || [],
        tags: tagsByPost.get(r.id) || [],
        viewsCount: Number(r.viewsCount || 0),
      }))

      return {
        posts: populatedPosts,
        total: totalCount,
        page,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        limit,
      }
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch published posts, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  let filtered = [...fallbackPosts]

  if (categorySlug && categorySlug !== "all") {
    filtered = filtered.filter((p) =>
      p.categories.some(
        (c) => c.slug.toLowerCase() === categorySlug.toLowerCase()
      )
    )
  }

  if (tagSlug) {
    filtered = filtered.filter((p) =>
      p.tags.some((t) => t.slug.toLowerCase() === tagSlug.toLowerCase())
    )
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.contentMd.toLowerCase().includes(q)
    )
  }

  if (sort === "popular") {
    filtered.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
  } else {
    filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
      return dateB - dateA
    })
  }

  const total = filtered.length
  const paginated = filtered.slice(offset, offset + limit)

  return {
    posts: paginated,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    limit,
  }
}

export async function getPublishedPosts(
  params: GetPostsParams = {}
): Promise<PaginatedPostsResult> {
  const cacheKey = `posts-${params.categorySlug || "all"}-${params.tagSlug || "all"}-${params.query || ""}-${params.sort || "latest"}-${params.page || 1}-${params.limit || 9}`
  return unstable_cache(
    () => fetchPublishedPosts(params),
    ["blog-published-posts", cacheKey],
    {
      revalidate: 3600,
      tags: ["blog"],
    }
  )()
}

async function fetchPostBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    const rows = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        contentMd: posts.contentMd,
        coverImageUrl: posts.coverImageUrl,
        readingTime: posts.readingTime,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        viewsCount: sql<number>`coalesce(${postViews.viewCount}, 0)`.as(
          "viewsCount"
        ),
      })
      .from(posts)
      .leftJoin(postViews, eq(posts.id, postViews.postId))
      .where(and(eq(posts.slug, slug), eq(posts.status, "PUBLISHED")))
      .limit(1)

    const post = rows[0]
    if (post) {
      const [catRows, tagRows] = await Promise.all([
        db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, post.id)),

        db
          .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
          })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, post.id)),
      ])

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        contentMd: post.contentMd,
        coverImageUrl: post.coverImageUrl,
        readingTime:
          post.readingTime || Math.ceil((post.contentMd?.length || 500) / 900),
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        categories: catRows,
        tags: tagRows,
        viewsCount: Number(post.viewsCount || 0),
      }
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch post by slug, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return fallbackPosts.find((p) => p.slug === slug) || null
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPostItem | null> {
  return unstable_cache(() => fetchPostBySlug(slug), ["blog-post", slug], {
    revalidate: 3600,
    tags: ["blog", `post-${slug}`],
  })()
}

async function fetchAllPostSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.status, "PUBLISHED"))

    if (rows.length > 0) {
      return rows.map((r) => r.slug)
    }
  } catch {
    // Graceful fallback
  }

  return fallbackPosts.map((p) => p.slug)
}

export const getAllPostSlugs = unstable_cache(
  fetchAllPostSlugs,
  ["blog-all-post-slugs"],
  {
    revalidate: 3600,
    tags: ["blog"],
  }
)

async function fetchAdjacentPosts(currentSlug: string): Promise<{
  prev: BlogPostItem | null
  next: BlogPostItem | null
}> {
  try {
    const currentPost = await db
      .select({ publishedAt: posts.publishedAt, createdAt: posts.createdAt })
      .from(posts)
      .where(and(eq(posts.slug, currentSlug), eq(posts.status, "PUBLISHED")))
      .limit(1)

    if (currentPost[0]) {
      const pubDate = currentPost[0].publishedAt || currentPost[0].createdAt

      const [prevRows, nextRows] = await Promise.all([
        db
          .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            excerpt: posts.excerpt,
            coverImageUrl: posts.coverImageUrl,
            publishedAt: posts.publishedAt,
            createdAt: posts.createdAt,
          })
          .from(posts)
          .where(
            and(
              eq(posts.status, "PUBLISHED"),
              pubDate ? sql`${posts.publishedAt} < ${pubDate}` : sql`1=1`,
              ne(posts.slug, currentSlug)
            )
          )
          .orderBy(desc(posts.publishedAt))
          .limit(1),

        db
          .select({
            id: posts.id,
            slug: posts.slug,
            title: posts.title,
            excerpt: posts.excerpt,
            coverImageUrl: posts.coverImageUrl,
            publishedAt: posts.publishedAt,
            createdAt: posts.createdAt,
          })
          .from(posts)
          .where(
            and(
              eq(posts.status, "PUBLISHED"),
              pubDate ? sql`${posts.publishedAt} > ${pubDate}` : sql`1=1`,
              ne(posts.slug, currentSlug)
            )
          )
          .orderBy(asc(posts.publishedAt))
          .limit(1),
      ])

      const prev = prevRows[0]
        ? ({
            id: prevRows[0].id,
            slug: prevRows[0].slug,
            title: prevRows[0].title,
            excerpt: prevRows[0].excerpt || "",
            contentMd: "",
            coverImageUrl: prevRows[0].coverImageUrl || null,
            readingTime: 3,
            publishedAt: prevRows[0].publishedAt,
            createdAt: prevRows[0].createdAt,
            categories: [],
            tags: [],
            viewsCount: 0,
          } as BlogPostItem)
        : null

      const next = nextRows[0]
        ? ({
            id: nextRows[0].id,
            slug: nextRows[0].slug,
            title: nextRows[0].title,
            excerpt: nextRows[0].excerpt || "",
            contentMd: "",
            coverImageUrl: nextRows[0].coverImageUrl || null,
            readingTime: 3,
            publishedAt: nextRows[0].publishedAt,
            createdAt: nextRows[0].createdAt,
            categories: [],
            tags: [],
            viewsCount: 0,
          } as BlogPostItem)
        : null

      return { prev, next }
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch adjacent posts from DB:",
      error
    )
  }

  const index = fallbackPosts.findIndex((p) => p.slug === currentSlug)
  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? (fallbackPosts[index - 1] ?? null) : null,
    next:
      index < fallbackPosts.length - 1
        ? (fallbackPosts[index + 1] ?? null)
        : null,
  }
}

export async function getAdjacentPosts(currentSlug: string): Promise<{
  prev: BlogPostItem | null
  next: BlogPostItem | null
}> {
  return unstable_cache(
    () => fetchAdjacentPosts(currentSlug),
    ["blog-adjacent-posts", currentSlug],
    {
      revalidate: 3600,
      tags: ["blog", `post-${currentSlug}`],
    }
  )()
}

export async function getFeaturedPost(): Promise<BlogPostItem | null> {
  const { posts: allPosts } = await getPublishedPosts({ limit: 10 })
  return allPosts.find((p) => p.featured) || allPosts[0] || null
}

export async function getFeaturedOrRecentPosts(
  limit = 3
): Promise<BlogPostItem[]> {
  const { posts } = await getPublishedPosts({ limit })
  return posts
}

async function fetchCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const rows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        count: sql<number>`count(${postCategories.postId})`.as("count"),
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .leftJoin(posts, eq(postCategories.postId, posts.id))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description
      )
      .orderBy(desc(sql`count(${postCategories.postId})`))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        count: Number(r.count || 0),
      }))
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch categories count, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return fallbackCategories
}

export const getCategoriesWithCount = unstable_cache(
  fetchCategoriesWithCount,
  ["blog-categories-count"],
  {
    revalidate: 3600,
    tags: ["blog"],
  }
)

async function fetchTagsWithCount(): Promise<TagWithCount[]> {
  try {
    const rows = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        count: sql<number>`count(${postTags.postId})`.as("count"),
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .groupBy(tags.id, tags.name, tags.slug)
      .orderBy(desc(sql`count(${postTags.postId})`))

    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        count: Number(r.count || 0),
      }))
    }
  } catch {
    // Graceful fallback
  }

  const tagMap = new Map<
    string,
    { id: string; name: string; slug: string; count: number }
  >()
  for (const post of fallbackPosts) {
    for (const t of post.tags) {
      const existing = tagMap.get(t.slug)
      if (existing) {
        existing.count += 1
      } else {
        tagMap.set(t.slug, { ...t, count: 1 })
      }
    }
  }

  return Array.from(tagMap.values())
}

export const getTagsWithCount = unstable_cache(
  fetchTagsWithCount,
  ["blog-tags-count"],
  {
    revalidate: 3600,
    tags: ["blog"],
  }
)
