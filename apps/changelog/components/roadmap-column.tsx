"use client"

import { CheckCircle2, Clock, Compass } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { RoadmapCard } from "./roadmap-card"
import type { RoadmapItemData } from "../data"

interface RoadmapColumnProps {
  stage: "SHIPPED" | "IN_PROGRESS" | "PLANNED"
  items: RoadmapItemData[]
}

const stageConfig = {
  SHIPPED: {
    title: "Shipped",
    description: "Production releases and delivered milestones",
    icon: CheckCircle2,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    headerBorder: "border-emerald-500/30",
  },
  IN_PROGRESS: {
    title: "In Progress",
    description: "Under active development and testing",
    icon: Clock,
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    headerBorder: "border-blue-500/30",
  },
  PLANNED: {
    title: "Planned",
    description: "Architectural research and future horizons",
    icon: Compass,
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    headerBorder: "border-purple-500/30",
  },
}

export function RoadmapColumn({ stage, items }: RoadmapColumnProps) {
  const config = stageConfig[stage]
  const Icon = config.icon

  return (
    <section className="flex flex-col rounded-2xl border border-border/80 bg-card/40 p-4 shadow-xs backdrop-blur-xs sm:p-5">
      <div className={cn("border-b pb-4 mb-4", config.headerBorder)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex size-7 items-center justify-center rounded-lg border", config.badgeColor)}>
              <Icon className="size-4" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              {config.title}
            </h2>
          </div>

          <span className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {items.length}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {config.description}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-xs text-muted-foreground">
            No milestones in this stage matching current filter.
          </div>
        ) : (
          items.map((item) => <RoadmapCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  )
}
