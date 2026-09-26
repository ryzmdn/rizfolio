"use client"

import React, { useTransition, useEffect, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X, Layers, SlidersHorizontal, Sparkles, Tag } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { CategoryWithCount } from "@/lib/queries"

interface FilterSectionProps {
  categories: CategoryWithCount[]
  activeCategory?: string
  activeTag?: string
  searchQuery?: string
  currentSort?: string
  totalPosts: number
}

export function FilterSection({
  categories,
  activeCategory = "all",
  activeTag = "",
  searchQuery = "",
  currentSort = "latest",
  totalPosts,
}: FilterSectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = React.useState(searchQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Sync query input with prop updates
  useEffect(() => {
    setQuery(searchQuery)
  }, [searchQuery])

  // Global keyboard shortcut ('/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const createQueryString = (paramsToUpdate: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(paramsToUpdate)) {
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }

    params.delete("page") // Always reset to page 1 on filter changes
    return params.toString()
  }

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      const queryString = createQueryString({ category: slug })
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleClearTag = () => {
    startTransition(() => {
      const queryString = createQueryString({ tag: null })
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleSortChange = (newSort: "latest" | "popular") => {
    startTransition(() => {
      const queryString = createQueryString({ sort: newSort === "latest" ? null : newSort })
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const queryString = createQueryString({ q: query.trim() || null })
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleClearSearch = () => {
    setQuery("")
    startTransition(() => {
      const queryString = createQueryString({ q: null })
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
        {/* Category Pills Bar */}
        <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === "all" || !activeCategory
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Layers className="size-3.5" />
            <span>All Articles</span>
            <span className="text-[10px] opacity-70">({totalPosts})</span>
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-foreground text-background shadow-xs font-semibold"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.count})</span>
              </button>
            )
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-border/70 bg-card/40 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => handleSortChange("latest")}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                currentSort === "latest" || !currentSort
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Latest
            </button>
            <button
              type="button"
              onClick={() => handleSortChange("popular")}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                currentSort === "popular"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Popular
            </button>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative flex flex-1 md:w-60 items-center"
          >
            <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles... (Press /)"
              className="w-full rounded-lg border border-border/80 bg-background py-1.5 pr-8 pl-9 text-xs transition-all placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary/50"
            />
            {query ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 cursor-pointer p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2.5 hidden select-none rounded border border-border/60 bg-muted px-1.5 font-mono text-[9px] text-muted-foreground sm:inline-block">
                /
              </kbd>
            )}
          </form>
        </div>
      </div>

      {/* Active Filter Indicators (Tag or Query) */}
      {(activeTag || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground">Active filter:</span>
          {activeTag && (
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary text-[11px]">
              <Tag className="size-3" />
              <span>#{activeTag}</span>
              <button
                type="button"
                onClick={handleClearTag}
                aria-label="Remove tag filter"
                className="cursor-pointer hover:opacity-75"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-muted-foreground text-[11px]">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Remove query filter"
                className="cursor-pointer hover:opacity-75"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading bar for transitions */}
      {isPending && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-primary/20">
          <div className="h-full w-1/3 animate-pulse bg-primary" />
        </div>
      )}
    </div>
  )
}
