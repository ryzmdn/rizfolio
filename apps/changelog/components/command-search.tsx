"use client"

import { useState, useEffect, useCallback, useMemo, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ArrowRight, GitCommit, Milestone } from "lucide-react"
import {
  fallbackChangelogs,
  roadmapItems,
  type ChangelogReleaseData,
  type RoadmapItemData,
} from "../data"
import { cn } from "@workspace/ui/lib/utils"

export function CommandSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [, startTransition] = useTransition()

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setQuery("")
    setSelectedIndex(0)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setQuery("")
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault()
        handleClose()
      }
    }

    function handleCustomOpen() {
      handleOpen()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("open-changelog-search", handleCustomOpen)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("open-changelog-search", handleCustomOpen)
    }
  }, [isOpen, handleClose, handleOpen])

  const q = query.toLowerCase().trim()

  const matchedReleases: ChangelogReleaseData[] = useMemo(() => {
    if (!q) return fallbackChangelogs.slice(0, 4)
    return fallbackChangelogs.filter(
      (rel) =>
        rel.version.toLowerCase().includes(q) ||
        rel.title.toLowerCase().includes(q) ||
        (rel.summary && rel.summary.toLowerCase().includes(q)) ||
        rel.items.some((it) => it.description.toLowerCase().includes(q))
    )
  }, [q])

  const matchedRoadmap: RoadmapItemData[] = useMemo(() => {
    if (!q) return roadmapItems.slice(0, 3)
    return roadmapItems.filter(
      (rm) =>
        rm.title.toLowerCase().includes(q) ||
        rm.description.toLowerCase().includes(q) ||
        rm.quarter.toLowerCase().includes(q)
    )
  }, [q])

  const allItems = useMemo(
    () => [
      ...matchedReleases.map((r) => ({
        type: "release" as const,
        url: `/release/${r.version}`,
        title: `${r.version}: ${r.title}`,
        subtitle: r.summary || r.releaseDate,
        tag: r.version,
      })),
      ...matchedRoadmap.map((rm) => ({
        type: "roadmap" as const,
        url: "/roadmap",
        title: rm.title,
        subtitle: rm.description,
        tag: rm.stage,
      })),
    ],
    [matchedReleases, matchedRoadmap]
  )

  const handleSelect = useCallback(
    (url: string) => {
      handleClose()
      setTimeout(() => {
        startTransition(() => {
          router.push(url)
        })
      }, 50)
    },
    [handleClose, router]
  )

  useEffect(() => {
    function handleNavKeys(e: KeyboardEvent) {
      if (!isOpen) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(
          (prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length)
        )
      } else if (e.key === "Enter" && allItems[selectedIndex]) {
        e.preventDefault()
        handleSelect(allItems[selectedIndex].url)
      }
    }

    window.addEventListener("keydown", handleNavKeys)
    return () => window.removeEventListener("keydown", handleNavKeys)
  }, [isOpen, allItems, selectedIndex, handleSelect])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search release notes and roadmap"
      className="fixed inset-0 z-50 flex animate-in items-start justify-center bg-background/80 p-4 pt-16 backdrop-blur-md duration-200 fade-in sm:pt-24"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl animate-in overflow-hidden rounded-3xl border border-foreground/10 bg-card/95 shadow-2xl ring-1 ring-foreground/5 backdrop-blur-2xl duration-200 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-foreground/8 px-5 py-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search releases, milestones, architectural commits..."
            autoFocus
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear query"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {allItems.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-muted-foreground">
              [ NO MATCHING RELEASES OR ARCHITECTURAL MILESTONES FOUND ]
            </div>
          ) : (
            <div className="space-y-4">
              {matchedReleases.length > 0 && (
                <div>
                  <div className="px-3 py-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Releases & Version Logs
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedReleases.map((rel) => {
                      const itemIndex = allItems.findIndex(
                        (it) => it.tag === rel.version
                      )
                      const isSelected = selectedIndex === itemIndex

                      return (
                        <button
                          key={rel.id}
                          type="button"
                          onClick={() =>
                            handleSelect(`/release/${rel.version}`)
                          }
                          className={cn(
                            "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all",
                            isSelected
                              ? "bg-foreground text-background"
                              : "text-foreground hover:bg-foreground/[0.04]"
                          )}
                        >
                          <GitCommit
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              isSelected ? "text-background" : "text-foreground"
                            )}
                          />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold">
                                {rel.version}
                              </span>
                              <span
                                className={cn(
                                  "font-mono text-[11px]",
                                  isSelected
                                    ? "text-background/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {rel.releaseDate}
                              </span>
                            </div>
                            <p className="truncate text-xs font-medium">
                              {rel.title}
                            </p>
                            {rel.summary && (
                              <p
                                className={cn(
                                  "line-clamp-1 text-[11px]",
                                  isSelected
                                    ? "text-background/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {rel.summary}
                              </p>
                            )}
                          </div>
                          <ArrowRight
                            className={cn(
                              "mt-1 size-3.5 shrink-0",
                              isSelected
                                ? "text-background/80"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {matchedRoadmap.length > 0 && (
                <div>
                  <div className="px-3 py-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Roadmap & Milestones
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchedRoadmap.map((rm) => {
                      const itemIndex = allItems.findIndex(
                        (it) => it.title === rm.title
                      )
                      const isSelected = selectedIndex === itemIndex

                      return (
                        <button
                          key={rm.id}
                          type="button"
                          onClick={() => handleSelect("/roadmap")}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-all",
                            isSelected
                              ? "bg-foreground text-background"
                              : "text-foreground hover:bg-foreground/[0.04]"
                          )}
                        >
                          <Milestone
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              isSelected ? "text-background" : "text-foreground"
                            )}
                          />
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase",
                                  isSelected
                                    ? "border-background/20 bg-background/10 text-background"
                                    : "border-foreground/10 bg-foreground/[0.03] text-muted-foreground"
                                )}
                              >
                                {rm.stage}
                              </span>
                              <span
                                className={cn(
                                  "font-mono text-[11px]",
                                  isSelected
                                    ? "text-background/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {rm.quarter}
                              </span>
                            </div>
                            <p className="truncate text-xs font-medium">
                              {rm.title}
                            </p>
                            <p
                              className={cn(
                                "line-clamp-1 text-[11px]",
                                selectedIndex === itemIndex
                                  ? "text-background/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {rm.description}
                            </p>
                          </div>
                          <ArrowRight
                            className={cn(
                              "mt-1 size-3.5 shrink-0",
                              isSelected
                                ? "text-background/80"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-foreground/8 bg-foreground/[0.02] px-5 py-3 font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px]">
              ↑
            </kbd>
            <kbd className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px]">
              ↓
            </kbd>
            <kbd className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-0.5 text-[10px]">
              ↵
            </kbd>
          </div>
          <span>[ ESC TO CLOSE ]</span>
        </div>
      </div>
    </div>
  )
}
