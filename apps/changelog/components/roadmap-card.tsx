"use client"

import Link from "next/link"
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { RoadmapItemData } from "../data"

interface RoadmapCardProps {
  item: RoadmapItemData
}

function getPriorityBadge(priority: string) {
  switch (priority.toUpperCase()) {
    case "HIGH":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    default:
      return "bg-muted text-muted-foreground border-border/50"
  }
}

export function RoadmapCard({ item }: RoadmapCardProps) {
  const isShipped = item.stage === "SHIPPED"
  const isInProgress = item.stage === "IN_PROGRESS"

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur-xs transition-all hover:border-border hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                getPriorityBadge(item.priority)
              )}
            >
              {item.priority}
            </span>

            <span className="font-mono text-xs text-muted-foreground">
              {item.quarter}
            </span>
          </div>

          {isShipped && item.relatedVersion && (
            <Link
              href={`/release/${item.relatedVersion}`}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              <CheckCircle2 className="size-3" />
              <span>{item.relatedVersion}</span>
            </Link>
          )}

          {isInProgress && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
              <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
              Active
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {item.scope.map((sc) => (
            <span
              key={sc}
              className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {sc.replace("apps/", "").replace("packages/", "")}
            </span>
          ))}
        </div>

        {isShipped && item.relatedVersion && (
          <Link
            href={`/release/${item.relatedVersion}`}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Notes</span>
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
    </article>
  )
}
