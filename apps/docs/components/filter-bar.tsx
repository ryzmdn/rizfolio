"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, useCallback, useTransition } from "react"
import { Search, X, RotateCcw, ArrowUpDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const CATEGORIES = [
  { value: "ALL", label: "Semua Repos" },
  { value: "ASSIGNMENT", label: "Tugas Kuliah" },
  { value: "EXPERIMENT", label: "Eksperimen" },
  { value: "OPEN_SOURCE", label: "Open Source" },
]

const SORT_OPTIONS = [
  { value: "latest", label: "Terbaru" },
  { value: "stars", label: "Bintang Terbanyak" },
  { value: "downloads", label: "Unduhan Terbanyak" },
  { value: "alphabetical", label: "Nama (A-Z)" },
]

export function FilterBar({
  courses = [],
}: {
  courses?: { name: string; count: number }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentCategory = searchParams.get("category") || "ALL"
  const currentSearch = searchParams.get("search") || ""
  const currentCourse = searchParams.get("course") || ""
  const currentSort = searchParams.get("sort") || "latest"

  // Adjust state during render pattern (React 19 recommended)
  const [prevSearch, setPrevSearch] = useState(currentSearch)
  const [searchValue, setSearchValue] = useState(currentSearch)

  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch)
    setSearchValue(currentSearch)
  }

  const updateQuery = useCallback(
    (params: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(params)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          (key === "sort" && value === "latest")
        ) {
          nextParams.delete(key)
        } else {
          nextParams.set(key, value)
        }
      }
      startTransition(() => {
        const queryString = nextParams.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname)
      })
    },
    [searchParams, pathname, router, startTransition]
  )

  // Debounce search input update
  useEffect(() => {
    if (searchValue === currentSearch) return

    const timer = setTimeout(() => {
      updateQuery({ search: searchValue.trim() || null })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, currentSearch, updateQuery])

  const hasActiveFilters =
    Boolean(currentSearch) ||
    currentCategory !== "ALL" ||
    Boolean(currentCourse) ||
    currentSort !== "latest"

  function handleResetAll() {
    setSearchValue("")
    startTransition(() => {
      router.push(pathname)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={searchValue}
            placeholder="SEARCH BLUEPRINTS, TOPICS, OR MODULES..."
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-full border border-foreground/10 bg-foreground/3 py-2 pr-9 pl-9 font-mono text-xs text-foreground uppercase placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-hidden"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
          {courses.length > 0 && (
            <div className="relative">
              <select
                value={currentCourse}
                onChange={(e) =>
                  updateQuery({ course: e.target.value || null })
                }
                aria-label="Filter by coursework curriculum"
                className="cursor-pointer appearance-none rounded-full border border-foreground/10 bg-foreground/3 py-2 pr-8 pl-4 text-xs text-foreground transition-colors focus:border-foreground/30 focus:outline-hidden"
              >
                <option value="">All Academic Topics</option>
                {courses.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.count})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative flex items-center">
            <select
              value={currentSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              aria-label="Sort repositories"
              className="cursor-pointer appearance-none rounded-full border border-foreground/10 bg-foreground/3 py-2 pr-8 pl-4 text-xs text-foreground transition-colors focus:border-foreground/30 focus:outline-hidden"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-3 size-3 text-muted-foreground" />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-xs tracking-wider text-muted-foreground uppercase transition-all hover:border-foreground/30 hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-foreground/8 pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => updateQuery({ category: cat.value })}
              className={cn(
                "rounded-full px-4 py-1.5 font-mono text-xs tracking-wider uppercase transition-all duration-200",
                isActive
                  ? "bg-foreground font-semibold text-background shadow-xs"
                  : "border border-foreground/10 bg-foreground/3 text-muted-foreground hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
