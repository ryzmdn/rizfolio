"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, X, FileText, Clock, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { searchBlogPostsAction } from "@/lib/actions"
import type { BlogPostItem } from "@/data"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

function SearchModalContent({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BlogPostItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev + 1) % results.length : 0
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          results.length > 0 ? (prev - 1 + results.length) % results.length : 0
        )
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        const selected = results[selectedIndex]
        if (selected) {
          onClose()
          setTimeout(() => {
            router.push(`/blog/${selected.slug}`)
          }, 50)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [results, selectedIndex, router, onClose])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    const timeout = setTimeout(() => {
      setIsSearching(true)
      startTransition(async () => {
        try {
          const res = await searchBlogPostsAction(trimmed)
          setResults(res)
          setSelectedIndex(0)
        } finally {
          setIsSearching(false)
        }
      })
    }, 280)

    return () => clearTimeout(timeout)
  }, [query])

  function handleQueryChange(value: string) {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      setIsSearching(false)
    }
  }

  function handleSelectPost(slug: string) {
    onClose()
    setTimeout(() => {
      router.push(`/blog/${slug}`)
    }, 50)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search articles dialog"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
    >
      <div
        className="fixed inset-0 animate-in bg-background/80 backdrop-blur-xl fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl animate-in overflow-hidden rounded-3xl border border-foreground/10 bg-card/95 shadow-2xl backdrop-blur-2xl duration-200 zoom-in-95">
        <div className="flex items-center border-b border-foreground/8 px-5 py-4">
          <Search className="size-4 shrink-0 text-muted-foreground/60" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="SEARCH MONOGRAPHS, ARCHITECTURES, TOPICS..."
            className="flex-1 bg-transparent px-3 font-mono text-xs text-foreground uppercase placeholder:text-muted-foreground/40 focus:outline-hidden"
          />
          {isSearching ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
          ) : query ? (
            <button
              type="button"
              onClick={() => handleQueryChange("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : (
            <kbd className="hidden rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-[9px] text-muted-foreground uppercase sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!query.trim() ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <span className="font-mono text-[11px] tracking-wider text-muted-foreground/60 uppercase">
                [ DISPATCH CATALOG SEARCH ]
              </span>
              <p className="mt-1 font-light">
                Enter terms to explore the architectural archives.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 font-mono text-[10px] uppercase">
                {["architecture", "nextjs", "performance", "turborepo"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQueryChange(tag)}
                      className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      #{tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-8 text-center font-mono text-xs text-muted-foreground">
              No monographs discovered matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1.5">
              {results.map((post, idx) => {
                const isSelected = idx === selectedIndex

                return (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post.slug)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "group flex cursor-pointer items-start justify-between gap-3 rounded-2xl p-3.5 transition-all",
                      isSelected
                        ? "bg-foreground text-background shadow-xs"
                        : "hover:bg-foreground/5"
                    )}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border",
                          isSelected
                            ? "border-background/20 bg-background/10 text-background"
                            : "border-foreground/10 bg-foreground/5 text-muted-foreground"
                        )}
                      >
                        <FileText className="size-3.5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={cn(
                              "line-clamp-1 font-serif text-sm leading-snug font-light",
                              isSelected ? "text-background" : "text-foreground"
                            )}
                          >
                            {post.title}
                          </h4>
                          {post.featured && (
                            <span
                              className={cn(
                                "py-0.2 rounded-full px-2 font-mono text-[9px] uppercase",
                                isSelected
                                  ? "bg-background/20 text-background"
                                  : "bg-foreground/10 text-foreground"
                              )}
                            >
                              Featured
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "line-clamp-1 text-xs font-light",
                            isSelected
                              ? "text-background/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5 font-mono text-[10px] uppercase">
                          {post.categories[0] && (
                            <span
                              className={cn(
                                isSelected
                                  ? "text-background/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {post.categories[0].name}
                            </span>
                          )}
                          <span
                            className={cn(
                              "flex items-center gap-1",
                              isSelected
                                ? "text-background/70"
                                : "text-muted-foreground"
                            )}
                          >
                            <Clock className="size-2.5" />
                            {post.readingTime} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="self-center">
                      <ArrowRight
                        className={cn(
                          "size-3.5 transition-transform",
                          isSelected
                            ? "translate-x-0.5 text-background"
                            : "text-muted-foreground opacity-0 group-hover:opacity-100"
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-foreground/8 bg-foreground/2 px-5 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="py-0.2 rounded border border-foreground/10 bg-background px-1">
                ↑↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="py-0.2 rounded border border-foreground/10 bg-background px-1">
                ↵
              </kbd>
              <span>Select</span>
            </span>
          </div>

          <span className="flex items-center gap-1.5">
            <kbd className="py-0.2 rounded border border-foreground/10 bg-background px-1">
              esc
            </kbd>
            <span>Dismiss</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null
  return <SearchModalContent onClose={onClose} />
}
