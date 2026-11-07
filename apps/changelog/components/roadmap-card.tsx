"use client"

import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import type { RoadmapItemData } from "../data"

interface RoadmapCardProps {
  item: RoadmapItemData
}

export function RoadmapCard({ item }: RoadmapCardProps) {
  const isShipped = item.stage === "SHIPPED"
  const isInProgress = item.stage === "IN_PROGRESS"

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-5 shadow-xs backdrop-blur-md transition-hover-lift hover:border-foreground/30 hover:bg-foreground/[0.03] hover:shadow-xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[9px] tracking-wider uppercase text-muted-foreground">
              {item.priority}
            </span>

            <span className="font-mono text-xs text-muted-foreground">
              {item.quarter}
            </span>
          </div>

          {isShipped && item.relatedVersion && (
            <Link
              href={`/release/${item.relatedVersion}`}
              className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>{item.relatedVersion}</span>
            </Link>
          )}

          {isInProgress && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-foreground">
              <span className="size-1.5 rounded-full bg-blue-500" />
              Active
            </span>
          )}
        </div>

        <div>
          <h3 className="font-serif text-base font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground">
            {item.title}
          </h3>
          <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/6 pt-3 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {item.scope.map((sc) => (
            <span
              key={sc}
              className="rounded-full border border-foreground/8 bg-foreground/[0.02] px-2 py-0.2 font-mono text-[9px] text-muted-foreground"
            >
              {sc.replace("apps/", "").replace("packages/", "")}
            </span>
          ))}
        </div>

        {isShipped && item.relatedVersion && (
          <Link
            href={`/release/${item.relatedVersion}`}
            className="group/link inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Notes</span>
            <ArrowRight className="size-3 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        )}
      </div>
    </article>
  )
}
