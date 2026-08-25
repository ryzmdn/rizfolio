import {
  db,
  categories,
  tags,
  posts,
  postCategories,
  postTags,
  postViews,
} from "@workspace/db"

export async function seedBlog() {
  console.log("Seeding Blog Domain...")

  await db.delete(postViews)
  await db.delete(postCategories)
  await db.delete(postTags)
  await db.delete(posts)
  await db.delete(categories)
  await db.delete(tags)

  const catRows = await db
    .insert(categories)
    .values([
      {
        name: "Architecture",
        slug: "architecture",
        description:
          "System design, monorepos, and distributed software patterns.",
      },
      {
        name: "Frontend",
        slug: "frontend",
        description:
          "Next.js 16, React 19, Tailwind CSS v4, and UI engineering.",
      },
      {
        name: "Backend",
        slug: "backend",
        description:
          "PostgreSQL, Drizzle ORM, Supabase, and high-throughput APIs.",
      },
      {
        name: "Performance",
        slug: "performance",
        description:
          "Core Web Vitals, memory optimization, and bundle minimization.",
      },
    ])
    .returning()

  const tagRows = await db
    .insert(tags)
    .values([
      { name: "Next.js 16", slug: "nextjs-16" },
      { name: "Turborepo", slug: "turborepo" },
      { name: "Tailwind CSS v4", slug: "tailwind-v4" },
      { name: "Drizzle ORM", slug: "drizzle-orm" },
      { name: "TypeScript", slug: "typescript" },
      { name: "PostgreSQL", slug: "postgresql" },
    ])
    .returning()

  const post1 = await db
    .insert(posts)
    .values({
      title: "Building Production Monorepos with Next.js 16 and Turborepo",
      slug: "building-production-monorepos-nextjs-16-turborepo",
      excerpt:
        "A comprehensive deep dive into architecting modular monorepos using Turborepo, Next.js 16, and shared internal TypeScript packages.",
      contentMd: `# Building Production Monorepos with Next.js 16 and Turborepo

Monorepo architectures have evolved from complex enterprise configurations into highly practical workflows for multi-app digital platforms.

## Core Architectural Principles

When building a multi-app platform, maintain clear boundaries:

\`\`\`typescript
// packages/db/src/client.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client)
\`\`\`

### Key Benefits

- **Strict Type Sharing**: Consume database schemas across client and CMS apps.
- **Unified Design Tokens**: Style across multiple domain apps with OKLCH CSS variables.
- **Fast Build Times**: Take advantage of Turborepo remote computation caching.

> "A well-structured monorepo minimizes code duplication while maximizing developer autonomy."
`,
      coverImageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      readingTime: 6,
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-15T08:00:00.000Z"),
    })
    .returning()

  const post2 = await db
    .insert(posts)
    .values({
      title: "Mastering Tailwind CSS v4 & OKLCH Color Spaces",
      slug: "mastering-tailwind-css-v4-oklch-color-spaces",
      excerpt:
        "Explore the new CSS-first configuration engine in Tailwind CSS v4 and how OKLCH enables uniform perceptual brightness across dark/light modes.",
      contentMd: `# Mastering Tailwind CSS v4 & OKLCH Color Spaces

Tailwind CSS v4 introduces a revolutionary CSS-native configuration engine that eliminates \`tailwind.config.js\` in favor of native CSS directives.

## The OKLCH Color Space

OKLCH allows for uniform lightness adjustments across different hues:

\`\`\`css
@theme {
  --color-primary: oklch(0.6 0.25 260);
  --color-background: oklch(0.98 0 0);
}
\`\`\`

### Zero-Runtime Overhead

All design tokens are evaluated at build time, yielding minimal stylesheet payloads and pristine performance scores.
`,
      coverImageUrl:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
      readingTime: 5,
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-10T10:00:00.000Z"),
    })
    .returning()

  const post3 = await db
    .insert(posts)
    .values({
      title: "Type-Safe Relational Data Access with Drizzle ORM and Supabase",
      slug: "type-safe-relational-data-access-drizzle-supabase",
      excerpt:
        "How to leverage Drizzle ORM's relational queries and connection pooling for optimal database throughput and end-to-end type safety.",
      contentMd: `# Type-Safe Relational Data Access with Drizzle ORM and Supabase

Database access should be deterministic, fast, and fully typed without heavy ORM overhead.

## Relational Queries with Drizzle

\`\`\`typescript
const result = await db.query.posts.findMany({
  with: {
    categories: true,
    tags: true,
  },
  where: eq(posts.status, "PUBLISHED"),
})
\`\`\`

### Connection Pooling

Use Supabase transaction pooler on port 6543 for serverless environments to prevent connection exhaustion under burst loads.
`,
      coverImageUrl:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
      readingTime: 7,
      status: "PUBLISHED",
      publishedAt: new Date("2026-08-05T14:30:00.000Z"),
    })
    .returning()

  const p1 = post1[0]
  const p2 = post2[0]
  const p3 = post3[0]

  if (p1 && catRows[0]) {
    await db
      .insert(postCategories)
      .values({ postId: p1.id, categoryId: catRows[0].id })
  }
  if (p2 && catRows[1]) {
    await db
      .insert(postCategories)
      .values({ postId: p2.id, categoryId: catRows[1].id })
  }
  if (p3 && catRows[2]) {
    await db
      .insert(postCategories)
      .values({ postId: p3.id, categoryId: catRows[2].id })
  }

  if (p1 && tagRows[0] && tagRows[1] && tagRows[4]) {
    await db.insert(postTags).values([
      { postId: p1.id, tagId: tagRows[0].id },
      { postId: p1.id, tagId: tagRows[1].id },
      { postId: p1.id, tagId: tagRows[4].id },
    ])
  }
  if (p2 && tagRows[2] && tagRows[4]) {
    await db.insert(postTags).values([
      { postId: p2.id, tagId: tagRows[2].id },
      { postId: p2.id, tagId: tagRows[4].id },
    ])
  }
  if (p3 && tagRows[3] && tagRows[5]) {
    await db.insert(postTags).values([
      { postId: p3.id, tagId: tagRows[3].id },
      { postId: p3.id, tagId: tagRows[5].id },
    ])
  }

  if (p1) await db.insert(postViews).values({ postId: p1.id, viewCount: 142 })
  if (p2) await db.insert(postViews).values({ postId: p2.id, viewCount: 98 })
  if (p3) await db.insert(postViews).values({ postId: p3.id, viewCount: 215 })

  console.log("Blog Domain Seeded Successfully.")
}
