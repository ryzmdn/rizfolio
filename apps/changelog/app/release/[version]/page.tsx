import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Sparkles,
  Zap,
  Wrench,
  AlertCircle,
  Tag,
  Gauge,
  Layers,
  ChevronRight,
} from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import { cn } from "@workspace/ui/lib/utils"
import {
  getReleaseByVersion,
  getAllReleaseVersions,
  getAdjacentReleases,
} from "@/lib/queries"
import { ReleaseActionBar } from "@/components"

export const revalidate = 3600

const baseUrl =
  process.env.NEXT_PUBLIC_CHANGELOG_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://changelog.rizkyramadhan.dev"

export async function generateStaticParams() {
  const versions = await getAllReleaseVersions()
  return versions.map((version) => ({
    version: version.toLowerCase(),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ version: string }>
}): Promise<Metadata> {
  const { version } = await params
  const release = await getReleaseByVersion(version)

  if (!release) {
    return {
      title: "Release Not Found",
      description: "The requested release notes could not be located.",
    }
  }

  const title = `${release.title} (Version ${release.version})`
  const description =
    release.summary ||
    `Detailed release notes and architecture changes for version ${release.version}.`

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: `${release.title} (${release.version}) — Rizfolio Changelog`,
      description,
      url: `${baseUrl}/release/${release.version}`,
      publishedTime: release.createdAt,
      siteName: "Rizfolio Changelog",
    },
    twitter: {
      card: "summary_large_image",
      title: `${release.title} (${release.version}) — Rizfolio Changelog`,
      description,
    },
  }
}

const categoryConfig: Record<
  string,
  { label: string; icon: typeof Sparkles; className: string }
> = {
  FEATURE: {
    label: "Features & Additions",
    icon: Sparkles,
    className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  IMPROVEMENT: {
    label: "Improvements & Optimizations",
    icon: Zap,
    className: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  FIX: {
    label: "Bug Fixes & Patches",
    icon: Wrench,
    className: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  BREAKING: {
    label: "Breaking Changes",
    icon: AlertCircle,
    className: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
}

export default async function ReleaseDetailPage({
  params,
}: {
  params: Promise<{ version: string }>
}) {
  const { version } = await params
  const release = await getReleaseByVersion(version)

  if (!release) {
    notFound()
  }

  const adjacent = await getAdjacentReleases(release.version)

  const itemsByCategory: Record<string, typeof release.items> = {}
  for (const item of release.items) {
    const cat = item.category.toUpperCase()
    if (!itemsByCategory[cat]) {
      itemsByCategory[cat] = []
    }
    itemsByCategory[cat].push(item)
  }

  const orderedCategories = ["FEATURE", "IMPROVEMENT", "FIX", "BREAKING"].filter(
    (cat) => itemsByCategory[cat] && itemsByCategory[cat].length > 0
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rizfolio",
    softwareVersion: release.version,
    datePublished: release.createdAt,
    releaseNotes: release.summary || release.title,
    author: {
      "@type": "Person",
      name: "Rizky Ramadhan",
      url: "https://rizkyramadhan.dev",
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Changelog",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Releases",
        item: `${baseUrl}/#releases`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: release.version,
        item: `${baseUrl}/release/${release.version}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Container className="max-w-4xl py-10 sm:py-16">
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>All Updates</span>
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span>Releases</span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="font-mono font-medium text-foreground">
            {release.version}
          </span>
        </nav>

        <header className="space-y-6 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-primary px-3 py-1 font-mono text-xs font-semibold text-primary-foreground shadow-xs">
                {release.version}
              </span>

              {!adjacent.newer && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Latest Release
                </span>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{release.releaseDate}</span>
              </div>
            </div>

            <ReleaseActionBar
              version={release.version}
              commitSha={release.commitSha}
              title={release.title}
            />
          </div>

          <div className="space-y-3 border-t border-border/60 pt-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              {release.title}
            </h1>
            {release.summary && (
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {release.summary}
              </p>
            )}
          </div>

          {release.scope && release.scope.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Layers className="size-3.5" />
                Monorepo Scopes:
              </span>
              {release.scope.map((sc) => (
                <span
                  key={sc}
                  className="rounded-lg border border-border/70 bg-muted/30 px-2.5 py-0.5 font-mono text-xs text-foreground/80"
                >
                  {sc}
                </span>
              ))}
            </div>
          )}

          {release.metrics && release.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-3">
              {release.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-border/60 bg-background/60 p-3.5"
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Gauge className="size-3.5 text-primary" />
                    <span>{metric.label}</span>
                  </div>
                  <div className="mt-1.5 font-mono text-base font-semibold text-foreground">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>

        <main className="mt-10 space-y-10">
          {orderedCategories.map((categoryKey) => {
            const config = categoryConfig[categoryKey] || {
              label: categoryKey,
              icon: Tag,
              className: "text-muted-foreground bg-muted border-border/50",
            }
            const Icon = config.icon
            const items = itemsByCategory[categoryKey] ?? []

            return (
              <section
                key={categoryKey}
                className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur-xs sm:p-8"
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg border",
                        config.className
                      )}
                    >
                      <Icon className="size-3.5" />
                    </div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {config.label}
                    </h2>
                  </div>
                  <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted/40"
                    >
                      <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                          {item.description}
                        </p>
                        {item.scope && (
                          <span className="inline-block rounded-md border border-border/50 bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {item.scope}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </main>

        <footer className="mt-12 border-t border-border/80 pt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {adjacent.older ? (
              <Link
                href={`/release/${adjacent.older.version}`}
                className="group flex flex-col rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:border-foreground/30 hover:bg-card"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Previous Release</span>
                </div>
                <div className="mt-2 font-mono text-sm font-semibold text-foreground">
                  {adjacent.older.version}
                </div>
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {adjacent.older.title}
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/50 p-4 text-center text-xs text-muted-foreground">
                First monorepo release
              </div>
            )}

            {adjacent.newer ? (
              <Link
                href={`/release/${adjacent.newer.version}`}
                className="group flex flex-col items-end rounded-2xl border border-border/80 bg-card/60 p-4 text-right transition-all hover:border-foreground/30 hover:bg-card"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Next Release</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="mt-2 font-mono text-sm font-semibold text-foreground">
                  {adjacent.newer.version}
                </div>
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {adjacent.newer.title}
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/50 p-4 text-center text-xs text-muted-foreground">
                Latest stable release
              </div>
            )}
          </div>
        </footer>
      </Container>
    </>
  )
}
