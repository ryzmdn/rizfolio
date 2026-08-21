"use client"

import React, { useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X, Layers } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { CategoryWithCount } from "@/lib/queries"

interface FilterSectionProps {
  categories: CategoryWithCount[]
  activeCategory?: string
  searchQuery?: string
  totalPosts: number
}

export function FilterSection({
  categories,
  activeCategory = "all",
  searchQuery = "",
  totalPosts,
}: FilterSectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = React.useState(searchQuery)

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    params.delete("page")
    return params.toString()
  }

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      const queryString = createQueryString("category", slug)
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleSearchSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    startTransition(() => {
      const queryString = createQueryString("q", query.trim())
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  const handleClearSearch = () => {
    setQuery("")
    startTransition(() => {
      const queryString = createQueryString("q", "")
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => handleCategorySelect("all")}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              activeCategory === "all" || !activeCategory
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Layers className="size-3.5" />
            <span>All Posts</span>
            <span className="text-[10px] opacity-70">({totalPosts})</span>
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.count})</span>
              </button>
            )
          })}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="relative flex max-w-sm min-w-64 items-center"
        >
          <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-lg border border-border bg-card/60 py-1.5 pr-8 pl-9 text-xs transition-all placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 cursor-pointer p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </form>
      </div>

      {isPending && (
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-primary/20">
          <div className="h-full w-1/3 animate-pulse bg-primary" />
        </div>
      )}
    </div>
  )
}
