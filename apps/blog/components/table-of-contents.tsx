"use client"

import { useEffect, useState, useCallback } from "react"
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

  return markdown.split("\n").reduce<TocItem[]>((acc, line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (!match) return acc

    const level = match[1]!.length
    const rawText = match[2]!.trim()
    const cleanText = rawText
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")

    const id = cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    acc.push({ id, text: cleanText, level })
    return acc
  }, [])
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
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
      { rootMargin: "-80px 0% -60% 0%", threshold: 0.1 }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  const handleHeadingClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault()
      const element = document.getElementById(id)
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo({ top: y, behavior: "smooth" })
        setActiveId(id)
        setMobileExpanded(false)
      }
    },
    []
  )

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className={cn("space-y-4", className)}>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          aria-expanded={mobileExpanded}
          className="flex w-full items-center justify-between rounded-md border border-border/50 bg-muted/20 px-4 py-3 text-xs font-medium text-foreground"
        >
          <span className="flex items-center gap-2">
            <ListCollapse className="size-3.5 text-muted-foreground" />
            <span>Contents ({headings.length})</span>
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-200",
              mobileExpanded && "rotate-180"
            )}
          />
        </button>

        {mobileExpanded && (
          <ul className="mt-1 space-y-1 rounded-md border border-border/50 bg-muted/10 p-3">
            {headings.map((item) => (
              <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleHeadingClick(e, item.id)}
                  className={cn(
                    "block py-1 text-xs leading-relaxed transition-colors",
                    activeId === item.id
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    item.level === 3 && "text-[11px]"
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden space-y-4 lg:block">
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          <ListCollapse className="size-3.5" />
          <span>On this page</span>
        </p>

        <ul className="space-y-1.5">
          {headings.map((item) => (
            <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleHeadingClick(e, item.id)}
                className={cn(
                  "block py-0.5 text-xs leading-snug transition-colors",
                  activeId === item.id
                    ? "-ml-2 border-l-2 border-foreground pl-2 font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  item.level === 3 && "text-[11px]"
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
