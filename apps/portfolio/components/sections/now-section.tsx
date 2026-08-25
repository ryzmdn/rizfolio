import * as React from "react"
import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { nowData, type NowData, type NowFocusItem } from "@/data"
import {
  Activity,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react"

interface NowSectionProps {
  data?: NowData
}

const iconMap = {
  layers: Layers,
  cpu: Cpu,
  book: BookOpen,
  activity: Activity,
}

export function NowSection({ data = nowData }: NowSectionProps) {
  return (
    <Container id="now" className="py-20">
      <hgroup className="text-center mx-auto max-w-2xl space-y-3">
        <p className="text-sm/6 text-muted-foreground">Current Me.</p>
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Current Focus & Living Roadmap
        </h2>
        <p className="leading-7 text-muted-foreground">
          A real-time snapshot of technical initiatives, system architectures,
          and research topics I am actively immersed in.
        </p>
      </hgroup>

      <div className="grid w-full gap-4 py-10 sm:grid-cols-2">
        {data.items.map((item: NowFocusItem) => {
          const IconComponent = iconMap[item.icon] || Sparkles

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xs transition-all duration-300 hover:border-border hover:bg-card hover:shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-secondary/80 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <IconComponent className="size-4 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {item.category}
                    </span>
                  </div>

                  <Badge
                    variant={item.badgeVariant || "outline"}
                    className="font-mono text-[11px]"
                  >
                    {item.badge}
                  </Badge>
                </div>

                <div className="space-y-2 pt-1">
                  <h3 className="text-base font-semibold tracking-tight text-primary group-hover:text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm/6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border/40 pt-4">
                {item.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground/80">
        <p>
          Inspired by the{" "}
          <span className="font-mono text-foreground">/now</span> page concept.
        </p>
        <p className="font-mono text-[11px]">Updated: {data.lastUpdated}</p>
      </div>
    </Container>
  )
}
