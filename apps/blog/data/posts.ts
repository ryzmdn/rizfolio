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
  featured?: boolean
}

export const fallbackPosts: BlogPostItem[] = [
  {
    id: "post-1",
    slug: "deterministic-monorepos-turborepo-nextjs16",
    title: "Deterministic Full-Stack Monorepos with Turborepo & Next.js 16",
    excerpt:
      "A comprehensive architectural guide to structuring multi-app ecosystems with shared design tokens, isolated data access layers, and sub-second caching pipelines.",
    contentMd: `## Architectural Overview

Monorepo ecosystems allow teams and multidisciplinary builders to share core design systems, data schemas, and tooling without code duplication. However, without strict package boundaries, monorepos can easily degenerate into entangled dependency webs.

\`\`\`typescript
// packages/db/src/client.ts
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: process.env.NODE_ENV === "production" ? 10 : 1,
})

export const db = drizzle(client)
\`\`\`

### Key Architectural Tenets

1. **Strict Package Isolation**: Applications only consume packages via workspace protocol (\`workspace:*\`). Internal cross-app imports are strictly forbidden.
2. **Deterministic Build Caching**: Every task in \`turbo.json\` defines explicit inputs and outputs, allowing Turborepo to replay cached build artifacts locally and in CI.
3. **Unified Type Safety**: Database schemas authored in \`@workspace/db\` propagate compile-time type definitions directly to API endpoints and frontend components.

\`\`\`json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}
\`\`\`

## Managing Shared UI Without Bundler Clutter

By exporting React components directly through standard TypeScript paths and leveraging Tailwind CSS v4 source imports, shared component packages avoid slow intermediary pre-compilation steps.

\`\`\`tsx
// apps/blog/app/layout.tsx
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { AppProvider } from "@workspace/ui/components/app-provider"
\`\`\`

### Summary & Lessons Learned

Investing early in clean monorepo ergonomics pays compounding dividends. A unified repository simplifies refactoring, keeps dependencies synchronized across applications, and enables atomic releases with zero drift.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    readingTime: 6,
    publishedAt: "2026-08-15T08:00:00.000Z",
    createdAt: "2026-08-15T08:00:00.000Z",
    categories: [{ id: "cat-1", name: "Architecture", slug: "architecture" }],
    tags: [
      { id: "tag-1", name: "Next.js", slug: "nextjs" },
      { id: "tag-2", name: "Turborepo", slug: "turborepo" },
      { id: "tag-5", name: "Architecture", slug: "architecture" },
    ],
    viewsCount: 342,
    featured: true,
  },
  {
    id: "post-2",
    slug: "zero-runtime-design-systems-tailwind-v4",
    title: "Zero-Runtime Component Libraries with Tailwind CSS v4 & OKLCH",
    excerpt:
      "Eliminating CSS bundle overhead with modern CSS custom properties, fluid typography scales, and perceptually uniform color contrast algorithms.",
    contentMd: `## The Evolution of Utility-First CSS

Tailwind CSS v4 fundamentally changes how design tokens are defined by moving away from JavaScript configuration files (\`tailwind.config.js\`) to native CSS declarations using the \`@theme\` directive.

\`\`\`css
@theme {
  --color-primary: oklch(0.205 0 0);
  --color-accent: oklch(0.97 0 0);
  --font-sans: var(--font-google-sans), system-ui, sans-serif;
  --font-mono: var(--font-google-sans-code), monospace;
}
\`\`\`

### Why OKLCH Matters for Theme Architecture

Traditional RGB and HSL color models suffer from non-uniform perceived lightness. A yellow hue at 50% HSL lightness appears dramatically brighter than a blue hue at the same 50% lightness value.

- **Perceptual Uniformity**: In OKLCH, lightness (\`L\`) maps directly to human visual perception.
- **Predictable Contrast**: Calculating WCAG contrast ratios across dark and light modes becomes deterministic and mathematically consistent.

\`\`\`css
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.12 0 0);
  --border: oklch(0.90 0 0);
}

.dark {
  --background: oklch(0.10 0 0);
  --foreground: oklch(0.98 0 0);
  --border: oklch(0.22 0 0);
}
\`\`\`

## Headless Primitives + Polymorphic Tokens

By pairing unstyled Radix UI primitives with Tailwind CSS v4 utility classes via \`class-variance-authority\` (CVA), we produce accessible interactive components with zero styling lock-in and zero runtime JavaScript styling overhead.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    readingTime: 4,
    publishedAt: "2026-08-10T10:00:00.000Z",
    createdAt: "2026-08-10T10:00:00.000Z",
    categories: [{ id: "cat-2", name: "Frontend", slug: "frontend" }],
    tags: [
      { id: "tag-3", name: "Tailwind CSS", slug: "tailwind" },
      { id: "tag-4", name: "UI/UX", slug: "ui-ux" },
      { id: "tag-6", name: "Design Systems", slug: "design-systems" },
    ],
    viewsCount: 215,
    featured: false,
  },
  {
    id: "post-3",
    slug: "high-throughput-drizzle-orm-supabase-pooling",
    title: "Optimizing PostgreSQL Connection Pooling with Supabase & Drizzle",
    excerpt:
      "Configuring transaction poolers, minimizing serverless cold starts, and building resilient query fallback mechanisms for high-concurrency systems.",
    contentMd: `## Serverless Connection Constraints

When executing Next.js Edge and Serverless functions, every request can potentially spawn a new isolated runtime instance. Without connection pooling, hundreds of concurrent visitors can rapidly saturate PostgreSQL backend limits.

\`\`\`typescript
// Serverless pooled connection config
const client = postgres(connectionString, {
  prepare: false, // Required for PgBouncer / Supabase transaction pooling
  max: process.env.NODE_ENV === "production" ? 10 : 1,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client)
\`\`\`

### Architectural Principles

1. **Transaction Pooling on Port 6543**: Never use session mode on serverless workers. Ensure prepared statements are disabled because connection pooling switches sessions between queries.
2. **Graceful Fallbacks**: Wrap critical read queries in graceful error boundaries so that temporary database network hiccups fall back to static cached data.
3. **Dedicated Direct Connections for Migrations**: Drizzle Kit migrations require full session capabilities and must always target port 5432.

\`\`\`typescript
export async function getPublishedPostsSafe() {
  try {
    return await db.select().from(posts).where(eq(posts.isPublished, true))
  } catch (error) {
    console.warn("[Data Layer] Falling back to static cache:", error)
    return fallbackPosts
  }
}
\`\`\`

### Conclusion

Resilient data access is not just about writing fast queries; it is about designing deterministic failover behaviors that ensure your site remains available even during database maintenance windows.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
    readingTime: 5,
    publishedAt: "2026-08-05T12:00:00.000Z",
    createdAt: "2026-08-05T12:00:00.000Z",
    categories: [{ id: "cat-4", name: "Database", slug: "database" }],
    tags: [
      { id: "tag-7", name: "PostgreSQL", slug: "postgresql" },
      { id: "tag-8", name: "Drizzle ORM", slug: "drizzle" },
    ],
    viewsCount: 189,
    featured: false,
  },
  {
    id: "post-4",
    slug: "sub-second-web-performance-core-web-vitals",
    title: "Engineering Sub-Second Web Performance & Flawless Core Web Vitals",
    excerpt:
      "A systematic breakdown of Cumulative Layout Shift elimination, server-side font metric overrides, and aggressive bundle budgeting.",
    contentMd: `## Performance is an Architectural Discipline

Sub-second page loads cannot be achieved by superficial optimizations. They require deliberate constraints enforced at the foundational architecture level.

### Eliminating Cumulative Layout Shift (CLS)

Layout shifts primarily stem from three culprits:
- Unsized web images and dynamic embeds.
- Web fonts loading and replacing fallback system fonts with mismatched optical dimensions.
- Client-rendered layout banners injected after initial paint.

\`\`\`css
@font-face {
  font-family: "Google Sans";
  src: url("/fonts/google-sans.woff2") format("woff2");
  font-display: swap;
  size-adjust: 100.5%;
  ascent-override: 95%;
  descent-override: 25%;
  line-gap-override: 0%;
}
\`\`\`

### Server Components vs. Client Hydration

By adopting React 19 Server Components as the default, we eliminate JavaScript bundle overhead for static and read-heavy views. The client only downloads the JavaScript required for interactive elements like search inputs and theme toggles.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    readingTime: 7,
    publishedAt: "2026-07-28T09:30:00.000Z",
    createdAt: "2026-07-28T09:30:00.000Z",
    categories: [{ id: "cat-3", name: "Performance", slug: "performance" }],
    tags: [
      { id: "tag-9", name: "Web Vitals", slug: "web-vitals" },
      { id: "tag-1", name: "Next.js", slug: "nextjs" },
    ],
    viewsCount: 420,
    featured: false,
  },
  {
    id: "post-5",
    slug: "declarative-ci-cd-pipelines-docker-github-actions",
    title: "Zero-Touch CI/CD: Multi-Stage Docker Builds & Remote Telemetry",
    excerpt:
      "Building immutable deployment containers, automated test gates, and distributed observability pipelines for mission-critical web applications.",
    contentMd: `## Declarative Delivery Pipelines

Modern software engineering demands that deployments are automated, reproducible, and verifiable. Manual SSH deployment scripts introduce human error and opaque environment configuration drift.

\`\`\`dockerfile
# Multi-stage Dockerfile for Next.js Monorepo
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter blog build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/blog/.next/standalone ./
COPY --from=builder /app/apps/blog/.next/static ./apps/blog/.next/static
EXPOSE 3001
CMD ["node", "apps/blog/server.js"]
\`\`\`

### Automated Verification Gates

Before any container image is published to the registry, GitHub Actions workflows execute strict typechecking, lint verification, and security vulnerability scans. If any check fails, the pipeline halts immediately, preventing broken code from reaching staging or production.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?q=80&w=1200&auto=format&fit=crop",
    readingTime: 5,
    publishedAt: "2026-07-15T14:00:00.000Z",
    createdAt: "2026-07-15T14:00:00.000Z",
    categories: [{ id: "cat-5", name: "DevOps & Cloud", slug: "devops-cloud" }],
    tags: [
      { id: "tag-10", name: "Docker", slug: "docker" },
      { id: "tag-11", name: "CI/CD", slug: "cicd" },
    ],
    viewsCount: 165,
    featured: false,
  },
  {
    id: "post-6",
    slug: "streaming-state-machines-real-time-ai-interfaces",
    title: "Designing Streaming State Machines for Real-Time AI User Interfaces",
    excerpt:
      "Managing asynchronous latency, progressive rendering, and resilient reconnection protocols in generative AI web workflows.",
    contentMd: `## Handling Asynchronous Latency with Grace

Integrating Large Language Models and generative GPU synthesis tasks into web interfaces introduces unique UX challenges. Unlike traditional REST APIs with sub-200ms roundtrips, generative pipelines can take several seconds to compute.

\`\`\`typescript
type StreamingState =
  | { status: "idle" }
  | { status: "connecting" }
  | { status: "streaming"; chunk: string; progress: number }
  | { status: "complete"; result: string }
  | { status: "error"; message: string }
\`\`\`

### Server-Sent Events over WebSockets

For unidirectional data generation (such as streaming text or queue status updates), Server-Sent Events (SSE) offer significant advantages over WebSockets:
- Built-in HTTP/2 multiplexing support.
- Native browser reconnection handling via \`EventSource\`.
- Seamless compatibility with edge serverless functions without stateful server socket pooling.

### Reassuring Interaction Design

Never leave users staring at an uninformative spinner. Displaying granular pipeline phases ("Synthesizing vector embeddings", "Sampling diffusion steps") reassures users and dramatically reduces perceived waiting time.`,
    coverImageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    readingTime: 6,
    publishedAt: "2026-07-02T11:00:00.000Z",
    createdAt: "2026-07-02T11:00:00.000Z",
    categories: [{ id: "cat-6", name: "Applied AI", slug: "applied-ai" }],
    tags: [
      { id: "tag-12", name: "AI", slug: "ai" },
      { id: "tag-13", name: "Streaming", slug: "streaming" },
      { id: "tag-1", name: "Next.js", slug: "nextjs" },
    ],
    viewsCount: 298,
    featured: false,
  },
]
