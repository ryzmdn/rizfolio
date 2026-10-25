"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  X,
  FileText,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react"
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
          results.length > 0
            ? (prev - 1 + results.length) % results.length
            : 0
        )
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        const selected = results[selectedIndex]
        if (selected) {
          router.push(`/blog/${selected.slug}`)
          onClose()
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
    router.push(`/blog/${slug}`)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search articles dialog"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24"
    >
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center border-b border-border/60 px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search engineering articles, architectures, tags..."
            className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden"
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
            <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <p>Type keywords to search through technical articles.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {["architecture", "nextjs", "performance", "turborepo"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleQueryChange(tag)}
                      className="rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-foreground/30"
                    >
                      #{tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No articles found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((post, idx) => {
                const isSelected = idx === selectedIndex

                return (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post.slug)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      "group flex cursor-pointer items-start justify-between gap-3 rounded-xl p-3 transition-colors",
                      isSelected
                        ? "bg-foreground text-background"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={cn(
                          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border",
                          isSelected
                            ? "border-background/20 bg-background/10 text-background"
                            : "border-border/60 bg-muted/40 text-muted-foreground"
                        )}
                      >
                        <FileText className="size-3.5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4
                            className={cn(
                              "text-xs font-semibold leading-snug line-clamp-1",
                              isSelected ? "text-background" : "text-foreground"
                            )}
                          >
                            {post.title}
                          </h4>
                          {post.featured && (
                            <span
                              className={cn(
                                "rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase",
                                isSelected
                                  ? "bg-background/20 text-background"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              Featured
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-[11px] line-clamp-1 leading-normal",
                            isSelected
                              ? "text-background/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                          {post.categories[0] && (
                            <span
                              className={cn(
                                "text-[10px] font-medium",
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
                              "flex items-center gap-0.5 text-[10px]",
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
                            : "opacity-0 text-muted-foreground group-hover:opacity-100"
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.2 font-mono text-[9px]">
                ↑
              </kbd>
              <kbd className="rounded border border-border bg-background px-1 py-0.2 font-mono text-[9px]">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.2 font-mono text-[9px]">
                ↵
              </kbd>
              <span>select</span>
            </span>
          </div>

          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-background px-1 py-0.2 font-mono text-[9px]">
              esc
            </kbd>
            <span>close</span>
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
