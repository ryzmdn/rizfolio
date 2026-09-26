"use client"

import { useState, useEffect } from "react"
import {
  Search,
  X,
  Sparkles,
  Zap,
  Wrench,
  AlertCircle,
  Layers,
  RotateCcw,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface FilterState {
  query: string
  category: string
  scope: string
}

interface FilterBarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  matchedCount: number
  totalCount: number
}

const categories = [
  { id: "ALL", label: "All Types" },
  { id: "FEATURE", label: "Features", icon: Sparkles, dotColor: "bg-emerald-500" },
  { id: "IMPROVEMENT", label: "Improvements", icon: Zap, dotColor: "bg-blue-500" },
  { id: "FIX", label: "Fixes", icon: Wrench, dotColor: "bg-amber-500" },
  { id: "BREAKING", label: "Breaking", icon: AlertCircle, dotColor: "bg-rose-500" },
]

const scopes = [
  { id: "ALL", label: "All Scopes" },
  { id: "apps/shop", label: "apps/shop" },
  { id: "apps/docs", label: "apps/docs" },
  { id: "apps/blog", label: "apps/blog" },
  { id: "apps/portfolio", label: "apps/portfolio" },
  { id: "apps/cms", label: "apps/cms" },
  { id: "packages/ui", label: "packages/ui" },
]

export function FilterBar({
  filters,
  onFilterChange,
  matchedCount,
  totalCount,
}: FilterBarProps) {
  const [prevQuery, setPrevQuery] = useState(filters.query)
  const [localQuery, setLocalQuery] = useState(filters.query)

  if (filters.query !== prevQuery) {
    setPrevQuery(filters.query)
    setLocalQuery(filters.query)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== filters.query) {
        onFilterChange({ ...filters, query: localQuery })
      }
    }, 250)

    return () => clearTimeout(handler)
  }, [localQuery, filters, onFilterChange])

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    filters.category !== "ALL" ||
    filters.scope !== "ALL"

  function handleReset() {
    setLocalQuery("")
    onFilterChange({
      query: "",
      category: "ALL",
      scope: "ALL",
    })
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs transition-colors sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search changes by title, version, summary, or package..."
            aria-label="Filter releases by query"
            className="w-full rounded-xl border border-border/70 bg-background/80 py-2.5 pr-9 pl-10 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery("")
                onFilterChange({ ...filters, query: "" })
              }}
              aria-label="Clear search query"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
          <div className="font-mono text-xs">
            Showing <span className="font-semibold text-foreground">{matchedCount}</span> of {totalCount} releases
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground focus:outline-hidden"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5 border-t border-border/60 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Type:
          </span>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    category: isSelected && cat.id !== "ALL" ? "ALL" : cat.id,
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/30",
                  isSelected
                    ? "bg-foreground text-background shadow-xs font-semibold"
                    : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                {cat.dotColor && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-transform",
                      cat.dotColor,
                      isSelected ? "scale-125 ring-1 ring-background" : ""
                    )}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Layers className="size-3" />
            Scope:
          </span>
          {scopes.map((sc) => {
            const isSelected = filters.scope === sc.id

            return (
              <button
                key={sc.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    scope: isSelected && sc.id !== "ALL" ? "ALL" : sc.id,
                  })
                }
                className={cn(
                  "rounded-lg px-2.5 py-0.5 font-mono text-[11px] font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-primary/30",
                  isSelected
                    ? "bg-foreground text-background shadow-xs font-semibold"
                    : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                {sc.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
