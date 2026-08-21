import { Container } from "@workspace/ui/components/layouts/container"
import { getChangelogReleases, type ChangelogCategory } from "@/lib/queries"
import {
  History,
  Sparkles,
  Zap,
  Wrench,
  AlertCircle,
  Calendar,
  Tag,
  GitCommit,
} from "lucide-react"

export const revalidate = 60

function getCategoryBadge(category: ChangelogCategory | string) {
  switch (category.toUpperCase()) {
    case "FEATURE":
      return {
        label: "Feature",
        className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: <Sparkles className="size-3 shrink-0" />,
      }
    case "IMPROVEMENT":
      return {
        label: "Improvement",
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: <Zap className="size-3 shrink-0" />,
      }
    case "FIX":
      return {
        label: "Bug Fix",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: <Wrench className="size-3 shrink-0" />,
      }
    case "BREAKING":
      return {
        label: "Breaking",
        className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
        icon: <AlertCircle className="size-3 shrink-0" />,
      }
    default:
      return {
        label: category,
        className: "bg-muted text-muted-foreground border-border/50",
        icon: <Tag className="size-3 shrink-0" />,
      }
  }
}

export default async function ChangelogPage() {
  const releases = await getChangelogReleases()

  return (
    <Container className="py-20 max-w-4xl">
      <div className="max-w-2xl space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <History className="size-3.5 text-primary" />
          <span>Release Notes & Dev Log</span>
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Changelog
        </h1>
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          A continuous timeline of architectural milestones, feature additions, performance tunings, and version releases across the monorepo ecosystem.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-10 space-y-16">
        <div className="absolute left-[9px] sm:left-[17px] top-3 bottom-3 w-px bg-border/80" />

        {releases.map((release, releaseIdx) => {
          const isLatest = releaseIdx === 0

          return (
            <section key={release.id} className="relative group">
              <div className="absolute -left-6 sm:-left-10 top-1.5 flex size-5 sm:size-9 items-center justify-center rounded-full bg-background border border-border/80 shadow-xs group-hover:border-primary/60 transition-colors">
                <GitCommit className="size-3 sm:size-4 text-primary" />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-primary text-primary-foreground shadow-xs">
                    {release.version}
                  </span>

                  {isLatest && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Latest Release
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>{release.releaseDate}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
                  {release.title}
                </h2>

                {release.summary && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {release.summary}
                  </p>
                )}
              </div>

              {release.items && release.items.length > 0 && (
                <div className="mt-6 space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xs">
                  <ul className="space-y-3 text-xs sm:text-sm">
                    {release.items.map((item) => {
                      const badge = getCategoryBadge(item.category)

                      return (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 leading-relaxed"
                        >
                          <span
                            className={`inline-flex items-center gap-1 shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium mt-0.5 ${badge.className}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-foreground/90">
                            {item.description}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </section>
          )
        })}
      </div>
    </Container>
  )
}
