"use client"

import { CheckCircle2, Clock, Compass } from "lucide-react"
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
  },
  IN_PROGRESS: {
    title: "In Progress",
    description: "Under active development and testing",
    icon: Clock,
  },
  PLANNED: {
    title: "Planned",
    description: "Architectural research and future horizons",
    icon: Compass,
  },
}

export function RoadmapColumn({ stage, items }: RoadmapColumnProps) {
  const config = stageConfig[stage]
  const Icon = config.icon

  return (
    <section className="flex flex-col rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl sm:p-6">
      <div className="mb-5 border-b border-foreground/8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-foreground">
              <Icon className="size-4" />
            </div>
            <h2 className="font-serif text-lg font-light tracking-tight text-foreground">
              {config.title}
            </h2>
          </div>

          <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {items.length}
          </span>
        </div>
        <p className="mt-2 font-sans text-xs font-light text-muted-foreground">
          {config.description}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 p-8 text-center font-mono text-xs text-muted-foreground">
            No milestones in this stage matching current filter.
          </div>
        ) : (
          items.map((item) => <RoadmapCard key={item.id} item={item} />)
        )}
      </div>
    </section>
  )
}
