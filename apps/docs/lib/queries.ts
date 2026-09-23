import { unstable_cache } from "next/cache"
import { db, eq, and, or, ilike, desc, asc } from "@workspace/db"
import { repositories, repoFiles, repoReleases } from "@workspace/db/schema"
import {
  getFallbackRepositories,
  getFallbackRepository,
  getFallbackRepoFiles,
  getFallbackFileContent,
  getFallbackReleases,
  getFallbackStats,
  getFallbackCategoriesAndCourses,
  getAllFallbackSlugs,
  getAllFallbackFilePaths,
  type FallbackRepository,
  type FallbackRepoFile,
  type FallbackRepoRelease,
} from "../data"

export type { FallbackRepository, FallbackRepoFile, FallbackRepoRelease }

export interface RepositoryFilters {
  category?: string
  search?: string
  courseName?: string
  techStack?: string
  sortBy?: "latest" | "stars" | "downloads" | "alphabetical"
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
    } else if (filters.sortBy === "alphabetical") {
      orderByClause = asc(repositories.name)
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

    const rows = await query
    if (rows && rows.length > 0) {
      return rows
    }

    return getFallbackRepositories(filters)
  } catch (error) {
    console.error(
      "Failed to fetch repositories from database, serving resilient fallback data:",
      error
    )
    return getFallbackRepositories(filters)
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

    if (found) return found

    return getFallbackRepository(slug)
  } catch (error) {
    console.error(
      `Failed to fetch repository by slug (${slug}), serving resilient fallback data:`,
      error
    )
    return getFallbackRepository(slug)
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

    if (files && files.length > 0) {
      return files
    }

    return getFallbackRepoFiles(repoId, parentPath)
  } catch (error) {
    console.error(
      `Failed to fetch repo files (${repoId}, ${parentPath}), serving resilient fallback data:`,
      error
    )
    return getFallbackRepoFiles(repoId, parentPath)
  }
}

export async function getFileContent(repoId: string, filePath: string) {
  try {
    const [file] = await db
      .select()
      .from(repoFiles)
      .where(and(eq(repoFiles.repoId, repoId), eq(repoFiles.path, filePath)))
      .limit(1)

    if (file) return file

    return getFallbackFileContent(repoId, filePath)
  } catch (error) {
    console.error(
      `Failed to fetch file content (${repoId}, ${filePath}), serving resilient fallback data:`,
      error
    )
    return getFallbackFileContent(repoId, filePath)
  }
}

export async function getRepoReleases(repoId: string) {
  try {
    const releases = await db
      .select()
      .from(repoReleases)
      .where(eq(repoReleases.repoId, repoId))
      .orderBy(desc(repoReleases.createdAt))

    if (releases && releases.length > 0) {
      return releases
    }

    return getFallbackReleases(repoId)
  } catch (error) {
    console.error(
      `Failed to fetch releases (${repoId}), serving resilient fallback data:`,
      error
    )
    return getFallbackReleases(repoId)
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

    if (allRepos && allRepos.length > 0) {
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
    }

    return getFallbackStats()
  } catch (error) {
    console.error(
      "Failed to fetch docs repo stats, serving resilient fallback data:",
      error
    )
    return getFallbackStats()
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

    if (repos && repos.length > 0) {
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

      if (courses.length > 0) {
        return { courses }
      }
    }

    return getFallbackCategoriesAndCourses()
  } catch (error) {
    console.error(
      "Failed to fetch categories & courses, serving resilient fallback data:",
      error
    )
    return getFallbackCategoriesAndCourses()
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

export async function getAllRepoSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: repositories.slug })
      .from(repositories)
      .where(eq(repositories.isPublic, true))

    if (rows && rows.length > 0) {
      return rows.map((r) => r.slug)
    }

    return getAllFallbackSlugs()
  } catch {
    return getAllFallbackSlugs()
  }
}

export async function getAllRepoFilePaths(slug: string): Promise<string[]> {
  try {
    const repo = await getRepositoryBySlug(slug)
    if (!repo) return getAllFallbackFilePaths(slug)

    const files = await db
      .select({ path: repoFiles.path, isDirectory: repoFiles.isDirectory })
      .from(repoFiles)
      .where(and(eq(repoFiles.repoId, repo.id), eq(repoFiles.isDirectory, false)))

    if (files && files.length > 0) {
      return files.map((f) => f.path)
    }

    return getAllFallbackFilePaths(slug)
  } catch {
    return getAllFallbackFilePaths(slug)
  }
}
