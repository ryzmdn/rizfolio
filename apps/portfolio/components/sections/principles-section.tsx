import * as React from "react"
import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { SectionEyebrow } from "@workspace/ui/components/section-eyebrow"
import { engineeringPrinciples, type EngineeringPrinciple } from "@/data"
import { Shield, Zap, Lock, Compass, CheckCircle2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface PrinciplesSectionProps {
  principles?: EngineeringPrinciple[]
  sectionNumber?: number | string
}

const iconMap = {
  shield: Shield,
  zap: Zap,
  lock: Lock,
  compass: Compass,
}

export function PrinciplesSection({
  principles = engineeringPrinciples,
  sectionNumber = 3,
}: PrinciplesSectionProps) {
  return (
    <Container id="principles" className="py-20">
      <div className="space-y-12">
        {/* Header */}
        <hgroup className="max-w-2xl space-y-2">
          <SectionEyebrow
            number={sectionNumber}
            label="Principles & Mental Models."
          />
          <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
            Engineering Principles & Mental Models
          </h2>
          <p className="leading-7 text-muted-foreground">
            A deterministic set of architectural axioms and cognitive frameworks
            that govern every system I design, build, and scale.
          </p>
        </hgroup>

        {/* Principles 2x2 Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {principles.map((principle) => {
            const Icon = iconMap[principle.icon] || Shield

            return (
              <article
                key={principle.id}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-7 shadow-xs backdrop-blur-xs",
                  "transition-all duration-300 hover:border-foreground/25 hover:shadow-md dark:hover:border-white/20"
                )}
              >
                <div className="space-y-5">
                  {/* Top Bar: Number + Icon + Mental Model Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold tracking-wider text-muted-foreground">
                        {principle.number}
                      </span>
                      <span className="text-xs text-border">&#47;&#47;</span>
                      <div className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background/80 text-foreground shadow-2xs transition-colors group-hover:border-foreground/40">
                        <Icon
                          className="size-4 text-primary"
                          strokeWidth={1.75}
                        />
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="rounded-full border-border/70 bg-background/50 px-2.5 py-0.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase"
                    >
                      {principle.mentalModel}
                    </Badge>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {principle.title}
                    </h3>
                    <p className="border-l-2 border-primary/30 pl-3 font-mono text-xs leading-relaxed text-muted-foreground italic">
                      &ldquo;{principle.tagline}&rdquo;
                    </p>
                  </div>

                  {/* Narrative Description */}
                  <p className="text-sm/relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </div>

                {/* Bottom Rules / Invariants */}
                <div className="mt-6 border-t border-border/40 pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {principle.rules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 rounded-md bg-secondary/70 px-2.5 py-1 text-xs font-normal text-secondary-foreground"
                      >
                        <CheckCircle2
                          className="size-3 shrink-0 text-emerald-500"
                          strokeWidth={2}
                        />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
