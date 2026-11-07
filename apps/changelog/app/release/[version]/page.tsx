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
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

export const revalidate = 3600

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

  const baseUrl = getBaseUrl("changelog")
  const releaseUrl = `${baseUrl}/release/${release.version}`
  const title = `${release.title} (v${release.version})`
  const description =
    release.summary ||
    `Detailed release notes and architecture changes for version ${release.version}.`

  return {
    title: `${title} | ${SEO_CONFIG.sites.changelog.name}`,
    description,
    alternates: {
      canonical: releaseUrl,
    },
    openGraph: {
      type: "article",
      title: `${release.title} (${release.version}): Rizfolio Changelog`,
      description,
      url: releaseUrl,
      publishedTime: release.createdAt,
      siteName: SEO_CONFIG.sites.changelog.name,
      images: [
        {
          url: SEO_CONFIG.author.avatar,
          width: 800,
          height: 800,
          alt: release.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${release.title} (${release.version}): Rizfolio Changelog`,
      description,
      images: [SEO_CONFIG.author.avatar],
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
    className: "text-foreground bg-foreground/5 border-foreground/15",
  },
  IMPROVEMENT: {
    label: "Improvements & Optimizations",
    icon: Zap,
    className: "text-foreground bg-foreground/5 border-foreground/15",
  },
  FIX: {
    label: "Bug Fixes & Patches",
    icon: Wrench,
    className: "text-foreground bg-foreground/5 border-foreground/15",
  },
  BREAKING: {
    label: "Breaking Changes",
    icon: AlertCircle,
    className: "text-destructive bg-destructive/10 border-destructive/20",
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

  const orderedCategories = [
    "FEATURE",
    "IMPROVEMENT",
    "FIX",
    "BREAKING",
  ].filter((cat) => itemsByCategory[cat] && itemsByCategory[cat].length > 0)

  const baseUrl = getBaseUrl("changelog")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rizfolio",
    softwareVersion: release.version,
    datePublished: release.createdAt,
    releaseNotes: release.summary || release.title,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
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

      <Container className="max-w-4xl space-y-12 py-10 sm:py-16">
        <div>
          <nav
            aria-label="Breadcrumbs"
            className="inline-flex flex-wrap items-center gap-2 rounded-full border border-foreground/10 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-xs"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Logs</span>
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span>Releases</span>
            <ChevronRight className="size-3 text-muted-foreground/40" />
            <span className="font-semibold text-foreground">
              {release.version}
            </span>
          </nav>
        </div>

        <header className="space-y-8 rounded-3xl border border-foreground/8 bg-card/40 p-6 md:p-10 backdrop-blur-xl shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-foreground px-4 py-1 font-mono text-xs font-semibold text-background shadow-xs">
                {release.version}
              </span>

              {!adjacent.newer && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Latest Production
                </span>
              )}

              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                <time dateTime={release.createdAt}>{release.releaseDate}</time>
              </div>
            </div>

            <ReleaseActionBar
              version={release.version}
              commitSha={release.commitSha}
              title={release.title}
            />
          </div>

          <div className="space-y-4 border-t border-foreground/8 pt-8">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
              {release.title}
            </h1>
            {release.summary && (
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {release.summary}
              </p>
            )}
          </div>

          {release.scope && release.scope.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <Layers className="size-3.5" />
                Impacted Packages:
              </span>
              {release.scope.map((sc) => (
                <span
                  key={sc}
                  className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-0.5 font-mono text-xs text-foreground/80"
                >
                  {sc}
                </span>
              ))}
            </div>
          )}

          {release.metrics && release.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 border-t border-foreground/8 pt-6 sm:grid-cols-3">
              {release.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-4"
                >
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <Gauge className="size-3.5 text-muted-foreground" />
                    <span>{metric.label}</span>
                  </div>
                  <div className="mt-2 font-mono text-lg font-semibold text-foreground">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>

        <main className="space-y-8">
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
                className="space-y-6 rounded-3xl border border-foreground/8 bg-card/40 p-6 md:p-8 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-foreground/8 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-xl border",
                        config.className
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <h2 className="font-serif text-lg font-medium tracking-tight text-foreground sm:text-xl">
                      {config.label}
                    </h2>
                  </div>

                  <span className="rounded-full border border-foreground/10 bg-card/60 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-foreground/[0.02]"
                    >
                      <div className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-xs md:text-sm leading-relaxed text-foreground">
                          {item.description}
                        </p>
                        {item.scope && (
                          <span className="inline-block rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
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

        <footer className="border-t border-foreground/8 pt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {adjacent.older ? (
              <Link
                href={`/release/${adjacent.older.version}`}
                className="group flex flex-col rounded-3xl border border-foreground/8 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-foreground/20 hover:bg-card/70"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>PREVIOUS RELEASE</span>
                </div>
                <div className="mt-3 font-mono text-base font-semibold text-foreground">
                  {adjacent.older.version}
                </div>
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {adjacent.older.title}
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/10 p-6 text-center font-mono text-xs text-muted-foreground">
                [ INITIAL MONOREPO RELEASE ]
              </div>
            )}

            {adjacent.newer ? (
              <Link
                href={`/release/${adjacent.newer.version}`}
                className="group flex flex-col items-end rounded-3xl border border-foreground/8 bg-card/40 p-6 text-right backdrop-blur-xl transition-all hover:border-foreground/20 hover:bg-card/70"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span>NEXT RELEASE</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <div className="mt-3 font-mono text-base font-semibold text-foreground">
                  {adjacent.newer.version}
                </div>
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {adjacent.newer.title}
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/10 p-6 text-center font-mono text-xs text-muted-foreground">
                [ LATEST PRODUCTION RELEASE ]
              </div>
            )}
          </div>
        </footer>
      </Container>
    </>
  )
}
