import { Container } from "@workspace/ui/components/layouts/container"
import { BookOpen } from "lucide-react"
import {
  getRepositories,
  getRepoStats,
  getCategoriesAndCourses,
} from "../lib/queries"
import { FilterBar } from "../components/filter-bar"
import { RepoCard } from "../components/repo-card"

export const dynamic = "force-dynamic"

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    search?: string
    course?: string
    sort?: "latest" | "stars" | "downloads"
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

  return (
    <Container className="space-y-10 py-12">
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
            arsip kode akademik. Telusuri struktur kode dan unduh secara bebas.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card/60 p-3 font-mono text-xs text-muted-foreground">
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
              {stats.totalStars}
            </span>
            <span className="text-[11px]">Stars</span>
          </div>
        </div>
      </div>

      <FilterBar courses={courses} />

      {repos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          Tidak ada repositori atau dokumen yang cocok dengan filter atau
          pencarian Anda.
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
              demoUrl={repo.demoUrl}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
