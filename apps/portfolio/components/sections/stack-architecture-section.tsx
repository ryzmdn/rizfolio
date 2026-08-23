"use client"

import * as React from "react"
import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { SectionEyebrow } from "@workspace/ui/components/section-eyebrow"
import { cn } from "@workspace/ui/lib/utils"
import {
  architectureLayers,
  type ArchitectureLayer,
  type StackChoiceItem,
} from "@/data"
import {
  Layers,
  Database,
  Server,
  ShieldCheck,
  Scale,
  ArrowUpRight,
  Terminal,
  Zap,
} from "lucide-react"

interface StackArchitectureSectionProps {
  sectionNumber?: number | string
}

const iconMap = {
  layers: Layers,
  database: Database,
  server: Server,
  shield: ShieldCheck,
}

const defaultLayer: ArchitectureLayer = architectureLayers[0]!

export function StackArchitectureSection({
  sectionNumber = 9,
}: StackArchitectureSectionProps) {
  const [activeLayerId, setActiveLayerId] = React.useState<string>(
    defaultLayer.id
  )

  const activeLayer: ArchitectureLayer = React.useMemo(() => {
    return (
      architectureLayers.find((l) => l.id === activeLayerId) ?? defaultLayer
    )
  }, [activeLayerId])

  const LayerIcon = iconMap[activeLayer.icon] || Layers

  return (
    <Container id="architecture" className="space-y-12 py-20">
      {/* Section Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <hgroup className="max-w-2xl space-y-2">
          <SectionEyebrow number={sectionNumber} label="System Architecture." />
          <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
            Architectural Blueprint & Tech Stack Rationale
          </h2>
          <p className="leading-7 text-muted-foreground">
            A deterministic breakdown of every core technology choice,
            engineering trade-off, and boundary invariant governing this
            distributed monorepo.
          </p>
        </hgroup>

        {/* Live Architecture Metric Chip */}
        <div className="flex items-center gap-2.5 self-start rounded-full border border-border/80 bg-secondary/40 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-xs lg:self-auto">
          <span className="flex size-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-foreground">
            7 Apps &bull; 6 Packages
          </span>
          <span className="text-border">|</span>
          <span className="font-medium text-foreground">
            Zero Runtime Bloat
          </span>
        </div>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="w-full">
        <div
          role="tablist"
          aria-label="Architectural Layers"
          className="grid grid-cols-2 gap-2 rounded-2xl border border-border/60 bg-muted/40 p-1.5 sm:grid-cols-4"
        >
          {architectureLayers.map((layer: ArchitectureLayer) => {
            const IconComp = iconMap[layer.icon] || Layers
            const isActive = layer.id === activeLayerId

            return (
              <button
                key={layer.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${layer.id}`}
                id={`tab-${layer.id}`}
                onClick={() => setActiveLayerId(layer.id)}
                className={cn(
                  "group relative flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 sm:justify-start sm:px-4 sm:py-3 sm:text-sm",
                  isActive
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                )}
              >
                <IconComp
                  className={cn(
                    "hidden size-4 shrink-0 transition-colors sm:inline-block",
                    isActive ? "text-ring" : "text-muted-foreground/70"
                  )}
                />
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] transition-colors",
                    isActive
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "bg-secondary text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {layer.number}
                </span>
                <span className="truncate">{layer.shortLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Layer Banner & Thesis */}
      <div
        role="tabpanel"
        id={`panel-${activeLayer.id}`}
        aria-labelledby={`tab-${activeLayer.id}`}
        className="space-y-8 rounded-3xl border border-border/70 bg-card/60 p-6 shadow-xs backdrop-blur-xs transition-all sm:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <LayerIcon className="size-4 text-ring" />
              <span>
                Layer {activeLayer.number} {"//"} {activeLayer.title}
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-primary sm:text-2xl">
              {activeLayer.headline}
            </h3>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-end sm:text-sm">
            {activeLayer.description}
          </p>
        </div>

        {/* Stack Decisions Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {activeLayer.stack.map((item: StackChoiceItem) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-background/90 p-6 shadow-xs transition-all duration-300 hover:border-border hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Header: Tech Name & Role */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-base font-semibold tracking-tight text-primary group-hover:text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.role}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="shrink-0 font-mono text-[10px]"
                  >
                    {item.badge}
                  </Badge>
                </div>

                {/* Summary */}
                <p className="border-l-2 border-primary/40 pl-2.5 text-xs/relaxed font-medium text-foreground">
                  {item.summary}
                </p>

                {/* Rationale (Why This Choice) */}
                <div className="space-y-1.5 rounded-xl bg-secondary/40 p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-primary">
                    <Zap className="size-3.5 text-ring" />
                    <span>Architectural Rationale</span>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    {item.rationale}
                  </p>
                </div>

                {/* Trade-off Invariant */}
                <div className="space-y-1.5 rounded-xl border border-border/40 bg-card/40 p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                    <Scale className="size-3.5 text-muted-foreground/80" />
                    <span>Calculated Trade-Off</span>
                  </div>
                  <p className="leading-relaxed text-muted-foreground/90 italic">
                    &ldquo;{item.tradeoff}&rdquo;
                  </p>
                </div>
              </div>

              {/* Card Footer: Impact Metric & Tags */}
              <div className="mt-5 space-y-3 border-t border-border/50 pt-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground/80">
                    Key Invariant
                  </span>
                  <span className="font-mono text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    {item.metric}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground group-hover:text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Explorer Prompt */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/50 bg-secondary/30 px-5 py-4 text-xs sm:flex-row">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Terminal className="size-4 text-primary" />
            <span>
              All contracts and schemas are strictly verified via automated CI
              workflows.
            </span>
          </div>
          <a
            href="https://github.com/ryzmdn/rizfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <span>Explore Monorepo Repository</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </Container>
  )
}
