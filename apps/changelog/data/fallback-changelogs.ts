export type ChangelogCategory = "FEATURE" | "IMPROVEMENT" | "FIX" | "BREAKING"

export interface ChangelogItemData {
  id: string
  category: ChangelogCategory | string
  description: string
  displayOrder: number
  scope?: string
}

export interface ReleaseMetric {
  label: string
  value: string
}

export interface ChangelogReleaseData {
  id: string
  version: string
  slug: string
  title: string
  releaseDate: string
  summary: string | null
  commitSha: string
  scope: string[]
  metrics?: ReleaseMetric[]
  isPublished: boolean
  createdAt: string
  items: ChangelogItemData[]
}

export interface RoadmapItemData {
  id: string
  title: string
  description: string
  stage: "SHIPPED" | "IN_PROGRESS" | "PLANNED"
  quarter: string
  priority: "HIGH" | "MEDIUM" | "PLANNED"
  scope: string[]
  relatedVersion?: string
}

export const fallbackChangelogs: ChangelogReleaseData[] = [
  {
    id: "cl-1",
    version: "v1.3.0",
    slug: "v1-3-0",
    title: "E-Commerce Store & Digital Fulfillment Engine",
    releaseDate: "September 2026",
    summary:
      "Comprehensive digital commerce platform featuring shopping cart slide-over, dual license tiers, automated download tokens, and structured SEO.",
    commitSha: "7f3e91a",
    scope: ["apps/shop", "packages/db", "packages/ui"],
    metrics: [
      { label: "Fulfillment Latency", value: "<120ms" },
      { label: "Lighthouse Performance", value: "100/100" },
      { label: "Checkout Steps", value: "2 Clicks" },
    ],
    isPublished: true,
    createdAt: "2026-09-15T00:00:00.000Z",
    items: [
      {
        id: "item-1-1",
        category: "FEATURE",
        description:
          "Engineered persistent Shopping Cart drawer with dual-tier licensing selector and real-time coupon calculation.",
        displayOrder: 1,
        scope: "apps/shop",
      },
      {
        id: "item-1-2",
        category: "FEATURE",
        description:
          "Constructed secure digital fulfillment engine with time-limited signed download tokens and license key generator.",
        displayOrder: 2,
        scope: "apps/shop",
      },
      {
        id: "item-1-3",
        category: "IMPROVEMENT",
        description:
          "Rebuilt storefront catalog with 300ms debounced search, sorting dropdown, and active filter summary chips.",
        displayOrder: 3,
        scope: "apps/shop",
      },
      {
        id: "item-1-4",
        category: "FIX",
        description:
          "Eliminated hydration mismatches in theme persistence during client-side route transitions.",
        displayOrder: 4,
        scope: "packages/ui",
      },
    ],
  },
  {
    id: "cl-2",
    version: "v1.2.0",
    slug: "v1-2-0",
    title: "Personal CMS & GitHub-Style Code Explorer",
    releaseDate: "August 2026",
    summary:
      "Major ecosystem upgrade introducing full dynamic CMS management, Shiki-powered open-source code explorer, and unified database layers.",
    commitSha: "5b2c80d",
    scope: ["apps/docs", "apps/cms", "packages/db"],
    metrics: [
      { label: "Syntax Highlighting", value: "Zero Runtime JS" },
      { label: "Static Pages Generated", value: "29 Pages" },
      { label: "Search Index Latency", value: "<15ms" },
    ],
    isPublished: true,
    createdAt: "2026-08-20T00:00:00.000Z",
    items: [
      {
        id: "item-2-1",
        category: "FEATURE",
        description:
          "Launched apps/docs with Shiki server-side code highlighting, folder navigation, and technical documentation explorer.",
        displayOrder: 1,
        scope: "apps/docs",
      },
      {
        id: "item-2-2",
        category: "FEATURE",
        description:
          "Launched apps/cms dashboard for owner-only dynamic content management across all 6 applications.",
        displayOrder: 2,
        scope: "apps/cms",
      },
      {
        id: "item-2-3",
        category: "IMPROVEMENT",
        description:
          "Integrated Drizzle ORM and Supabase transaction pooler with full type-safe relational schemas.",
        displayOrder: 3,
        scope: "packages/db",
      },
      {
        id: "item-2-4",
        category: "FIX",
        description:
          "Resolved pnpm workspace symlink hoisting conflicts and standardized port allocations across all dev servers.",
        displayOrder: 4,
        scope: "monorepo",
      },
    ],
  },
  {
    id: "cl-3",
    version: "v1.1.0",
    slug: "v1-1-0",
    title: "Tailwind CSS v4 Migration & OKLCH Theme Parity",
    releaseDate: "July 2026",
    summary:
      "Modernized design system token pipeline with zero runtime CSS overhead and seamless dark/light theme switching.",
    commitSha: "3c1a74e",
    scope: ["packages/ui", "apps/portfolio", "apps/blog"],
    metrics: [
      { label: "CSS Bundle Delta", value: "-38%" },
      { label: "Color Gamut", value: "100% OKLCH" },
      { label: "Theme Shift Jitter", value: "0ms" },
    ],
    isPublished: true,
    createdAt: "2026-07-25T00:00:00.000Z",
    items: [
      {
        id: "item-3-1",
        category: "IMPROVEMENT",
        description:
          "Migrated entire @workspace/ui component library to Tailwind CSS v4 and native CSS variables.",
        displayOrder: 1,
        scope: "packages/ui",
      },
      {
        id: "item-3-2",
        category: "FEATURE",
        description:
          "Added Base UI dialogs, dropdowns, and progressive blur animations across portfolio and store.",
        displayOrder: 2,
        scope: "packages/ui",
      },
      {
        id: "item-3-3",
        category: "FIX",
        description:
          "Eliminated hydration mismatch on initial theme rendering via next-themes AppProvider wrapper.",
        displayOrder: 3,
        scope: "packages/ui",
      },
      {
        id: "item-3-4",
        category: "IMPROVEMENT",
        description:
          "Standardized typography scale with tabular figures and optical sizing for monospace code fonts.",
        displayOrder: 4,
        scope: "packages/ui",
      },
    ],
  },
  {
    id: "cl-4",
    version: "v1.0.0",
    slug: "v1-0-0",
    title: "Initial Monorepo Architecture Setup",
    releaseDate: "June 2026",
    summary:
      "Foundational release establishing Turborepo, Next.js 16, React 19, and shared TypeScript configurations.",
    commitSha: "1f8e62c",
    scope: ["apps/portfolio", "apps/blog", "packages/ui", "packages/db"],
    metrics: [
      { label: "Turborepo Cache Hit", value: "94.2%" },
      { label: "Strict TypeScript", value: "100%" },
      { label: "Apps Orchestrated", value: "6 Projects" },
    ],
    isPublished: true,
    createdAt: "2026-06-15T00:00:00.000Z",
    items: [
      {
        id: "item-4-1",
        category: "FEATURE",
        description:
          "Configured Turborepo pipeline with remote caching, strict linting, and typecheck tasks.",
        displayOrder: 1,
        scope: "monorepo",
      },
      {
        id: "item-4-2",
        category: "FEATURE",
        description:
          "Scaffolded portfolio, blog, and shop public applications with shared layout primitives.",
        displayOrder: 2,
        scope: "monorepo",
      },
      {
        id: "item-4-3",
        category: "IMPROVEMENT",
        description:
          "Set up shared ESLint flat config and strict tsconfig references.",
        displayOrder: 3,
        scope: "monorepo",
      },
      {
        id: "item-4-4",
        category: "FEATURE",
        description:
          "Implemented global dark/light theme engine using next-themes.",
        displayOrder: 4,
        scope: "packages/ui",
      },
    ],
  },
  {
    id: "cl-5",
    version: "v0.9.0",
    slug: "v0-9-0",
    title: "Design Tokens & Foundational Architecture",
    releaseDate: "May 2026",
    summary:
      "Alpha architectural prototype defining design tokens, core layouts, and database relational models.",
    commitSha: "0d4b51a",
    scope: ["packages/ui", "packages/db"],
    metrics: [
      { label: "Initial Prototype", value: "Alpha v0.9" },
      { label: "Component Tokens", value: "48 Primitives" },
    ],
    isPublished: true,
    createdAt: "2026-05-10T00:00:00.000Z",
    items: [
      {
        id: "item-5-1",
        category: "FEATURE",
        description:
          "Created shared UI container, badge, button, and typography primitives.",
        displayOrder: 1,
        scope: "packages/ui",
      },
      {
        id: "item-5-2",
        category: "FEATURE",
        description:
          "Designed initial schema prototypes for portfolio case studies and blog articles.",
        displayOrder: 2,
        scope: "packages/db",
      },
      {
        id: "item-5-3",
        category: "IMPROVEMENT",
        description:
          "Benchmarked Next.js 16 App Router against cold start serverless environments.",
        displayOrder: 3,
        scope: "monorepo",
      },
    ],
  },
]

export const roadmapItems: RoadmapItemData[] = [
  {
    id: "rm-1",
    title: "Digital Store & License Key Generation",
    description:
      "Comprehensive digital commerce checkout, dual license tiers, automated download tokens, and structured SEO.",
    stage: "SHIPPED",
    quarter: "Q3 2026",
    priority: "HIGH",
    scope: ["apps/shop", "packages/db", "packages/ui"],
    relatedVersion: "v1.3.0",
  },
  {
    id: "rm-2",
    title: "Bi-directional CMS Sync & Real-time Webhooks",
    description:
      "Automated ISR cache revalidation triggers whenever content updates occur in apps/cms.",
    stage: "SHIPPED",
    quarter: "Q3 2026",
    priority: "HIGH",
    scope: ["apps/cms", "apps/blog", "apps/docs"],
    relatedVersion: "v1.2.0",
  },
  {
    id: "rm-3",
    title: "Tailwind CSS v4 & OKLCH Theme Parity",
    description:
      "Modernized design system token pipeline utilizing CSS native variables and OKLCH color space with dark mode parity.",
    stage: "SHIPPED",
    quarter: "Q2 2026",
    priority: "HIGH",
    scope: ["packages/ui"],
    relatedVersion: "v1.1.0",
  },
  {
    id: "rm-4",
    title: "Initial Monorepo Architecture & Turborepo Pipelines",
    description:
      "Turborepo workspaces orchestration, shared UI design system, isolated database layer with Drizzle ORM, and CI/CD pipelines.",
    stage: "SHIPPED",
    quarter: "Q1 2026",
    priority: "HIGH",
    scope: ["monorepo"],
    relatedVersion: "v1.0.0",
  },
  {
    id: "rm-5",
    title: "Unified Command Search & Cross-App Nav",
    description:
      "Cross-application command palette search querying repositories, blog articles, product releases, and documentation.",
    stage: "IN_PROGRESS",
    quarter: "Q4 2026",
    priority: "HIGH",
    scope: ["apps/portfolio", "apps/blog", "apps/docs", "apps/changelog"],
  },
  {
    id: "rm-6",
    title: "Interactive Architecture Sandbox",
    description:
      "Live in-browser WebAssembly runner to test algorithms and distributed system nodes without server execution overhead.",
    stage: "IN_PROGRESS",
    quarter: "Q4 2026",
    priority: "MEDIUM",
    scope: ["apps/docs"],
  },
  {
    id: "rm-7",
    title: "Automated Visual Regression Testing",
    description:
      "Continuous integration visual regression test suite using Playwright across light and dark theme viewports.",
    stage: "IN_PROGRESS",
    quarter: "Q4 2026",
    priority: "HIGH",
    scope: ["packages/ui", "apps/portfolio"],
  },
  {
    id: "rm-8",
    title: "Native Mobile Companion App",
    description:
      "React Native and Expo companion application for personal analytics, notifications, and dev logs on iOS and Android.",
    stage: "PLANNED",
    quarter: "Q1 2027",
    priority: "PLANNED",
    scope: ["apps/mobile"],
  },
  {
    id: "rm-9",
    title: "Edge API Caching & Multi-Region DB Read Replicas",
    description:
      "Global edge routing with distributed edge worker caching database queries within 20ms response time worldwide.",
    stage: "PLANNED",
    quarter: "Q2 2027",
    priority: "MEDIUM",
    scope: ["packages/db", "apps/portfolio"],
  },
  {
    id: "rm-10",
    title: "Self-Hosted Telemetry & Performance Dashboard",
    description:
      "Real-time Core Web Vitals tracking, API latency monitoring, and automated performance degradation alerts.",
    stage: "PLANNED",
    quarter: "Q2 2027",
    priority: "PLANNED",
    scope: ["apps/analytics", "packages/db"],
  },
]

