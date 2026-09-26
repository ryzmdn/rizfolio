"use client"

import { useEffect, useState } from "react"
import { ListCollapse, ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

function extractHeadings(markdown: string): TocItem[] {
  if (!markdown) return []

  const lines = markdown.split("\n")
  const items: TocItem[] = []

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1]!.length // 2 for ##, 3 for ###
      const rawText = match[2]!.trim()
      // Remove inline markdown formatting
      const cleanText = rawText
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")

      // Standard slug id
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      items.push({
        id,
        text: cleanText,
        level,
      })
    }
  }

  return items
}

export function TableOfContents({
  content,
  className,
}: TableOfContentsProps) {
  const headings = extractHeadings(content)
  const [activeId, setActiveId] = useState<string>("")
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0.1,
      }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const handleHeadingClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const yCoordinate =
        element.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top: yCoordinate, behavior: "smooth" })
      setActiveId(id)
      setMobileExpanded(false)
    }
  }

  return (
    <nav aria-label="Table of contents" className={cn("space-y-3", className)}>
      {/* Mobile Collapsible View */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between text-xs font-medium text-foreground"
        >
          <span className="flex items-center gap-x-2">
            <ListCollapse className="size-3.5 text-muted-foreground" />
            <span>Table of Contents ({headings.length} sections)</span>
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-200",
              mobileExpanded ? "rotate-180" : ""
            )}
          />
        </button>

        {mobileExpanded && (
          <ul className="mt-3 space-y-2 border-t border-border/40 pt-3 text-xs">
            {headings.map((item) => (
              <li
                key={item.id}
                className={cn(
                  item.level === 3 ? "pl-3 text-[11px]" : "font-medium"
                )}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleHeadingClick(e, item.id)}
                  className={cn(
                    "block py-0.5 transition-colors",
                    activeId === item.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Sticky View */}
      <div className="hidden lg:block space-y-3">
        <p className="flex items-center gap-x-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <ListCollapse className="size-3.5" />
          <span>Table of Contents</span>
        </p>

        <ul className="space-y-1.5 text-xs">
          {headings.map((item) => (
            <li
              key={item.id}
              className={cn(
                "transition-all",
                item.level === 3 ? "pl-3 text-[11px]" : ""
              )}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleHeadingClick(e, item.id)}
                className={cn(
                  "block py-1 leading-snug transition-colors",
                  activeId === item.id
                    ? "text-foreground font-medium border-l-2 border-primary pl-2 -ml-2"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
