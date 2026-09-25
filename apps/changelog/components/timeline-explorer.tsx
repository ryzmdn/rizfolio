"use client"

import { useState, useMemo } from "react"
import {
  History,
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
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xs">
          <History className="size-3.5 text-primary" />
          <span>Continuous Architecture & Dev Log</span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Changelog & Releases
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            An open timeline tracking architectural milestones, new product
            capabilities, performance optimizations, and infrastructure upgrades
            across the monorepo digital ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <GitCommit className="size-3.5 text-primary" />
              <span>Total Releases</span>
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {stats.totalReleases}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Semantic releases
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Milestones</span>
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {stats.shippedMilestones}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Shipped enhancements
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Box className="size-3.5 text-blue-500" />
              <span>Apps Maintained</span>
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {stats.appsCount}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Monorepo packages
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Tag className="size-3.5 text-amber-500" />
              <span>Current Version</span>
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {stats.currentVersion}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Active production release
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        matchedCount={filteredReleases.length}
        totalCount={initialReleases.length}
      />

      <div className="relative flex items-start gap-8">
        <div className="min-w-0 flex-1">
          {filteredReleases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/30 p-12 text-center">
              <SearchX className="mx-auto size-8 text-muted-foreground" />
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                No matching releases found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                No release updates or items matched your active search or filter
                criteria.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="relative space-y-8 pl-6 sm:pl-8">
              <div className="absolute top-4 bottom-4 left-[9px] w-px bg-border/80 sm:left-[11px]" />

              {filteredReleases.map((release, idx) => (
                <div key={release.id} className="relative">
                  <div className="absolute top-8 -left-6 flex size-4 items-center justify-center rounded-full border-2 border-background bg-primary shadow-xs sm:-left-8 sm:size-5">
                    <span className="size-1.5 rounded-full bg-primary-foreground" />
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
