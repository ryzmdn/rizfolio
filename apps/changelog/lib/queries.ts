import { db, changelogs, changelogItems, eq, desc, asc } from "@workspace/db"

export type ChangelogCategory = "FEATURE" | "IMPROVEMENT" | "FIX" | "BREAKING"

export interface ChangelogItemData {
  id: string
  category: ChangelogCategory | string
  description: string
  displayOrder: number
}

export interface ChangelogReleaseData {
  id: string
  version: string
  title: string
  releaseDate: string
  summary: string | null
  isPublished: boolean
  createdAt: Date | string
  items: ChangelogItemData[]
}

export const fallbackChangelogs: ChangelogReleaseData[] = [
  {
    id: "cl-1",
    version: "v1.2.0",
    title: "Personal CMS & GitHub-Style Archive Explorer",
    releaseDate: "August 2026",
    summary:
      "Major ecosystem upgrade introducing full dynamic CMS management, Shiki-powered open-source code explorer, and unified database layers.",
    isPublished: true,
    createdAt: "2026-08-20T00:00:00.000Z",
    items: [
      {
        id: "item-1-1",
        category: "FEATURE",
        description:
          "Launched apps/archive with Shiki server-side code highlighting, folder navigation, and direct ZIP archive downloads.",
        displayOrder: 1,
      },
      {
        id: "item-1-2",
        category: "FEATURE",
        description:
          "Launched apps/cms dashboard for owner-only dynamic content management across all 6 applications.",
        displayOrder: 2,
      },
      {
        id: "item-1-3",
        category: "IMPROVEMENT",
        description:
          "Integrated Drizzle ORM and Supabase transaction pooler (@workspace/db) with full type-safe relational schemas.",
        displayOrder: 3,
      },
      {
        id: "item-1-4",
        category: "FIX",
        description:
          "Resolved pnpm workspace symlink hoisting conflicts and standardized port allocations across all dev servers.",
        displayOrder: 4,
      },
    ],
  },
  {
    id: "cl-2",
    version: "v1.1.0",
    title: "Tailwind CSS v4 Migration & OKLCH Theme Parity",
    releaseDate: "July 2026",
    summary:
      "Modernized design system token pipeline with zero runtime CSS overhead and seamless dark/light theme switching.",
    isPublished: true,
    createdAt: "2026-07-25T00:00:00.000Z",
    items: [
      {
        id: "item-2-1",
        category: "IMPROVEMENT",
        description:
          "Migrated entire @workspace/ui component library to Tailwind CSS v4 and native CSS variables.",
        displayOrder: 1,
      },
      {
        id: "item-2-2",
        category: "FEATURE",
        description:
          "Added Base UI dialogs, dropdowns, and progressive blur animations across portfolio and store.",
        displayOrder: 2,
      },
      {
        id: "item-2-3",
        category: "FIX",
        description:
          "Eliminated hydration mismatch on initial theme rendering via next-themes AppProvider wrapper.",
        displayOrder: 3,
      },
    ],
  },
  {
    id: "cl-3",
    version: "v1.0.0",
    title: "Initial Monorepo Architecture Setup",
    releaseDate: "June 2026",
    summary:
      "Foundational release establishing Turborepo, Next.js 16, React 19, and shared TypeScript configurations.",
    isPublished: true,
    createdAt: "2026-06-15T00:00:00.000Z",
    items: [
      {
        id: "item-3-1",
        category: "FEATURE",
        description:
          "Configured Turborepo pipeline with remote caching, strict linting, and typecheck tasks.",
        displayOrder: 1,
      },
      {
        id: "item-3-2",
        category: "FEATURE",
        description:
          "Scaffolded portfolio, blog, and shop public applications with shared layout primitives.",
        displayOrder: 2,
      },
    ],
  },
]

export async function getChangelogReleases(): Promise<ChangelogReleaseData[]> {
  try {
    const releaseRows = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.isPublished, true))
      .orderBy(desc(changelogs.createdAt))

    if (releaseRows.length > 0) {
      const fullReleases: ChangelogReleaseData[] = await Promise.all(
        releaseRows.map(async (rel) => {
          const items = await db
            .select({
              id: changelogItems.id,
              category: changelogItems.category,
              description: changelogItems.description,
              displayOrder: changelogItems.displayOrder,
            })
            .from(changelogItems)
            .where(eq(changelogItems.changelogId, rel.id))
            .orderBy(asc(changelogItems.displayOrder))

          return {
            id: rel.id,
            version: rel.version,
            title: rel.title,
            releaseDate: rel.releaseDate,
            summary: rel.summary,
            isPublished: rel.isPublished,
            createdAt: rel.createdAt,
            items,
          }
        })
      )

      return fullReleases
    }
  } catch (error) {
    console.warn(
      "[Changelog Data Layer] Failed to fetch changelog releases, using fallback:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return fallbackChangelogs
}

export async function getLatestRelease(): Promise<ChangelogReleaseData | null> {
  const releases = await getChangelogReleases()
  return releases[0] || null
}
