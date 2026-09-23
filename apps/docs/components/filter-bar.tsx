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
      {/* Top Controls: Search Input, Course Selector, and Sort Dropdown */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input with debounce */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchValue}
            placeholder="Cari repositori, topik, atau mata kuliah..."
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pr-9 pl-9 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/40 focus:outline-hidden"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Course and Sort Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {courses.length > 0 && (
            <div className="relative">
              <select
                value={currentCourse}
                onChange={(e) =>
                  updateQuery({ course: e.target.value || null })
                }
                aria-label="Filter berdasarkan mata kuliah"
                className="cursor-pointer appearance-none rounded-xl border border-border bg-background py-2 pr-8 pl-3 text-xs text-foreground transition-colors focus:border-foreground/40 focus:outline-hidden"
              >
                <option value="">Semua Mata Kuliah</option>
                {courses.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.count})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <select
              value={currentSort}
              onChange={(e) => updateQuery({ sort: e.target.value })}
              aria-label="Urutkan repositori"
              className="cursor-pointer appearance-none rounded-xl border border-border bg-background py-2 pr-8 pl-3 text-xs text-foreground transition-colors focus:border-foreground/40 focus:outline-hidden"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/30 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/40 pb-3">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => updateQuery({ category: cat.value })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
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
