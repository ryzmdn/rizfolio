"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useTransition, useId, useCallback } from "react"
import {
  Search,
  X,
  Layers,
  Sparkles,
  Download,
  Code2,
  Cpu,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface FilterBarProps {
  totalCount: number
}

const CATEGORIES = [
  { id: "all", label: "All Items", icon: Layers },
  { id: "STARTER_KIT", label: "Starter Kits", icon: Code2 },
  { id: "UI_SYSTEM", label: "UI Systems", icon: Sparkles },
  { id: "BACKEND", label: "Backend & Cloud", icon: Cpu },
  { id: "CONSULTATION", label: "Consultation", icon: Download },
]

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "rating", label: "Top Rated" },
  { id: "newest", label: "Newest" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
]

export function FilterBar({ totalCount }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchInputId = useId()
  const sortSelectId = useId()

  const [isPending, startTransition] = useTransition()

  const currentCategory = searchParams.get("category") || "all"
  const currentSort = searchParams.get("sortBy") || "featured"
  const currentQuery = searchParams.get("q") || ""
  const currentType = searchParams.get("type") || ""

  const [prevQuery, setPrevQuery] = useState(currentQuery)
  const [searchInput, setSearchInput] = useState(currentQuery)

  if (prevQuery !== currentQuery) {
    setPrevQuery(currentQuery)
    setSearchInput(currentQuery)
  }

  const updateParams = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(newParams)) {
        if (value === null || value === "" || value === "all") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [searchParams, pathname, router]
  )

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== currentQuery) {
        updateParams({ q: searchInput.trim() || null })
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [searchInput, currentQuery, updateParams])

  function handleResetAll() {
    setSearchInput("")
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }

  const hasActiveFilters =
    currentCategory !== "all" ||
    currentSort !== "featured" ||
    Boolean(currentQuery) ||
    Boolean(currentType)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Search products and architectures
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id={searchInputId}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by keywords, architecture, or tech stack..."
            className="w-full rounded-xl border border-border/80 bg-background/80 py-2 pr-9 pl-9 text-xs transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-1 focus:ring-primary/40 focus:outline-hidden"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("")
                updateParams({ q: null })
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-mono font-medium text-foreground">
              {totalCount}
            </span>
            <span>{totalCount === 1 ? "item" : "items"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <label htmlFor={sortSelectId} className="sr-only">
              Sort by
            </label>
            <div className="relative inline-flex items-center">
              <ArrowUpDown className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
              <select
                id={sortSelectId}
                value={currentSort}
                onChange={(e) => updateParams({ sortBy: e.target.value })}
                className="cursor-pointer appearance-none rounded-xl border border-border/80 bg-background/80 py-2 pr-8 pl-8 text-xs font-medium text-foreground transition-colors hover:bg-muted/50 focus:border-primary/60 focus:outline-hidden"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
        <div className="flex items-center gap-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = currentCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateParams({ category: cat.id })}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground">
            Active Filters:
          </span>

          {currentQuery && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-muted/60 px-2 py-0.5 text-[11px] text-foreground">
              <span>Query: &quot;{currentQuery}&quot;</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("")
                  updateParams({ q: null })
                }}
                className="hover:text-rose-500"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {currentCategory !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-muted/60 px-2 py-0.5 text-[11px] text-foreground">
              <span>
                Category:{" "}
                {CATEGORIES.find((c) => c.id === currentCategory)?.label ||
                  currentCategory}
              </span>
              <button
                type="button"
                onClick={() => updateParams({ category: null })}
                className="hover:text-rose-500"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {currentSort !== "featured" && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-muted/60 px-2 py-0.5 text-[11px] text-foreground">
              <span>
                Sort:{" "}
                {SORT_OPTIONS.find((s) => s.id === currentSort)?.label ||
                  currentSort}
              </span>
              <button
                type="button"
                onClick={() => updateParams({ sortBy: null })}
                className="hover:text-rose-500"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {isPending && (
            <span className="text-[11px] text-muted-foreground animate-pulse">
              Filtering...
            </span>
          )}
        </div>
      )}
    </div>
  )
}
