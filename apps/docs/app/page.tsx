import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { BookOpen, FolderGit2, RotateCcw, X } from "lucide-react"
import {
  getRepositories,
  getRepoStats,
  getCategoriesAndCourses,
} from "../lib/queries"
import { FilterBar } from "../components/filter-bar"
import { RepoCard } from "../components/repo-card"

export const revalidate = 3600

const CATEGORY_NAMES: Record<string, string> = {
  ASSIGNMENT: "Tugas Kuliah",
  EXPERIMENT: "Eksperimen",
  OPEN_SOURCE: "Open Source",
}

const SORT_NAMES: Record<string, string> = {
  stars: "Bintang Terbanyak",
  downloads: "Unduhan Terbanyak",
  alphabetical: "Nama (A-Z)",
}

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    search?: string
    course?: string
    sort?: "latest" | "stars" | "downloads" | "alphabetical"
  }>
}) {
  const params = await searchParams
  const [repos, stats, { courses }] = await Promise.all([
    getRepositories({
      category: params.category,
      search: params.search,
      courseName: params.course,
      sortBy: params.sort,
    }),
    getRepoStats(),
    getCategoriesAndCourses(),
  ])

  const hasActiveFilters = Boolean(
    params.search ||
      (params.category && params.category !== "ALL") ||
      params.course ||
      (params.sort && params.sort !== "latest")
  )

  return (
    <Container className="space-y-10 py-12">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <BookOpen className="size-3.5" />
            <span>Open Source & Documentation Explorer</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Documentation & Code
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Dokumentasi teknis, repositori sumber terbuka, eksperimen mini, dan
            arsip kode akademik. Telusuri struktur kode, benchmark arsitektur,
            dan unduh secara bebas.
          </p>
        </div>

        {/* Quick Stat Counters */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-card/60 p-3 font-mono text-xs text-muted-foreground">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground tabular-nums">
              {stats.total}
            </span>
            <span className="text-[11px]">Repositories</span>
          </div>
          <div className="h-6 w-px bg-border/80" />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground tabular-nums">
              {stats.assignments}
            </span>
            <span className="text-[11px]">Tugas Kuliah</span>
          </div>
          <div className="h-6 w-px bg-border/80" />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground tabular-nums">
              {stats.openSource}
            </span>
            <span className="text-[11px]">Open Source</span>
          </div>
          <div className="h-6 w-px bg-border/80" />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-foreground tabular-nums">
              {stats.totalStars}
            </span>
            <span className="text-[11px]">Stars</span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Controls */}
      <FilterBar courses={courses} />

      {/* Active Filter Chips Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground">Filter aktif:</span>

          {params.search && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-foreground">
              <span>Pencarian: &quot;{params.search}&quot;</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.course ? { course: params.course } : {}),
                  ...(params.sort ? { sort: params.sort } : {}),
                }).toString()}`}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          {params.category && params.category !== "ALL" && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-foreground">
              <span>Kategori: {CATEGORY_NAMES[params.category] || params.category}</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.course ? { course: params.course } : {}),
                  ...(params.sort ? { sort: params.sort } : {}),
                }).toString()}`}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          {params.course && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-foreground">
              <span>Mata Kuliah: {params.course}</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.sort ? { sort: params.sort } : {}),
                }).toString()}`}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          {params.sort && params.sort !== "latest" && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 text-foreground">
              <span>Urutan: {SORT_NAMES[params.sort] || params.sort}</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.course ? { course: params.course } : {}),
                }).toString()}`}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            <span>Reset Semua</span>
          </Link>
        </div>
      )}

      {/* Repositories Grid or Empty State */}
      {repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground">
            <FolderGit2 className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Tidak ada repositori yang cocok
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              Tidak ditemukan repositori atau berkas yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
          </div>
          {hasActiveFilters && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-3" />
              <span>Reset Filter & Tampilkan Semua</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard
              key={repo.id}
              slug={repo.slug}
              name={repo.name}
              description={repo.description}
              category={repo.category}
              courseName={repo.courseName}
              semester={repo.semester}
              techStack={repo.techStack}
              starsCount={repo.starsCount}
              downloadsCount={repo.downloadsCount}
              viewsCount={repo.viewsCount}
              githubUrl={repo.githubUrl}
              demoUrl={repo.demoUrl}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
