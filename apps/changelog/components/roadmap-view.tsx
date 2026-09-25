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
  { id: "apps/shop", label: "Shop" },
  { id: "apps/docs", label: "Docs" },
  { id: "apps/blog", label: "Blog" },
  { id: "apps/portfolio", label: "Portfolio" },
  { id: "apps/cms", label: "CMS" },
  { id: "packages/ui", label: "UI System" },
  { id: "packages/db", label: "Database" },
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
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-xs">
          <Milestone className="size-3.5 text-primary" />
          <span>Product Horizon & Architectural Roadmap</span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Product Roadmap & Milestones
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            An open overview of completed deliveries, current engineering priorities,
            and upcoming architectural initiatives across the Rizfolio digital monorepo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Delivered Milestones
              </span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {initialItems.filter((it) => it.stage === "SHIPPED").length}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Shipped in past releases
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                In Active Development
              </span>
              <Clock className="size-4 text-blue-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {initialItems.filter((it) => it.stage === "IN_PROGRESS").length}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Targeted for current quarter
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 shadow-xs backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                Research & Horizons
              </span>
              <Compass className="size-4 text-purple-500" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-foreground">
              {initialItems.filter((it) => it.stage === "PLANNED").length}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Planned for future cycles
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium text-muted-foreground">
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
                onClick={() => setSelectedStage(st.id)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                  selectedStage === st.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
            <span className="font-mono">
              Showing <span className="font-semibold text-foreground">{filteredItems.length}</span> of {initialItems.length}
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
          <span className="mr-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Layers className="size-3" />
            Scope:
          </span>
          {scopes.map((sc) => {
            const isSelected = selectedScope === sc.id

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() =>
                  setSelectedScope(isSelected && sc.id !== "ALL" ? "ALL" : sc.id)
                }
                className={cn(
                  "rounded-lg px-2 py-0.5 font-mono text-[11px] font-medium transition-colors",
                  isSelected
                    ? "bg-foreground text-background shadow-xs"
                    : "border border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
