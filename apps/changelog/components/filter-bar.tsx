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
  {
    id: "FEATURE",
    label: "Features",
    icon: Sparkles,
  },
  {
    id: "IMPROVEMENT",
    label: "Improvements",
    icon: Zap,
  },
  { id: "FIX", label: "Fixes", icon: Wrench },
  {
    id: "BREAKING",
    label: "Breaking",
    icon: AlertCircle,
  },
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
    <div className="space-y-5 rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl transition-colors sm:p-6">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search changes by title, version, summary, or package..."
            aria-label="Filter releases by query"
            className="w-full rounded-full border border-foreground/10 bg-background/60 py-2.5 pr-10 pl-10 font-mono text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-hidden"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery("")
                onFilterChange({ ...filters, query: "" })
              }}
              aria-label="Clear search query"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
          <div className="font-mono text-xs">
            Showing{" "}
            <span className="font-medium text-foreground">{matchedCount}</span>{" "}
            of {totalCount} releases
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-all hover:bg-foreground hover:text-background"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-foreground/8 pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            Type:
          </span>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    category: isSelected && cat.id !== "ALL" ? "ALL" : cat.id,
                  })
                }
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs transition-all",
                  isSelected
                    ? "bg-foreground font-medium text-background shadow-xs"
                    : "border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                {cat.icon && <cat.icon className="size-3" />}
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="mr-1.5 flex items-center gap-1 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            <Layers className="size-3" />
            Scope:
          </span>
          {scopes.map((sc) => {
            const isSelected = filters.scope === sc.id

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    scope: isSelected && sc.id !== "ALL" ? "ALL" : sc.id,
                  })
                }
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-all",
                  isSelected
                    ? "bg-foreground font-medium text-background shadow-xs"
                    : "border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
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
