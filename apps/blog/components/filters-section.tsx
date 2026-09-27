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
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  const handleClearTag = () => {
    startTransition(() => {
      const queryString = createQueryString({ tag: null })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  const handleSortChange = (newSort: "latest" | "popular") => {
    setSortOpen(false)
    startTransition(() => {
      const queryString = createQueryString({ sort: newSort === "latest" ? null : newSort })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const queryString = createQueryString({ q: query.trim() || null })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  const handleClearSearch = () => {
    setQuery("")
    startTransition(() => {
      const queryString = createQueryString({ q: null })
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })
  }

  const sortLabel = currentSort === "popular" ? "Popular" : "Latest"

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === "all" || !activeCategory
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
            aria-pressed={activeCategory === "all" || !activeCategory}
          >
            <span>All</span>
            <span
              className={cn(
                "text-[10px] tabular-nums",
                activeCategory === "all" || !activeCategory
                  ? "opacity-60"
                  : "opacity-50"
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
                  "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
                aria-pressed={isActive}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    isActive ? "opacity-60" : "opacity-50"
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
              className="inline-flex items-center gap-x-1.5 rounded-md border border-border/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>{sortLabel}</span>
            </button>

            {sortOpen && (
              <div
                role="menu"
                aria-labelledby="sort-button"
                className="absolute right-0 top-full z-10 mt-1.5 w-32 overflow-hidden rounded-md border border-border/70 bg-card shadow-sm"
              >
                {(["latest", "popular"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSortChange(option)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-xs transition-colors",
                      currentSort === option || (!currentSort && option === "latest")
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {option === "latest" ? "Latest first" : "Most viewed"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search articles"
              className="h-8 w-40 rounded-md border border-border/60 bg-background py-1.5 pr-7 pl-8 text-xs placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none sm:w-52"
            />
            {query ? (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-2 hidden select-none rounded border border-border/40 bg-muted px-1 font-mono text-[9px] text-muted-foreground sm:inline">
                /
              </kbd>
            )}
          </form>
        </div>
      </div>

      {(activeTag || searchQuery) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
          <span className="text-muted-foreground/70">Filtered by:</span>
          {activeTag && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-muted-foreground">
              <Tag className="size-3" />
              <span>#{activeTag}</span>
              <button
                type="button"
                onClick={handleClearTag}
                aria-label="Remove tag filter"
                className="hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/60 px-2 py-0.5 text-muted-foreground">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Remove search filter"
                className="hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {isPending && (
        <div aria-hidden="true" className="h-px w-full overflow-hidden rounded-full bg-border/30">
          <div className="h-full w-2/5 animate-pulse bg-foreground/30 rounded-full" />
        </div>
      )}
    </div>
  )
}
