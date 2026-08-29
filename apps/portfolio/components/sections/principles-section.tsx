import * as React from "react"
import { Shield, Zap, Lock, Compass, Check } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { engineeringPrinciples, type EngineeringPrinciple } from "@/data"

interface PrinciplesSectionProps {
  principles?: EngineeringPrinciple[]
}

const iconMap = {
  shield: Shield,
  zap: Zap,
  lock: Lock,
  compass: Compass,
}

export function PrinciplesSection({
  principles = engineeringPrinciples,
}: PrinciplesSectionProps) {
  return (
    <Container id="principles" className="space-y-10 py-20">
      <hgroup className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-sm/6 text-muted-foreground">How I Think.</p>
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Engineering Principles & Mental Models
        </h2>
        <p className="leading-7 text-muted-foreground">
          A deterministic set of architectural axioms and cognitive models
          governing how I design, build, and scale resilient software systems.
        </p>
      </hgroup>

      <div className="flow-root w-full space-y-10 divide-y divide-border py-10">
        {principles.map((service, idx) => {
          const Icon = iconMap[service.icon] || Shield

          return (
            <div key={idx} className="pb-10 lg:flex">
              <div className="lg:flex-auto">
                <div className="w-full space-y-5">
                  <div className="flex max-xs:flex-col justify-between gap-4 sm:items-center">
                    <div className="flex justify-center items-center size-8 text-secondary bg-foreground rounded-md">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="relative max-w-max text-2xl font-medium tracking-tight text-primary">
                        {service.title}
                        <small className="absolute -right-5 hidden text-xs font-normal opacity-50 sm:inline">
                          0{idx + 1}
                        </small>
                      </h3>
                    </div>
                    <Badge variant="secondary" className="max-sm:hidden">{service.mentalModel}</Badge>
                  </div>
                  <p className="leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="border-l border-border italic my-7 pl-8 leading-7 text-muted-foreground">
                  <q>{service.tagline}</q>
                </div>
                {service.rules && service.rules.length > 0 && (
                  <>
                    <div className="flex items-center gap-x-4">
                      <h4 className="flex-none text-sm/6 font-semibold text-accent-foreground">
                        Deliverables & Features
                      </h4>
                      <div className="h-px flex-auto bg-border/60" />
                    </div>
                    <ul
                      role="list"
                      className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-muted-foreground sm:grid-cols-2 sm:gap-6"
                    >
                      {service.rules.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-center gap-x-3 text-foreground"
                        >
                          <Check className="size-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
