"use client"

import { useState, useMemo } from "react"
import {
  Milestone,
  Layers,
  CheckCircle2,
  Clock,
  Compass,
  RotateCcw,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { RoadmapColumn } from "./roadmap-column"
import { RoadmapFeedback } from "./roadmap-feedback"
import type { RoadmapItemData } from "../data"

interface RoadmapViewProps {
  initialItems: RoadmapItemData[]
}

const scopes = [
  { id: "ALL", label: "All Scopes" },
  { id: "apps/shop", label: "apps/shop" },
  { id: "apps/docs", label: "apps/docs" },
  { id: "apps/blog", label: "apps/blog" },
  { id: "apps/portfolio", label: "apps/portfolio" },
  { id: "apps/cms", label: "apps/cms" },
  { id: "packages/ui", label: "packages/ui" },
  { id: "packages/db", label: "packages/db" },
]

export function RoadmapView({ initialItems }: RoadmapViewProps) {
  const [selectedScope, setSelectedScope] = useState("ALL")
  const [selectedStage, setSelectedStage] = useState<
    "ALL" | "SHIPPED" | "IN_PROGRESS" | "PLANNED"
  >("ALL")

  const filteredItems = useMemo(() => {
    let result = [...initialItems]

    if (selectedScope !== "ALL") {
      const scopeFilter = selectedScope.toLowerCase()
      result = result.filter((item) =>
        item.scope.some((sc) => sc.toLowerCase().includes(scopeFilter))
      )
    }

    if (selectedStage !== "ALL") {
      result = result.filter((item) => item.stage === selectedStage)
    }

    return result
  }, [initialItems, selectedScope, selectedStage])

  const shippedItems = useMemo(
    () => filteredItems.filter((item) => item.stage === "SHIPPED"),
    [filteredItems]
  )

  const inProgressItems = useMemo(
    () => filteredItems.filter((item) => item.stage === "IN_PROGRESS"),
    [filteredItems]
  )

  const plannedItems = useMemo(
    () => filteredItems.filter((item) => item.stage === "PLANNED"),
    [filteredItems]
  )

  const hasActiveFilters = selectedScope !== "ALL" || selectedStage !== "ALL"

  function handleReset() {
    setSelectedScope("ALL")
    setSelectedStage("ALL")
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <header className="space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase backdrop-blur-md">
          <Milestone className="size-3.5 text-foreground" />
          <span>[ HORIZON // ARCHITECTURAL ROADMAP ]</span>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Product Roadmap{" "}
            <span className="font-sans text-muted-foreground/80 italic">&</span>{" "}
            Milestones
          </h1>
          <p className="font-sans text-base leading-relaxed font-light text-muted-foreground sm:text-lg">
            Ikhtisar transparan kapabilitas yang telah diluncurkan, prioritas
            rekayasa sistem saat ini, serta inisiatif arsitektur masa depan di
            seluruh monorepo Rizfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 shadow-xs backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Delivered Milestones
              </span>
              <CheckCircle2 className="size-4 text-foreground" />
            </div>
            <div className="mt-4 font-serif text-3xl font-light text-foreground tabular-nums">
              {initialItems.filter((it) => it.stage === "SHIPPED").length}
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Shipped in past releases
            </p>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 shadow-xs backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
                In Active Development
              </span>
              <Clock className="size-4 text-foreground" />
            </div>
            <div className="mt-4 font-serif text-3xl font-light text-foreground tabular-nums">
              {initialItems.filter((it) => it.stage === "IN_PROGRESS").length}
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Targeted for current quarter
            </p>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 shadow-xs backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Research & Horizons
              </span>
              <Compass className="size-4 text-foreground" />
            </div>
            <div className="mt-4 font-serif text-3xl font-light text-foreground tabular-nums">
              {initialItems.filter((it) => it.stage === "PLANNED").length}
            </div>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Planned for future cycles
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-5 rounded-3xl border border-foreground/8 bg-card/40 p-5 shadow-xs backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              Stage:
            </span>
            {(
              [
                { id: "ALL", label: "All Stages" },
                { id: "SHIPPED", label: "Shipped" },
                { id: "IN_PROGRESS", label: "In Progress" },
                { id: "PLANNED", label: "Planned" },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                aria-pressed={selectedStage === st.id}
                onClick={() => setSelectedStage(st.id)}
                className={cn(
                  "rounded-full px-3.5 py-1 font-mono text-xs transition-all",
                  selectedStage === st.id
                    ? "bg-foreground font-medium text-background shadow-xs"
                    : "border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
            <span className="font-mono">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredItems.length}
              </span>{" "}
              of {initialItems.length}
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground transition-all hover:bg-foreground hover:text-background"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-foreground/8 pt-4">
          <span className="mr-1.5 flex items-center gap-1 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            <Layers className="size-3" />
            Scope:
          </span>
          {scopes.map((sc) => {
            const isSelected = selectedScope === sc.id

            return (
              <button
                key={sc.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  setSelectedScope(
                    isSelected && sc.id !== "ALL" ? "ALL" : sc.id
                  )
                }
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-all",
                  isSelected
                    ? "bg-foreground font-medium text-background shadow-xs"
                    : "border border-foreground/10 bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                {sc.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {(selectedStage === "ALL" || selectedStage === "SHIPPED") && (
          <RoadmapColumn stage="SHIPPED" items={shippedItems} />
        )}

        {(selectedStage === "ALL" || selectedStage === "IN_PROGRESS") && (
          <RoadmapColumn stage="IN_PROGRESS" items={inProgressItems} />
        )}

        {(selectedStage === "ALL" || selectedStage === "PLANNED") && (
          <RoadmapColumn stage="PLANNED" items={plannedItems} />
        )}
      </div>

      <RoadmapFeedback />
    </div>
  )
}
