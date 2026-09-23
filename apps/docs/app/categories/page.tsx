import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { Badge } from "@workspace/ui/components/badge"
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

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Curriculum Taxonomy & Categories",
  description:
    "Eksplorasi taksonomi kurikulum akademik, domain repositori kode sumber, dan indeks teknologi monorepo Rizfolio.",
  openGraph: {
    title: "Curriculum Taxonomy & Categories — Rizfolio Docs",
    description:
      "Arsip kurikulum akademik universitas, riset eksperimental, dan pustaka open source.",
  },
}

export default async function CategoriesIndexPage() {
  const [{ courses }, stats, allRepos] = await Promise.all([
    getCategoriesAndCourses(),
    getRepoStats(),
    getRepositories(),
  ])

  // Extract and aggregate unique tech stacks with occurrence counts
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

  // Group courses by semester
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
      badgeVariant: "secondary" as const,
    },
    {
      title: "Eksperimen",
      subtitle: "Laboratory & Prototypes",
      description:
        "Riset dan eksperimen rekayasa antarmuka pengguna, generator palet warna OKLCH, dan eksplorasi komputasi persepsi visual.",
      count: stats.experiments,
      href: "/?category=EXPERIMENT",
      icon: Layers,
      badgeVariant: "outline" as const,
    },
    {
      title: "Open Source",
      subtitle: "Public Tools & Starter Kits",
      description:
        "Arsitektur monorepo skala enterprise, starter kit Next.js 16 dengan boundary terisolasi, dan paket utilitas publik.",
      count: stats.openSource,
      href: "/?category=OPEN_SOURCE",
      icon: FolderGit2,
      badgeVariant: "default" as const,
    },
  ]

  const baseUrl =
    process.env.NEXT_PUBLIC_DOCS_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://docs.rizkyramadhan.dev"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Curriculum Taxonomy & Categories — Rizfolio Docs",
    description:
      "Arsip kurikulum akademik universitas, riset eksperimental, dan pustaka open source.",
    url: `${baseUrl}/categories`,
    author: {
      "@type": "Person",
      name: "Rizky Ramadhan",
      url: "https://rizkyramadhan.dev",
    },
  }

  return (
    <Container className="space-y-14 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          docs
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">categories</span>
      </div>

      <div className="max-w-2xl space-y-3 border-b border-border/70 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" />
          <span>Curriculum & Taxonomy Index</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Mata Kuliah & Taksonomi
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Struktur klasifikasi komprehensif memetakan repositori kode sumber ke
          dalam domain utama, kurikulum akademik berdasarkan semester, serta
          indeks teknologi yang digunakan.
        </p>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Kategori Domain Utama
            </h2>
            <p className="text-xs text-muted-foreground">
              Tiga pilar klasifikasi arsip proyek dan dokumentasi teknis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {DOMAIN_CARDS.map((domain) => {
            const Icon = domain.icon
            return (
              <Link
                key={domain.title}
                href={domain.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className="size-4" />
                    </div>
                    <Badge
                      variant={domain.badgeVariant}
                      className="text-[11px] font-normal"
                    >
                      <span className="font-mono tabular-nums">
                        {domain.count}
                      </span>{" "}
                      repos
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:underline">
                      {domain.title}
                    </h3>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {domain.subtitle}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-medium text-foreground">
                  <span>Lihat Repositori</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-1 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Kurikulum Akademik per Semester
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Daftar mata kuliah dan topik perkuliahan ilmu komputer yang
            memiliki arsip kode dan tugas terkait.
          </p>
        </div>

        {semesterGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center text-xs text-muted-foreground">
            Belum ada mata kuliah yang terdata.
          </div>
        ) : (
          <div className="space-y-8">
            {semesterGroups.map(([semesterName, courseList]) => (
              <div key={semesterName} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 font-mono text-[11px] font-medium text-foreground">
                    {semesterName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({courseList.length} mata kuliah)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {courseList.map((course) => (
                    <Link
                      key={course.name}
                      href={`/?course=${encodeURIComponent(course.name)}`}
                      className="group flex items-center justify-between rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-foreground/30 hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-muted-foreground group-hover:text-foreground">
                          <Code2 className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-foreground group-hover:underline">
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
        <section className="space-y-4 border-t border-border/70 pt-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Indeks Teknologi
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Pilih bahasa pemrograman atau framework untuk menyaring
              repositori secara instan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {sortedTechs.map((tech) => (
              <Link
                key={tech.name}
                href={`/?search=${encodeURIComponent(tech.name)}`}
                className="group inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card px-3 py-1.5 text-xs text-foreground transition-all hover:border-foreground/40 hover:bg-muted"
              >
                <span className="font-mono">{tech.name}</span>
                <span className="rounded-full bg-muted/80 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground tabular-nums group-hover:bg-foreground/10 group-hover:text-foreground">
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
