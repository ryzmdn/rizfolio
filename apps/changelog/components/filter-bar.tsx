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
  { id: "FEATURE", label: "Features", icon: Sparkles, color: "text-emerald-500" },
  { id: "IMPROVEMENT", label: "Improvements", icon: Zap, color: "text-blue-500" },
  { id: "FIX", label: "Fixes", icon: Wrench, color: "text-amber-500" },
  { id: "BREAKING", label: "Breaking", icon: AlertCircle, color: "text-rose-500" },
]

const scopes = [
  { id: "ALL", label: "All Scopes" },
  { id: "apps/shop", label: "Shop" },
  { id: "apps/docs", label: "Docs" },
  { id: "apps/blog", label: "Blog" },
  { id: "apps/portfolio", label: "Portfolio" },
  { id: "apps/cms", label: "CMS" },
  { id: "packages/ui", label: "UI System" },
]

export function FilterBar({
  filters,
  onFilterChange,
  matchedCount,
  totalCount,
}: FilterBarProps) {
  const [prevQuery, setPrevQuery] = useState(filters.query)
  const [localQuery, setLocalQuery] = useState(filters.query)

  if (prevQuery !== filters.query) {
    setPrevQuery(filters.query)
    setLocalQuery(filters.query)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== filters.query) {
        onFilterChange({ ...filters, query: localQuery })
      }
    }, 300)

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
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Filter changes by keyword, version, or scope..."
            className="w-full rounded-xl border border-border/70 bg-background/70 py-2 pr-9 pl-10 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/30 focus:outline-hidden sm:text-sm"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery("")
                onFilterChange({ ...filters, query: "" })
              }}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
          <div className="font-mono">
            Showing <span className="font-semibold text-foreground">{matchedCount}</span> of {totalCount} releases
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/60 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-medium text-muted-foreground">
            Type:
          </span>
          {categories.map((cat) => {
            const Icon = cat.icon
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
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "size-3",
                      isSelected ? "text-primary-foreground" : cat.color
                    )}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
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
                  "rounded-lg px-2 py-0.5 font-mono text-[11px] font-medium transition-colors",
                  isSelected
                    ? "bg-foreground text-background shadow-xs"
                    : "border border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
