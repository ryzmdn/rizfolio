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
  ilike,
  sql,
} from "@workspace/db"

export interface BlogPostItem {
  id: string
  slug: string
  title: string
  excerpt: string
  contentMd: string
  coverImageUrl: string | null
  readingTime: number
  publishedAt: Date | string | null
  createdAt: Date | string
  categories: Array<{ id: string; name: string; slug: string }>
  tags: Array<{ id: string; name: string; slug: string }>
  viewsCount?: number
}

export interface CategoryWithCount {
  id: string
  name: string
  slug: string
  description: string | null
  count: number
}

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
}

export interface PaginatedPostsResult {
  posts: BlogPostItem[]
  total: number
  page: number
  totalPages: number
  limit: number
}

export const fallbackCategories: CategoryWithCount[] = [
  {
    id: "cat-1",
    name: "Architecture",
    slug: "architecture",
    description:
      "System design, distributed services, and monorepo scaling patterns.",
    count: 2,
  },
  {
    id: "cat-2",
    name: "Frontend",
    slug: "frontend",
    description:
      "Modern React 19, Next.js 16, RSC, and Tailwind CSS engineering.",
    count: 2,
  },
  {
    id: "cat-3",
    name: "Performance",
    slug: "performance",
    description: "Core Web Vitals, sub-second query latency, and edge compute.",
    count: 1,
  },
  {
    id: "cat-4",
    name: "Database",
    slug: "database",
    description: "Relational modeling, Drizzle ORM, and Supabase optimization.",
    count: 1,
  },
]

export const fallbackPosts: BlogPostItem[] = [
  {
    id: "post-1",
    slug: "deterministic-monorepos-turborepo-nextjs16",
    title: "Deterministic Full-Stack Monorepos with Turborepo & Next.js 16",
    excerpt:
      "A comprehensive guide to structuring multi-app ecosystems with shared design tokens, isolated data access layers, and sub-second caching pipelines.",
    contentMd: `## Architectural Overview\n\nMonorepo ecosystems allow teams and solo engineers to share core design systems, data schemas, and tooling without code duplication.\n\n\`\`\`typescript\n// packages/db/src/client.ts\nimport { drizzle } from "drizzle-orm/postgres-js"\nimport postgres from "postgres"\n\nconst client = postgres(process.env.DATABASE_URL!)\nexport const db = drizzle(client)\n\`\`\`\n\n### Key Benefits\n- **Unified Type Safety**: End-to-end schemas with Drizzle and Zod.\n- **Zero Duplication**: Shared \`@workspace/ui\` components across 6+ apps.\n- **Atomic Deployments**: Turborepo pipeline caching with remote artifacts.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    readingTime: 6,
    publishedAt: "2026-08-15T08:00:00.000Z",
    createdAt: "2026-08-15T08:00:00.000Z",
    categories: [{ id: "cat-1", name: "Architecture", slug: "architecture" }],
    tags: [
      { id: "tag-1", name: "Next.js", slug: "nextjs" },
      { id: "tag-2", name: "Turborepo", slug: "turborepo" },
    ],
    viewsCount: 342,
  },
  {
    id: "post-2",
    slug: "zero-runtime-design-systems-tailwind-v4",
    title: "Zero-Runtime Component Libraries with Tailwind CSS v4 & OKLCH",
    excerpt:
      "Eliminating CSS bundle overhead with modern CSS variables, fluid responsive typography, and WCAG-compliant color perception algorithms.",
    contentMd: `## The Evolution of Utility-First CSS\n\nTailwind CSS v4 introduces a streamlined engine that operates directly on CSS native features, removing build-step friction.\n\n\`\`\`css\n@theme {\n  --color-primary: oklch(0.205 0 0);\n  --color-accent: oklch(0.97 0 0);\n}\n\`\`\`\n\n### Practical Highlights\n1. Native OKLCH color space for superior dark/light contrast.\n2. Automatic container queries without custom plugin wrappers.\n3. Fluid font sizes using pure CSS clamp primitives.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    readingTime: 4,
    publishedAt: "2026-08-10T10:00:00.000Z",
    createdAt: "2026-08-10T10:00:00.000Z",
    categories: [{ id: "cat-2", name: "Frontend", slug: "frontend" }],
    tags: [
      { id: "tag-3", name: "Tailwind CSS", slug: "tailwind" },
      { id: "tag-4", name: "UI/UX", slug: "ui-ux" },
    ],
    viewsCount: 215,
  },
  {
    id: "post-3",
    slug: "high-throughput-drizzle-orm-supabase-pooling",
    title: "Optimizing PostgreSQL Connection Pooling with Supabase & Drizzle",
    excerpt:
      "Configuring transaction poolers, minimizing serverless cold starts, and building resilient query fallback mechanisms.",
    contentMd: `## Connection Pooling Strategies\n\nWhen scaling Next.js edge and serverless functions, traditional database connection limits can be rapidly exhausted.\n\n\`\`\`typescript\n// Serverless pooled connection config\nconst client = postgres(connectionString, {\n  prepare: false,\n  max: process.env.NODE_ENV === "production" ? 10 : 1,\n})\n\`\`\`\n\n### Core Optimization Pillars\n- **Disable Prepared Statements** in transaction pooler mode (Port 6543).\n- **Use Direct Connection** exclusively for migration execution via Drizzle Kit.\n- **Implement Graceful Fallbacks** for offline development workflows.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
    readingTime: 5,
    publishedAt: "2026-08-05T12:00:00.000Z",
    createdAt: "2026-08-05T12:00:00.000Z",
    categories: [{ id: "cat-4", name: "Database", slug: "database" }],
    tags: [
      { id: "tag-5", name: "PostgreSQL", slug: "postgres" },
      { id: "tag-6", name: "Drizzle", slug: "drizzle" },
    ],
    viewsCount: 189,
  },
]

async function fetchPublishedPosts(
  params: GetPostsParams = {}
): Promise<PaginatedPostsResult> {
  const { categorySlug, tagSlug, query, page = 1, limit = 9 } = params
  const offset = (page - 1) * limit

  try {
    const conditions = [eq(posts.status, "PUBLISHED")]

    if (query && query.trim()) {
      const searchPattern = `%${query.trim()}%`
      conditions.push(
        or(
          ilike(posts.title, searchPattern),
          ilike(posts.excerpt, searchPattern)
        )!
      )
    }

    if (categorySlug && categorySlug !== "all") {
      const catRows = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug))
        .limit(1)

      const targetCatId = catRows[0]?.id
      if (targetCatId) {
        const postIdsWithCategory = db
          .select({ postId: postCategories.postId })
          .from(postCategories)
          .where(eq(postCategories.categoryId, targetCatId))

        conditions.push(sql`${posts.id} IN (${postIdsWithCategory})`)
      }
    }

    if (tagSlug) {
      const tagRows = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, tagSlug))
        .limit(1)

      const targetTagId = tagRows[0]?.id
      if (targetTagId) {
        const postIdsWithTag = db
          .select({ postId: postTags.postId })
          .from(postTags)
          .where(eq(postTags.tagId, targetTagId))

        conditions.push(sql`${posts.id} IN (${postIdsWithTag})`)
      }
    }

    const whereClause = and(...conditions)

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(whereClause)

    const total = countResult[0]?.count || 0
    const totalPages = Math.ceil(total / limit) || 1

    const postRows = await db
      .select()
      .from(posts)
      .where(whereClause)
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
      .limit(limit)
      .offset(offset)

    if (postRows.length === 0 && !query && !categorySlug && !tagSlug) {
      return {
        posts: fallbackPosts,
        total: fallbackPosts.length,
        page: 1,
        totalPages: 1,
        limit,
      }
    }

    const enrichedPosts: BlogPostItem[] = await Promise.all(
      postRows.map(async (p) => {
        const [postCats, postTgs, views] = await Promise.all([
          db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(postCategories)
            .innerJoin(categories, eq(postCategories.categoryId, categories.id))
            .where(eq(postCategories.postId, p.id)),

          db
            .select({
              id: tags.id,
              name: tags.name,
              slug: tags.slug,
            })
            .from(postTags)
            .innerJoin(tags, eq(postTags.tagId, tags.id))
            .where(eq(postTags.postId, p.id)),

          db
            .select({ viewCount: postViews.viewCount })
            .from(postViews)
            .where(eq(postViews.postId, p.id))
            .limit(1),
        ])

        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          contentMd: p.contentMd,
          coverImageUrl: p.coverImageUrl,
          readingTime: p.readingTime,
          publishedAt: p.publishedAt,
          createdAt: p.createdAt,
          categories: postCats,
          tags: postTgs,
          viewsCount: views[0]?.viewCount || 0,
        }
      })
    )

    return {
      posts: enrichedPosts,
      total,
      page,
      totalPages,
      limit,
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch published posts, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )

    let filteredFallback = fallbackPosts
    if (categorySlug && categorySlug !== "all") {
      filteredFallback = filteredFallback.filter((p: BlogPostItem) =>
        p.categories.some((c) => c.slug === categorySlug)
      )
    }
    if (query && query.trim()) {
      const q = query.toLowerCase()
      filteredFallback = filteredFallback.filter(
        (p: BlogPostItem) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      )
    }

    return {
      posts: filteredFallback,
      total: filteredFallback.length,
      page: 1,
      totalPages: 1,
      limit,
    }
  }
}

export async function getPublishedPosts(
  params: GetPostsParams = {}
): Promise<PaginatedPostsResult> {
  const cacheKey = `posts-${params.categorySlug || "all"}-${params.tagSlug || "all"}-${params.query || ""}-${params.page || 1}-${params.limit || 9}`
  return unstable_cache(
    () => fetchPublishedPosts(params),
    ["blog-posts", cacheKey],
    {
      revalidate: 3600,
      tags: ["blog"],
    }
  )()
}

async function fetchPostBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    const postRows = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.status, "PUBLISHED")))
      .limit(1)

    const p = postRows[0]
    if (p) {
      const [postCats, postTgs, views] = await Promise.all([
        db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(postCategories.postId, p.id)),

        db
          .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
          })
          .from(postTags)
          .innerJoin(tags, eq(postTags.tagId, tags.id))
          .where(eq(postTags.postId, p.id)),

        db
          .select({ viewCount: postViews.viewCount })
          .from(postViews)
          .where(eq(postViews.postId, p.id))
          .limit(1),
      ])

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        contentMd: p.contentMd,
        coverImageUrl: p.coverImageUrl,
        readingTime: p.readingTime,
        publishedAt: p.publishedAt,
        createdAt: p.createdAt,
        categories: postCats,
        tags: postTgs,
        viewsCount: views[0]?.viewCount || 0,
      }
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch post by slug from DB, checking fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  const fallback = fallbackPosts.find((p) => p.slug === slug)
  return fallback || null
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPostItem | null> {
  return unstable_cache(() => fetchPostBySlug(slug), ["blog-post", slug], {
    revalidate: 3600,
    tags: ["blog", `blog-${slug}`],
  })()
}

async function fetchCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const catRows = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        count: sql<number>`count(${postCategories.postId})::int`,
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .groupBy(
        categories.id,
        categories.name,
        categories.slug,
        categories.description
      )
      .orderBy(asc(categories.name))

    if (catRows.length > 0) {
      return catRows
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch categories from DB, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return fallbackCategories
}

export const getCategoriesWithCount = unstable_cache(
  fetchCategoriesWithCount,
  ["blog-categories"],
  {
    revalidate: 3600,
    tags: ["blog"],
  }
)

async function fetchTagsWithCount(): Promise<TagWithCount[]> {
  try {
    const tagRows = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        count: sql<number>`count(${postTags.postId})::int`,
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .groupBy(tags.id, tags.name, tags.slug)
      .orderBy(asc(tags.name))

    if (tagRows.length > 0) {
      return tagRows
    }
  } catch (error) {
    console.warn(
      "[Blog Data Layer] Failed to fetch tags from DB, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return [
    { id: "tag-1", name: "Next.js", slug: "nextjs", count: 2 },
    { id: "tag-2", name: "Turborepo", slug: "turborepo", count: 1 },
    { id: "tag-3", name: "Tailwind CSS", slug: "tailwind", count: 1 },
    { id: "tag-4", name: "PostgreSQL", slug: "postgres", count: 1 },
  ]
}

export const getTagsWithCount = unstable_cache(
  fetchTagsWithCount,
  ["blog-tags"],
  {
    revalidate: 3600,
    tags: ["blog"],
  }
)

export async function getFeaturedOrRecentPosts(
  limit: number = 3
): Promise<BlogPostItem[]> {
  const result = await getPublishedPosts({ page: 1, limit })
  return result.posts
}
