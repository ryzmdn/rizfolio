"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  FolderGit2,
  GraduationCap,
  FileCode,
  X,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

interface SearchRepo {
  id: string
  slug: string
  name: string
  description?: string | null
  category: string
  courseName?: string | null
  techStack?: string[] | null
  starsCount?: number
}

interface SearchCourse {
  name: string
  semester?: string
  count: number
}

interface SearchFile {
  id: string
  repoId: string
  path: string
  filename: string
  isDirectory: boolean
  sizeBytes: number
}

interface SearchResultItem {
  id: string
  type: "repo" | "course" | "file"
  title: string
  subtitle?: string
  badge?: string
  href: string
}

export function CommandSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [data, setData] = useState<{
    repos: SearchRepo[]
    courses: SearchCourse[]
    files: SearchFile[]
  }>({
    repos: [],
    courses: [],
    files: [],
  })

  const fetchedRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery("")
    setSelectedIndex(0)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      } else if (e.key === "Escape" && open) {
        e.preventDefault()
        closeSearch()
      }
    }

    function handleCustomOpen() {
      setOpen(true)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("open-docs-search", handleCustomOpen)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("open-docs-search", handleCustomOpen)
    }
  }, [open, closeSearch])

  useEffect(() => {
    if (open && !fetchedRef.current) {
      fetchedRef.current = true
      let active = true

      fetch("/api/search")
        .then((res) => res.json())
        .then((res) => {
          if (active) {
            setData(res)
          }
        })
        .catch((err) => {
          console.error("Failed to load search index:", err)
        })

      return () => {
        active = false
      }
    }
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = "unset"
      }
    }
  }, [open])

  const repoIdToSlugMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of data.repos) {
      map.set(r.id, r.slug)
    }
    return map
  }, [data.repos])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const items: SearchResultItem[] = []

    if (!q) {
      for (const r of data.repos.slice(0, 5)) {
        items.push({
          id: `repo-${r.id}`,
          type: "repo",
          title: r.name,
          subtitle: r.description || undefined,
          badge: r.category,
          href: `/repo/${r.slug}`,
        })
      }
      for (const c of data.courses.slice(0, 3)) {
        items.push({
          id: `course-${c.name}`,
          type: "course",
          title: c.name,
          subtitle: c.semester ? `${c.semester} • ${c.count} repos` : `${c.count} repos`,
          href: `/?course=${encodeURIComponent(c.name)}`,
        })
      }
      return items
    }

    for (const r of data.repos) {
      const matchName = r.name.toLowerCase().includes(q)
      const matchDesc = r.description?.toLowerCase().includes(q)
      const matchSlug = r.slug.toLowerCase().includes(q)
      const matchTech = r.techStack?.some((t) => t.toLowerCase().includes(q))
      const matchCourse = r.courseName?.toLowerCase().includes(q)

      if (matchName || matchDesc || matchSlug || matchTech || matchCourse) {
        items.push({
          id: `repo-${r.id}`,
          type: "repo",
          title: r.name,
          subtitle: r.description || undefined,
          badge: r.category,
          href: `/repo/${r.slug}`,
        })
      }
    }

    for (const c of data.courses) {
      if (
        c.name.toLowerCase().includes(q) ||
        (c.semester && c.semester.toLowerCase().includes(q))
      ) {
        items.push({
          id: `course-${c.name}`,
          type: "course",
          title: c.name,
          subtitle: c.semester ? `${c.semester} • ${c.count} repos` : `${c.count} repos`,
          href: `/?course=${encodeURIComponent(c.name)}`,
        })
      }
    }

    for (const f of data.files) {
      if (!f.isDirectory && f.filename.toLowerCase().includes(q)) {
        const repoSlug = repoIdToSlugMap.get(f.repoId) || "unknown"
        items.push({
          id: `file-${f.id}`,
          type: "file",
          title: f.filename,
          subtitle: `${repoSlug} / ${f.path}`,
          href: `/repo/${repoSlug}/blob/${f.path}`,
        })
      }
    }

    return items.slice(0, 12)
  }, [query, data, repoIdToSlugMap])

  const handleSelect = useCallback(
    (href: string) => {
      closeSearch()
      router.push(href)
    },
    [router, closeSearch]
  )

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex].href)
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={closeSearch}
    >
      <div
        className="relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border/80 px-4 py-3.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search repositories, courses, files, or technologies..."
            className="ml-3 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setSelectedIndex(0)
              }}
              aria-label="Clear query"
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 text-xs divide-y divide-transparent"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="font-medium text-foreground">No matches found</p>
              <p className="mt-1 text-xs">
                No repositories, topics, or code files matched &quot;{query}&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-colors",
                      isSelected
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-lg border",
                          isSelected
                            ? "border-foreground/20 bg-background text-foreground"
                            : "border-border/60 bg-muted/30 text-muted-foreground"
                        )}
                      >
                        {item.type === "repo" && <FolderGit2 className="size-3.5" />}
                        {item.type === "course" && <GraduationCap className="size-3.5" />}
                        {item.type === "file" && <FileCode className="size-3.5" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-foreground">
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-normal shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="truncate text-[11px] text-muted-foreground">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pl-2 text-muted-foreground">
                      {isSelected ? (
                        <CornerDownLeft className="size-3 text-foreground" />
                      ) : (
                        <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/70 bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                ↑
              </kbd>
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                ↵
              </kbd>
              <span>select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[9px]">
                esc
              </kbd>
              <span>close</span>
            </span>
          </div>
          <span className="font-mono text-[10px]">Rizfolio Docs Explorer</span>
        </div>
      </div>
    </div>
  )
}
