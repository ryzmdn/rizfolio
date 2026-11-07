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
import {
  getBaseUrl,
  SEO_CONFIG,
  createWebSiteJsonLd,
} from "@workspace/ui/lib/seo"

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

  const baseUrl = getBaseUrl("docs")

  const websiteSchema = createWebSiteJsonLd({
    siteKey: "docs",
    url: baseUrl,
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SEO_CONFIG.sites.docs.name,
    description: SEO_CONFIG.sites.docs.description,
    url: baseUrl,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
    hasPart: repos.map((repo) => ({
      "@type": "SoftwareSourceCode",
      name: repo.name,
      description: repo.description,
      programmingLanguage: repo.techStack,
      codeRepository: repo.githubUrl || undefined,
      url: `${baseUrl}/repo/${repo.slug}`,
    })),
  }

  return (
    <Container className="space-y-12 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col gap-8 border-b border-foreground/8 pb-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1 text-[11px] font-mono tracking-widest text-muted-foreground uppercase backdrop-blur-md">
            <BookOpen className="size-3 text-foreground" />
            <span>VOLUME 05 // ARCHITECTURAL BLUEPRINTS & OPEN SOURCE ARCHIVES</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
            Architectural Blueprints <span className="font-sans italic text-muted-foreground/80">&</span> Open Archives
          </h1>
          <p className="text-base sm:text-lg font-light leading-relaxed text-muted-foreground">
            Dokumentasi teknis, repositori sumber terbuka, eksperimen mini, dan
            arsip kode akademik. Telusuri struktur kode, benchmark arsitektur,
            dan unduh secara bebas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 rounded-3xl border border-foreground/8 bg-card/40 p-5 sm:p-6 font-mono text-xs backdrop-blur-xl shadow-xs">
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-light text-foreground tabular-nums">
              {stats.total}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Repositories</span>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-light text-foreground tabular-nums">
              {stats.assignments}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Coursework</span>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-light text-foreground tabular-nums">
              {stats.openSource}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Open Source</span>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl sm:text-3xl font-light text-foreground tabular-nums">
              {stats.totalStars}
            </span>
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Stars</span>
          </div>
        </div>
      </div>

      <FilterBar courses={courses} />

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Filter aktif:</span>

          {params.search && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-mono text-xs text-foreground backdrop-blur-sm">
              <span>Pencarian: &quot;{params.search}&quot;</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.course ? { course: params.course } : {}),
                  ...(params.sort ? { sort: params.sort } : {}),
                }).toString()}`}
                className="ml-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          {params.category && params.category !== "ALL" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-mono text-xs text-foreground backdrop-blur-sm">
              <span>
                Kategori: {CATEGORY_NAMES[params.category] || params.category}
              </span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.course ? { course: params.course } : {}),
                  ...(params.sort ? { sort: params.sort } : {}),
                }).toString()}`}
                className="ml-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          {params.course && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-mono text-xs text-foreground backdrop-blur-sm">
              <span>Mata Kuliah: {params.course}</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.sort ? { sort: params.sort } : {}),
                }).toString()}`}
                className="ml-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          {params.sort && params.sort !== "latest" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 font-mono text-xs text-foreground backdrop-blur-sm">
              <span>Urutan: {SORT_NAMES[params.sort] || params.sort}</span>
              <Link
                href={`/?${new URLSearchParams({
                  ...(params.search ? { search: params.search } : {}),
                  ...(params.category ? { category: params.category } : {}),
                  ...(params.course ? { course: params.course } : {}),
                }).toString()}`}
                className="ml-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </Link>
            </span>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1 font-mono text-xs text-muted-foreground transition-all hover:bg-foreground hover:text-background"
          >
            <RotateCcw className="size-3" />
            <span>Reset Semua</span>
          </Link>
        </div>
      )}

      {repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-dashed border-foreground/15 bg-card/30 p-16 text-center backdrop-blur-sm">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.03] text-muted-foreground">
            <FolderGit2 className="size-6" />
          </div>
          <div className="space-y-1.5">
            <p className="font-serif text-xl font-light text-foreground">
              Tidak ada repositori yang cocok
            </p>
            <p className="max-w-sm font-sans text-xs font-light text-muted-foreground">
              Tidak ditemukan repositori atau berkas yang cocok dengan filter
              atau kata kunci pencarian Anda.
            </p>
          </div>
          {hasActiveFilters && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground px-4 py-2 font-mono text-xs text-background transition-all hover:bg-foreground/90"
            >
              <RotateCcw className="size-3" />
              <span>Reset Filter & Tampilkan Semua</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
