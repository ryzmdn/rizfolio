"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUp, Milestone, History } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { ChangelogReleaseData } from "../data"

interface TimelineNavProps {
  releases: ChangelogReleaseData[]
}

export function TimelineNav({ releases }: TimelineNavProps) {
  const [activeVersion, setActiveVersion] = useState<string>(
    releases[0]?.version || ""
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVersion(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -60% 0px",
      }
    )

    releases.forEach((rel) => {
      const el = document.getElementById(rel.version)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [releases])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function scrollToVersion(version: string) {
    const el = document.getElementById(version)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <aside className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs lg:block">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <History className="size-3.5 text-primary" />
          <span>Quick Jump</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {releases.length} releases
        </span>
      </div>

      <nav className="my-3 space-y-1">
        {releases.map((rel) => {
          const isActive = activeVersion === rel.version

          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => scrollToVersion(rel.version)}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors",
                isActive
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    isActive ? "bg-primary" : "bg-muted-foreground/40 group-hover:bg-foreground"
                  )}
                />
                <span className="font-mono">{rel.version}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {rel.releaseDate.split(" ")[0]}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="space-y-1.5 border-t border-border/60 pt-3">
        <Link
          href="/roadmap"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <Milestone className="size-3.5 text-primary" />
            <span>Product Roadmap</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">Q1-Q4</span>
        </Link>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="size-3.5" />
            <span>Scroll to Top</span>
          </div>
        </button>
      </div>
    </aside>
  )
}
