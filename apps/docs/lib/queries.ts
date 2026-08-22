import { unstable_cache } from "next/cache"
import { db, eq, and, or, ilike, desc, asc } from "@workspace/db"
import { repositories, repoFiles, repoReleases } from "@workspace/db/schema"

export interface RepositoryFilters {
  category?: string
  search?: string
  courseName?: string
  techStack?: string
  sortBy?: "latest" | "stars" | "downloads"
  limit?: number
  offset?: number
}

async function fetchRepositories(filters: RepositoryFilters = {}) {
  try {
    const conditions = [eq(repositories.isPublic, true)]

    if (filters.category && filters.category !== "ALL") {
      conditions.push(eq(repositories.category, filters.category))
    }

    if (filters.courseName) {
      conditions.push(eq(repositories.courseName, filters.courseName))
    }

    if (filters.search) {
      const searchPattern = `%${filters.search}%`
      conditions.push(
        or(
          ilike(repositories.name, searchPattern),
          ilike(repositories.description, searchPattern),
          ilike(repositories.slug, searchPattern)
        )!
      )
    }

    let orderByClause = desc(repositories.createdAt)
    if (filters.sortBy === "stars") {
      orderByClause = desc(repositories.starsCount)
    } else if (filters.sortBy === "downloads") {
      orderByClause = desc(repositories.downloadsCount)
    }

    const query = db
      .select()
      .from(repositories)
      .where(and(...conditions))
      .orderBy(orderByClause)

    if (filters.limit) {
      query.limit(filters.limit)
    }
    if (filters.offset) {
      query.offset(filters.offset)
    }

    return await query
  } catch (error) {
    console.error("Failed to fetch repositories:", error)
    return []
  }
}

export async function getRepositories(filters: RepositoryFilters = {}) {
  const cacheKey = `docs-repos-${filters.category || "all"}-${filters.search || ""}-${filters.courseName || ""}-${filters.sortBy || "latest"}-${filters.limit || 0}-${filters.offset || 0}`
  return unstable_cache(
    () => fetchRepositories(filters),
    ["docs-repositories", cacheKey],
    {
      revalidate: 3600,
      tags: ["docs"],
    }
  )()
}

async function fetchRepositoryBySlug(slug: string) {
  try {
    const repo = await db.query?.repositories?.findFirst?.({
      where: eq(repositories.slug, slug),
    })

    if (repo) return repo

    const [found] = await db
      .select()
      .from(repositories)
      .where(eq(repositories.slug, slug))
      .limit(1)

    return found || null
  } catch (error) {
    console.error(`Failed to fetch repository by slug (${slug}):`, error)
    return null
  }
}

export async function getRepositoryBySlug(slug: string) {
  return unstable_cache(
    () => fetchRepositoryBySlug(slug),
    ["docs-repo", slug],
    {
      revalidate: 3600,
      tags: ["docs", `docs-${slug}`],
    }
  )()
}

export async function getRepoFiles(repoId: string, parentPath = "") {
  try {
    const files = await db
      .select()
      .from(repoFiles)
      .where(
        and(eq(repoFiles.repoId, repoId), eq(repoFiles.parentPath, parentPath))
      )
      .orderBy(desc(repoFiles.isDirectory), asc(repoFiles.filename))

    return files
  } catch (error) {
    console.error(
      `Failed to fetch repo files (${repoId}, ${parentPath}):`,
      error
    )
    return []
  }
}

export async function getFileContent(repoId: string, filePath: string) {
  try {
    const [file] = await db
      .select()
      .from(repoFiles)
      .where(and(eq(repoFiles.repoId, repoId), eq(repoFiles.path, filePath)))
      .limit(1)

    return file || null
  } catch (error) {
    console.error(
      `Failed to fetch file content (${repoId}, ${filePath}):`,
      error
    )
    return null
  }
}

export async function getRepoReleases(repoId: string) {
  try {
    return await db
      .select()
      .from(repoReleases)
      .where(eq(repoReleases.repoId, repoId))
      .orderBy(desc(repoReleases.createdAt))
  } catch (error) {
    console.error(`Failed to fetch releases (${repoId}):`, error)
    return []
  }
}

async function fetchRepoStats() {
  try {
    const allRepos = await db
      .select({
        category: repositories.category,
        stars: repositories.starsCount,
        downloads: repositories.downloadsCount,
        techStack: repositories.techStack,
      })
      .from(repositories)
      .where(eq(repositories.isPublic, true))

    const total = allRepos.length
    const assignments = allRepos.filter(
      (r) => r.category === "ASSIGNMENT"
    ).length
    const experiments = allRepos.filter(
      (r) => r.category === "EXPERIMENT"
    ).length
    const openSource = allRepos.filter(
      (r) => r.category === "OPEN_SOURCE"
    ).length

    const totalStars = allRepos.reduce(
      (acc, curr) => acc + (curr.stars || 0),
      0
    )
    const totalDownloads = allRepos.reduce(
      (acc, curr) => acc + (curr.downloads || 0),
      0
    )

    return {
      total,
      assignments,
      experiments,
      openSource,
      totalStars,
      totalDownloads,
    }
  } catch (error) {
    console.error("Failed to fetch archive stats:", error)
    return {
      total: 0,
      assignments: 0,
      experiments: 0,
      openSource: 0,
      totalStars: 0,
      totalDownloads: 0,
    }
  }
}

export const getRepoStats = unstable_cache(
  fetchRepoStats,
  ["docs-repo-stats"],
  {
    revalidate: 3600,
    tags: ["docs"],
  }
)

async function fetchCategoriesAndCourses() {
  try {
    const repos = await db
      .select({
        courseName: repositories.courseName,
        semester: repositories.semester,
        category: repositories.category,
      })
      .from(repositories)
      .where(eq(repositories.isPublic, true))

    const coursesMap = new Map<string, { semester?: string; count: number }>()

    for (const r of repos) {
      if (r.courseName) {
        const existing = coursesMap.get(r.courseName) || {
          semester: r.semester || undefined,
          count: 0,
        }
        existing.count += 1
        coursesMap.set(r.courseName, existing)
      }
    }

    const courses = Array.from(coursesMap.entries()).map(([name, val]) => ({
      name,
      semester: val.semester,
      count: val.count,
    }))

    return { courses }
  } catch (error) {
    console.error("Failed to fetch categories & courses:", error)
    return { courses: [] }
  }
}

export const getCategoriesAndCourses = unstable_cache(
  fetchCategoriesAndCourses,
  ["docs-categories-courses"],
  {
    revalidate: 3600,
    tags: ["docs"],
  }
)
