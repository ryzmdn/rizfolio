"use client"

import { useState, useMemo } from "react"
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  Box,
  Tag,
  SearchX,
  RotateCcw,
} from "lucide-react"
import { FilterBar, type FilterState } from "./filter-bar"
import { ReleaseCard } from "./release-card"
import { TimelineNav } from "./timeline-nav"
import type { ChangelogReleaseData } from "../data"

interface TimelineStats {
  totalReleases: number
  shippedMilestones: number
  appsCount: number
  currentVersion: string
}

interface TimelineExplorerProps {
  initialReleases: ChangelogReleaseData[]
  stats: TimelineStats
}

export function TimelineExplorer({
  initialReleases,
  stats,
}: TimelineExplorerProps) {
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category: "ALL",
    scope: "ALL",
  })

  const filteredReleases = useMemo(() => {
    let result = [...initialReleases]

    if (filters.category !== "ALL") {
      const targetCat = filters.category.toUpperCase()
      result = result
        .map((rel) => ({
          ...rel,
          items: rel.items.filter(
            (item) => item.category.toUpperCase() === targetCat
          ),
        }))
        .filter((rel) => rel.items.length > 0)
    }

    if (filters.scope !== "ALL") {
      const targetScope = filters.scope.toLowerCase()
      result = result.filter(
        (rel) =>
          rel.scope.some((s) => s.toLowerCase().includes(targetScope)) ||
          rel.items.some(
            (item) =>
              item.scope && item.scope.toLowerCase().includes(targetScope)
          )
      )
    }

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim()
      result = result.filter(
        (rel) =>
          rel.version.toLowerCase().includes(q) ||
          rel.title.toLowerCase().includes(q) ||
          (rel.summary && rel.summary.toLowerCase().includes(q)) ||
          rel.items.some((item) => item.description.toLowerCase().includes(q))
      )
    }

    return result
  }, [initialReleases, filters])

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    filters.category !== "ALL" ||
    filters.scope !== "ALL"

  function handleResetFilters() {
    setFilters({
      query: "",
      category: "ALL",
      scope: "ALL",
    })
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <header className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase backdrop-blur-md">
          <GitBranch className="size-3.5 text-foreground" />
          <span>[ VOLUME 07 // SYSTEM LOGS & ARCHITECTURAL EVOLUTION ]</span>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            System Logs{" "}
            <span className="font-sans text-muted-foreground/80 italic">&</span>{" "}
            Architectural Evolution
          </h1>
          <p className="font-sans text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
            Kronologi terbuka mencatat evolusi arsitektur sistem, delivery fitur
            baru, benchmark performa, dan pembaruan infrastruktur di seluruh
            ekosistem monorepo Rizfolio.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase">
              <GitCommit className="size-3.5 text-foreground" />
              <span>Total Releases</span>
            </div>
            <div className="mt-3 font-serif text-2xl font-light text-foreground tabular-nums sm:text-3xl">
              {stats.totalReleases}
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              Semantic releases
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase">
              <CheckCircle2 className="size-3.5 text-foreground" />
              <span>Milestones</span>
            </div>
            <div className="mt-3 font-serif text-2xl font-light text-foreground tabular-nums sm:text-3xl">
              {stats.shippedMilestones}
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              Shipped enhancements
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase">
              <Box className="size-3.5 text-foreground" />
              <span>Packages</span>
            </div>
            <div className="mt-3 font-serif text-2xl font-light text-foreground tabular-nums sm:text-3xl">
              {stats.appsCount}
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              Monorepo packages
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase">
              <Tag className="size-3.5 text-foreground" />
              <span>Active Version</span>
            </div>
            <div className="mt-3 font-serif text-2xl font-light text-foreground tabular-nums sm:text-3xl">
              {stats.currentVersion}
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">
              Production deployment
            </div>
          </div>
        </div>
      </header>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        matchedCount={filteredReleases.length}
        totalCount={initialReleases.length}
      />

      <div className="relative flex items-start gap-8">
        <div className="min-w-0 flex-1">
          {filteredReleases.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-foreground/15 bg-card/30 p-16 text-center">
              <SearchX className="mx-auto size-8 text-muted-foreground" />
              <h3 className="mt-3 font-serif text-lg font-light text-foreground">
                No matching releases found
              </h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                No release updates or items matched your active search or filter
                criteria.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-foreground bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-all hover:bg-foreground/90"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="relative space-y-10 pl-6 sm:pl-8">
              <div className="absolute top-6 bottom-6 left-[11px] w-px bg-foreground/10 sm:left-[15px]" />

              {filteredReleases.map((release, idx) => (
                <div key={release.id} className="relative">
                  <div className="absolute top-8 -left-6 flex size-4 items-center justify-center rounded-full border-2 border-background bg-foreground shadow-xs sm:-left-8 sm:size-5">
                    <span className="size-1.5 rounded-full bg-background" />
                  </div>
                  <ReleaseCard
                    release={release}
                    isLatest={idx === 0 && !hasActiveFilters}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <TimelineNav releases={initialReleases} />
      </div>
    </div>
  )
}
