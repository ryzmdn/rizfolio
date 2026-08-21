import { db, changelogs, changelogItems } from "../index"

export async function seedChangelog() {
  console.log("Seeding Changelog Domain...")

  await db.delete(changelogItems)
  await db.delete(changelogs)

  const r1 = await db
    .insert(changelogs)
    .values({
      version: "v1.2.0",
      title: "Personal CMS & GitHub-Style Archive Explorer",
      releaseDate: "August 2026",
      summary:
        "Major ecosystem upgrade introducing full dynamic CMS management, Shiki-powered open-source code explorer, and unified database layers.",
      isPublished: true,
    })
    .returning()

  const r2 = await db
    .insert(changelogs)
    .values({
      version: "v1.1.0",
      title: "Tailwind CSS v4 Migration & OKLCH Theme Parity",
      releaseDate: "July 2026",
      summary:
        "Modernized design system token pipeline with zero runtime CSS overhead and seamless dark/light theme switching.",
      isPublished: true,
    })
    .returning()

  const r3 = await db
    .insert(changelogs)
    .values({
      version: "v1.0.0",
      title: "Initial Monorepo Architecture Setup",
      releaseDate: "June 2026",
      summary:
        "Foundational release establishing Turborepo, Next.js 16, React 19, and shared TypeScript configurations.",
      isPublished: true,
    })
    .returning()

  const rel1 = r1[0]
  if (rel1) {
    await db.insert(changelogItems).values([
      {
        changelogId: rel1.id,
        category: "FEATURE",
        description:
          "Launched apps/archive with Shiki server-side code highlighting, folder navigation, and direct ZIP archive downloads.",
        displayOrder: 1,
      },
      {
        changelogId: rel1.id,
        category: "FEATURE",
        description:
          "Launched apps/cms dashboard for owner-only dynamic content management across all 6 applications.",
        displayOrder: 2,
      },
      {
        changelogId: rel1.id,
        category: "IMPROVEMENT",
        description:
          "Integrated Drizzle ORM and Supabase transaction pooler (@workspace/db) with full type-safe relational schemas.",
        displayOrder: 3,
      },
      {
        changelogId: rel1.id,
        category: "FIX",
        description:
          "Resolved pnpm workspace symlink hoisting conflicts and standardized port allocations across all dev servers.",
        displayOrder: 4,
      },
    ])
  }

  const rel2 = r2[0]
  if (rel2) {
    await db.insert(changelogItems).values([
      {
        changelogId: rel2.id,
        category: "IMPROVEMENT",
        description:
          "Migrated entire @workspace/ui component library to Tailwind CSS v4 and native CSS variables.",
        displayOrder: 1,
      },
      {
        changelogId: rel2.id,
        category: "FEATURE",
        description:
          "Added Base UI dialogs, dropdowns, and progressive blur animations across portfolio and store.",
        displayOrder: 2,
      },
      {
        changelogId: rel2.id,
        category: "FIX",
        description:
          "Eliminated hydration mismatch on initial theme rendering via next-themes AppProvider wrapper.",
        displayOrder: 3,
      },
    ])
  }

  const rel3 = r3[0]
  if (rel3) {
    await db.insert(changelogItems).values([
      {
        changelogId: rel3.id,
        category: "FEATURE",
        description:
          "Configured Turborepo pipeline with remote caching, strict linting, and typecheck tasks.",
        displayOrder: 1,
      },
      {
        changelogId: rel3.id,
        category: "FEATURE",
        description:
          "Scaffolded portfolio, blog, and shop public applications with shared layout primitives.",
        displayOrder: 2,
      },
    ])
  }

  console.log("Changelog Domain Seeded Successfully.")
}
