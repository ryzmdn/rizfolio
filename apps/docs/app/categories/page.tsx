import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import {
  GraduationCap,
  FolderGit2,
  Layers,
  Code2,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Cpu,
} from "lucide-react"
import {
  getCategoriesAndCourses,
  getRepoStats,
  getRepositories,
} from "../../lib/queries"
import { getBaseUrl, createBreadcrumbJsonLd } from "@workspace/ui/lib/seo"

export const revalidate = 3600

const categoriesUrl = `${getBaseUrl("docs")}/categories`

export const metadata: Metadata = {
  title: "Curriculum Taxonomy & Categories | Rizfolio Docs",
  description:
    "Eksplorasi taksonomi kurikulum akademik, domain repositori kode sumber, dan indeks teknologi monorepo Rizfolio.",
  alternates: {
    canonical: categoriesUrl,
  },
  openGraph: {
    title: "Curriculum Taxonomy & Categories — Rizfolio Docs",
    description:
      "Arsip kurikulum akademik universitas, riset eksperimental, dan pustaka open source.",
    url: categoriesUrl,
  },
}

export default async function CategoriesIndexPage() {
  const [{ courses }, stats, allRepos] = await Promise.all([
    getCategoriesAndCourses(),
    getRepoStats(),
    getRepositories(),
  ])

  const techMap = new Map<string, number>()
  for (const repo of allRepos) {
    if (repo.techStack) {
      for (const tech of repo.techStack) {
        techMap.set(tech, (techMap.get(tech) || 0) + 1)
      }
    }
  }

  const sortedTechs = Array.from(techMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const semesterMap = new Map<
    string,
    { name: string; semester?: string; count: number }[]
  >()

  for (const c of courses) {
    const sem = c.semester || "General Coursework"
    const existing = semesterMap.get(sem) || []
    existing.push(c)
    semesterMap.set(sem, existing)
  }

  const semesterGroups = Array.from(semesterMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  const DOMAIN_CARDS = [
    {
      title: "Tugas Kuliah",
      subtitle: "Academic Coursework",
      description:
        "Implementasi sistem terdistribusi, kernel memory allocator, algoritma struktur data, dan arsip proyek akademik universitas.",
      count: stats.assignments,
      href: "/?category=ASSIGNMENT",
      icon: GraduationCap,
    },
    {
      title: "Eksperimen",
      subtitle: "Laboratory & Prototypes",
      description:
        "Riset dan eksperimen rekayasa antarmuka pengguna, generator palet warna OKLCH, dan eksplorasi komputasi persepsi visual.",
      count: stats.experiments,
      href: "/?category=EXPERIMENT",
      icon: Layers,
    },
    {
      title: "Open Source",
      subtitle: "Public Tools & Starter Kits",
      description:
        "Arsitektur monorepo skala enterprise, starter kit Next.js 16 dengan boundary terisolasi, dan paket utilitas publik.",
      count: stats.openSource,
      href: "/?category=OPEN_SOURCE",
      icon: FolderGit2,
    },
  ]

  const baseUrl = getBaseUrl("docs")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Curriculum Taxonomy & Categories — Rizfolio Docs",
    description:
      "Arsip kurikulum akademik universitas, riset eksperimental, dan pustaka open source.",
    url: categoriesUrl,
    author: {
      "@type": "Person",
      name: "Rizky Ramadhan",
      url: "https://ryzmdn.me",
    },
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Docs", url: baseUrl },
    { name: "Categories", url: categoriesUrl },
  ])

  return (
    <Container className="space-y-16 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          docs
        </Link>
        <span className="text-foreground/20">/</span>
        <span className="font-semibold text-foreground">categories</span>
      </div>

      <div className="max-w-3xl space-y-4 border-b border-foreground/8 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase backdrop-blur-md">
          <BookOpen className="size-3 text-foreground" />
          <span>TAXONOMY // CURRICULUM ARCHIVE</span>
        </div>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Mata Kuliah{" "}
          <span className="font-sans text-muted-foreground/80 italic">&</span>{" "}
          Taksonomi
        </h1>
        <p className="text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
          Struktur klasifikasi komprehensif memetakan repositori kode sumber ke
          dalam domain utama, kurikulum akademik berdasarkan semester, serta
          indeks teknologi yang digunakan.
        </p>
      </div>

      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
            Kategori Domain Utama
          </h2>
          <p className="font-sans text-xs font-light text-muted-foreground">
            Tiga pilar klasifikasi arsip proyek dan dokumentasi teknis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DOMAIN_CARDS.map((domain) => {
            const Icon = domain.icon
            return (
              <Link
                key={domain.title}
                href={domain.href}
                className="group relative flex flex-col justify-between rounded-3xl border border-foreground/8 bg-card/40 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/[0.03] text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 font-mono text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground tabular-nums">
                        {domain.count}
                      </span>{" "}
                      repos
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-normal text-foreground group-hover:underline">
                      {domain.title}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {domain.subtitle}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed font-light text-muted-foreground">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-1.5 font-mono text-xs font-medium text-foreground">
                  <span>Lihat Repositori</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-1 border-b border-foreground/8 pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
              Kurikulum Akademik per Semester
            </h2>
          </div>
          <p className="font-sans text-xs font-light text-muted-foreground">
            Daftar mata kuliah dan topik perkuliahan ilmu komputer yang memiliki
            arsip kode dan tugas terkait.
          </p>
        </div>

        {semesterGroups.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-foreground/15 p-12 text-center font-mono text-xs text-muted-foreground">
            Belum ada mata kuliah yang terdata.
          </div>
        ) : (
          <div className="space-y-10">
            {semesterGroups.map(([semesterName, courseList]) => (
              <div key={semesterName} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1 font-mono text-xs font-medium text-foreground">
                    {semesterName}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    ({courseList.length} mata kuliah)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courseList.map((course) => (
                    <Link
                      key={course.name}
                      href={`/?course=${encodeURIComponent(course.name)}`}
                      className="group flex items-center justify-between rounded-2xl border border-foreground/8 bg-card/40 p-5 backdrop-blur-md transition-all duration-200 hover:border-foreground/30 hover:shadow-xs"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.02] text-muted-foreground group-hover:text-foreground">
                          <Code2 className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-serif text-sm font-normal text-foreground group-hover:underline">
                            {course.name}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {course.count} repositori
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {sortedTechs.length > 0 && (
        <section className="space-y-6 border-t border-foreground/8 pt-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-muted-foreground" />
              <h2 className="font-serif text-2xl font-light tracking-tight text-foreground">
                Indeks Teknologi
              </h2>
            </div>
            <p className="font-sans text-xs font-light text-muted-foreground">
              Pilih bahasa pemrograman atau framework untuk menyaring repositori
              secara instan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {sortedTechs.map((tech) => (
              <Link
                key={tech.name}
                href={`/?search=${encodeURIComponent(tech.name)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-4 py-2 font-mono text-xs text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <span>{tech.name}</span>
                <span className="py-0.2 rounded-full bg-foreground/10 px-1.5 font-mono text-[10px] text-muted-foreground tabular-nums group-hover:bg-background/20 group-hover:text-background">
                  {tech.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
