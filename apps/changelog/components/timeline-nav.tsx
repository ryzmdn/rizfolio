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
    <aside
      className="sticky top-24 hidden h-fit w-64 shrink-0 rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl lg:block"
      aria-label="Release navigation"
    >
      <div className="flex items-center justify-between border-b border-foreground/8 pb-3.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          <History className="size-3.5 text-foreground" />
          <span>Timeline Index</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {releases.length} releases
        </span>
      </div>

      <nav className="my-3 space-y-1" aria-label="Version releases">
        {releases.map((rel) => {
          const isActive = activeVersion === rel.version

          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => scrollToVersion(rel.version)}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-mono text-xs transition-all",
                isActive
                  ? "bg-foreground/[0.06] font-medium text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    isActive
                      ? "bg-foreground"
                      : "bg-muted-foreground/40 group-hover:bg-foreground"
                  )}
                />
                <span className="font-medium">{rel.version}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {rel.releaseDate.split(" ")[0]}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="space-y-1.5 border-t border-foreground/8 pt-3.5">
        <Link
          href="/roadmap"
          className="flex items-center justify-between rounded-xl px-3 py-2 font-mono text-xs text-muted-foreground transition-all hover:bg-foreground/[0.03] hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <Milestone className="size-3.5" />
            <span>Product Roadmap</span>
          </div>
          <span className="py-0.2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-1.5 text-[9px] text-muted-foreground">
            Upcoming
          </span>
        </Link>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2 font-mono text-xs text-muted-foreground transition-all hover:bg-foreground/[0.03] hover:text-foreground"
        >
          <div className="flex items-center gap-2">
            <ArrowUp className="size-3.5" />
            <span>Back to top</span>
          </div>
        </button>
      </div>
    </aside>
  )
}
