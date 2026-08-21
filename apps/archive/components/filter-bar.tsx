"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import { Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const CATEGORIES = [
  { value: "ALL", label: "All Repos" },
  { value: "ASSIGNMENT", label: "Tugas Kuliah" },
  { value: "EXPERIMENT", label: "Eksperimen" },
  { value: "OPEN_SOURCE", label: "Open Source" },
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

  function updateQuery(params: Record<string, string | null>) {
    const nextParams = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === "" || value === "ALL") {
        nextParams.delete(key)
      } else {
        nextParams.set(key, value)
      }
    }
    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}`)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            defaultValue={currentSearch}
            placeholder="Cari repositori, topik, atau mata kuliah..."
            onChange={(e) => updateQuery({ search: e.target.value || null })}
            className="w-full rounded-lg border border-border bg-background py-2 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
          />
        </div>

        {courses.length > 0 && (
          <select
            value={currentCourse}
            onChange={(e) => updateQuery({ course: e.target.value || null })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-foreground/40 focus:outline-none"
          >
            <option value="">Semua Mata Kuliah</option>
            {courses.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        )}
      </div>

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
