import {
  fallbackRepositories,
  fallbackRepoFiles,
  fallbackRepoReleases,
  type FallbackRepository,
  type FallbackRepoFile,
  type FallbackRepoRelease,
} from "./fallback-repos"

export * from "./fallback-repos"

export interface FallbackFilterOptions {
  category?: string
  search?: string
  courseName?: string
  sortBy?: "latest" | "stars" | "downloads" | "alphabetical"
  limit?: number
  offset?: number
}

export function getFallbackRepositories(filters: FallbackFilterOptions = {}): FallbackRepository[] {
  let list = [...fallbackRepositories]

  if (filters.category && filters.category !== "ALL") {
    list = list.filter((r) => r.category === filters.category)
  }

  if (filters.courseName) {
    list = list.filter((r) => r.courseName === filters.courseName)
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        r.slug.toLowerCase().includes(q) ||
        r.techStack.some((t) => t.toLowerCase().includes(q)) ||
        (r.courseName && r.courseName.toLowerCase().includes(q))
    )
  }

  if (filters.sortBy === "stars") {
    list.sort((a, b) => b.starsCount - a.starsCount)
  } else if (filters.sortBy === "downloads") {
    list.sort((a, b) => b.downloadsCount - a.downloadsCount)
  } else if (filters.sortBy === "alphabetical") {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    // Default: latest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const offset = filters.offset || 0
  if (filters.limit) {
    return list.slice(offset, offset + filters.limit)
  }

  return list.slice(offset)
}

export function getFallbackRepository(slug: string): FallbackRepository | null {
  return fallbackRepositories.find((r) => r.slug === slug) || null
}

export function getFallbackRepoFiles(repoId: string, parentPath = ""): FallbackRepoFile[] {
  const normalizedParent = parentPath.trim().replace(/^\/+|\/+$/g, "")

  return fallbackRepoFiles
    .filter((f) => f.repoId === repoId && f.parentPath === normalizedParent)
    .sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.filename.localeCompare(b.filename)
    })
}

export function getFallbackFileContent(repoId: string, filePath: string): FallbackRepoFile | null {
  const normalizedPath = filePath.trim().replace(/^\/+|\/+$/g, "")
  return fallbackRepoFiles.find((f) => f.repoId === repoId && f.path === normalizedPath) || null
}

export function getFallbackReleases(repoId: string): FallbackRepoRelease[] {
  return fallbackRepoReleases
    .filter((rel) => rel.repoId === repoId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getFallbackStats() {
  const total = fallbackRepositories.length
  const assignments = fallbackRepositories.filter((r) => r.category === "ASSIGNMENT").length
  const experiments = fallbackRepositories.filter((r) => r.category === "EXPERIMENT").length
  const openSource = fallbackRepositories.filter((r) => r.category === "OPEN_SOURCE").length

  const totalStars = fallbackRepositories.reduce((acc, curr) => acc + (curr.starsCount || 0), 0)
  const totalDownloads = fallbackRepositories.reduce(
    (acc, curr) => acc + (curr.downloadsCount || 0),
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

export function getFallbackCategoriesAndCourses() {
  const coursesMap = new Map<string, { semester?: string; count: number }>()

  for (const r of fallbackRepositories) {
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
}

export function getAllFallbackSlugs(): string[] {
  return fallbackRepositories.map((r) => r.slug)
}

export function getAllFallbackFilePaths(slug: string): string[] {
  const repo = getFallbackRepository(slug)
  if (!repo) return []

  return fallbackRepoFiles
    .filter((f) => f.repoId === repo.id && !f.isDirectory)
    .map((f) => f.path)
}
