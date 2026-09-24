import { unstable_cache } from "next/cache"
import { db, changelogs, changelogItems, eq, desc, asc } from "@workspace/db"
import {
  fallbackChangelogs,
  roadmapItems,
  type ChangelogCategory,
  type ChangelogItemData,
  type ChangelogReleaseData,
  type RoadmapItemData,
  type ReleaseMetric,
} from "../data"

export type {
  ChangelogCategory,
  ChangelogItemData,
  ChangelogReleaseData,
  RoadmapItemData,
  ReleaseMetric,
}

export interface ChangelogFilterOptions {
  category?: string
  appScope?: string
  query?: string
  year?: string
}

function filterFallbackReleases(
  releases: ChangelogReleaseData[],
  filters?: ChangelogFilterOptions
): ChangelogReleaseData[] {
  if (!filters) return releases

  let filtered = [...releases]

  if (filters.category && filters.category !== "ALL") {
    const targetCat = filters.category.toUpperCase()
    filtered = filtered
      .map((rel) => ({
        ...rel,
        items: rel.items.filter(
          (item) => item.category.toUpperCase() === targetCat
        ),
      }))
      .filter((rel) => rel.items.length > 0)
  }

  if (filters.appScope && filters.appScope !== "ALL") {
    const targetScope = filters.appScope.toLowerCase()
    filtered = filtered.filter(
      (rel) =>
        rel.scope.some((s) => s.toLowerCase().includes(targetScope)) ||
        rel.items.some(
          (item) =>
            item.scope && item.scope.toLowerCase().includes(targetScope)
        )
    )
  }

  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase().trim()
    filtered = filtered.filter(
      (rel) =>
        rel.version.toLowerCase().includes(q) ||
        rel.title.toLowerCase().includes(q) ||
        (rel.summary && rel.summary.toLowerCase().includes(q)) ||
        rel.items.some((item) => item.description.toLowerCase().includes(q))
    )
  }

  if (filters.year && filters.year !== "ALL") {
    filtered = filtered.filter(
      (rel) =>
        rel.releaseDate.includes(filters.year!) ||
        new Date(rel.createdAt).getFullYear().toString() === filters.year
    )
  }

  return filtered
}

async function fetchChangelogReleases(
  filters?: ChangelogFilterOptions
): Promise<ChangelogReleaseData[]> {
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

          const fallbackMatch = fallbackChangelogs.find(
            (fb) => fb.version.toLowerCase() === rel.version.toLowerCase()
          )

          return {
            id: rel.id,
            version: rel.version,
            slug: rel.version.toLowerCase().replace(/\./g, "-"),
            title: rel.title,
            releaseDate: rel.releaseDate,
            summary: rel.summary,
            commitSha: fallbackMatch?.commitSha || "main",
            scope: fallbackMatch?.scope || ["monorepo"],
            metrics: fallbackMatch?.metrics,
            isPublished: rel.isPublished,
            createdAt:
              rel.createdAt instanceof Date
                ? rel.createdAt.toISOString()
                : String(rel.createdAt),
            items: items.map((it) => ({
              ...it,
              scope: fallbackMatch?.items.find((fbi) => fbi.id === it.id)?.scope,
            })),
          }
        })
      )

      return filterFallbackReleases(fullReleases, filters)
    }
  } catch {
    return filterFallbackReleases(fallbackChangelogs, filters)
  }

  return filterFallbackReleases(fallbackChangelogs, filters)
}

export async function getChangelogReleases(
  filters?: ChangelogFilterOptions
): Promise<ChangelogReleaseData[]> {
  const cacheKey = `releases-${filters?.category || "all"}-${filters?.appScope || "all"}-${filters?.query || ""}-${filters?.year || "all"}`
  return unstable_cache(
    () => fetchChangelogReleases(filters),
    ["changelog-releases", cacheKey],
    {
      revalidate: 3600,
      tags: ["changelog"],
    }
  )()
}

async function fetchReleaseByVersion(
  version: string
): Promise<ChangelogReleaseData | null> {
  const normalized = version.toLowerCase().trim()
  const cleanVersion = normalized.startsWith("v")
    ? normalized
    : `v${normalized}`
  const hyphenVersion = normalized.replace(/\./g, "-")

  try {
    const [row] = await db
      .select()
      .from(changelogs)
      .where(eq(changelogs.version, cleanVersion))
      .limit(1)

    if (row) {
      const items = await db
        .select({
          id: changelogItems.id,
          category: changelogItems.category,
          description: changelogItems.description,
          displayOrder: changelogItems.displayOrder,
        })
        .from(changelogItems)
        .where(eq(changelogItems.changelogId, row.id))
        .orderBy(asc(changelogItems.displayOrder))

      const fallbackMatch = fallbackChangelogs.find(
        (fb) => fb.version.toLowerCase() === row.version.toLowerCase()
      )

      return {
        id: row.id,
        version: row.version,
        slug: row.version.toLowerCase().replace(/\./g, "-"),
        title: row.title,
        releaseDate: row.releaseDate,
        summary: row.summary,
        commitSha: fallbackMatch?.commitSha || "main",
        scope: fallbackMatch?.scope || ["monorepo"],
        metrics: fallbackMatch?.metrics,
        isPublished: row.isPublished,
        createdAt:
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : String(row.createdAt),
        items,
      }
    }
  } catch {
    const fallbackMatch = fallbackChangelogs.find(
      (rel) =>
        rel.version.toLowerCase() === normalized ||
        rel.version.toLowerCase() === cleanVersion ||
        rel.slug.toLowerCase() === normalized ||
        rel.slug.toLowerCase() === hyphenVersion
    )
    return fallbackMatch || null
  }

  const fallbackMatch = fallbackChangelogs.find(
    (rel) =>
      rel.version.toLowerCase() === normalized ||
      rel.version.toLowerCase() === cleanVersion ||
      rel.slug.toLowerCase() === normalized ||
      rel.slug.toLowerCase() === hyphenVersion
  )
  return fallbackMatch || null
}

export async function getReleaseByVersion(
  version: string
): Promise<ChangelogReleaseData | null> {
  return unstable_cache(
    () => fetchReleaseByVersion(version),
    ["changelog-release", version],
    {
      revalidate: 3600,
      tags: ["changelog", `release-${version}`],
    }
  )()
}

export async function getAllReleaseVersions(): Promise<string[]> {
  try {
    const rows = await db
      .select({ version: changelogs.version })
      .from(changelogs)
      .where(eq(changelogs.isPublished, true))

    if (rows && rows.length > 0) {
      return rows.map((r) => r.version)
    }
  } catch {
    return fallbackChangelogs.map((r) => r.version)
  }

  return fallbackChangelogs.map((r) => r.version)
}

export async function getLatestRelease(): Promise<ChangelogReleaseData | null> {
  const releases = await getChangelogReleases()
  return releases[0] || null
}

export async function getAdjacentReleases(version: string): Promise<{
  newer: ChangelogReleaseData | null
  older: ChangelogReleaseData | null
}> {
  const releases = await getChangelogReleases()
  const cleanVersion = version.toLowerCase().trim()
  const index = releases.findIndex(
    (r) =>
      r.version.toLowerCase() === cleanVersion ||
      r.slug.toLowerCase() === cleanVersion
  )

  if (index === -1) {
    return { newer: null, older: null }
  }

  return {
    newer: index > 0 ? (releases[index - 1] ?? null) : null,
    older: index < releases.length - 1 ? (releases[index + 1] ?? null) : null,
  }
}

export async function getRoadmapItems(
  stage?: string
): Promise<RoadmapItemData[]> {
  if (stage && stage !== "ALL") {
    return roadmapItems.filter(
      (item) => item.stage.toUpperCase() === stage.toUpperCase()
    )
  }
  return roadmapItems
}

export async function getChangelogStats(): Promise<{
  totalReleases: number
  shippedMilestones: number
  appsCount: number
  currentVersion: string
}> {
  const releases = await getChangelogReleases()
  const allScopes = new Set<string>()
  let totalItemsCount = 0

  for (const rel of releases) {
    for (const sc of rel.scope) {
      allScopes.add(sc)
    }
    totalItemsCount += rel.items.length
  }

  return {
    totalReleases: releases.length,
    shippedMilestones: totalItemsCount,
    appsCount: allScopes.size > 0 ? allScopes.size : 6,
    currentVersion: releases[0]?.version || "v1.3.0",
  }
}
