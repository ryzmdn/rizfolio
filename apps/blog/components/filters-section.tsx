"use client"

import React, { useTransition, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X, Tag, SlidersHorizontal } from "lucide-react"
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
  const [query, setQuery] = useState(searchQuery)
  const [sortOpen, setSortOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

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
    params.delete("page")
    return params.toString()
  }

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      const queryString = createQueryString({ category: slug })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    })
  }

  const handleClearTag = () => {
    startTransition(() => {
      const queryString = createQueryString({ tag: null })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    })
  }

  const handleSortChange = (newSort: "latest" | "popular") => {
    startTransition(() => {
      const queryString = createQueryString({
        sort: newSort === "latest" ? null : newSort,
      })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    })
    setTimeout(() => {
      setSortOpen(false)
    }, 50)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const queryString = createQueryString({ q: query.trim() || null })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    })
  }

  const handleClearSearch = () => {
    setQuery("")
    startTransition(() => {
      const queryString = createQueryString({ q: null })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      })
    })
  }

  const sortLabel = currentSort === "popular" ? "Popular" : "Latest"

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="scrollbar-none flex flex-1 items-center gap-1.5 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200",
              activeCategory === "all" || !activeCategory
                ? "bg-foreground font-semibold text-background shadow-xs"
                : "border border-foreground/10 bg-foreground/3 text-muted-foreground hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
            )}
            aria-pressed={activeCategory === "all" || !activeCategory}
          >
            <span>All</span>
            <span
              className={cn(
                "font-mono text-[10px]",
                activeCategory === "all" || !activeCategory
                  ? "opacity-60"
                  : "opacity-40"
              )}
            >
              {totalPosts}
            </span>
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200",
                  isActive
                    ? "bg-foreground font-semibold text-background shadow-xs"
                    : "border border-foreground/10 bg-foreground/3 text-muted-foreground hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
                )}
                aria-pressed={isActive}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    isActive ? "opacity-60" : "opacity-40"
                  )}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              id="sort-button"
              aria-haspopup="true"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:text-foreground"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>{sortLabel}</span>
            </button>

            {sortOpen && (
              <div
                role="menu"
                aria-labelledby="sort-button"
                className="absolute top-full right-0 z-20 mt-2 w-36 overflow-hidden rounded-2xl border border-foreground/10 bg-card/95 p-1 shadow-xl backdrop-blur-xl"
              >
                {(["latest", "popular"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSortChange(option)}
                    className={cn(
                      "w-full rounded-xl px-3 py-2 text-left font-mono text-xs uppercase tracking-wider transition-colors",
                      currentSort === option ||
                        (!currentSort && option === "latest")
                        ? "bg-foreground font-semibold text-background"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    )}
                  >
                    {option === "latest" ? "Latest" : "Most Viewed"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground/60" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH ESSAYS..."
              aria-label="Search articles"
              className="h-8.5 w-36 rounded-full border border-foreground/10 bg-foreground/3 py-1.5 pr-8 pl-8.5 font-mono text-xs uppercase placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-hidden sm:w-48"
            />
            {query ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2.5 hidden rounded-full border border-foreground/10 bg-background/80 px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground select-none sm:inline">
                /
              </kbd>
            )}
          </form>
        </div>
      </div>

      {(activeTag || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground/60">Filtered by:</span>
          {activeTag && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-0.5 text-foreground">
              <Tag className="size-3 text-muted-foreground" />
              <span>#{activeTag}</span>
              <button
                type="button"
                onClick={handleClearTag}
                aria-label="Remove tag filter"
                className="ml-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-0.5 text-foreground">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Remove search filter"
                className="ml-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {isPending && (
        <div
          aria-hidden="true"
          className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/5"
        >
          <div className="h-full w-2/5 animate-pulse rounded-full bg-foreground/40" />
        </div>
      )}
    </div>
  )
}
