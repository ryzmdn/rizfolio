import { Container } from "@workspace/ui/components/layouts"
import { services as fallbackServices, engineeringProcess } from "@/data"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@workspace/ui/components/animations"
import type { ServiceItem } from "@/lib/queries"

interface ServicesSectionProps {
  services?: ServiceItem[]
}

export function ServicesSection({
  services: propServices,
}: ServicesSectionProps) {
  const items =
    propServices && propServices.length > 0 ? propServices : fallbackServices

  return (
    <Container id="capabilities" className="py-24 md:py-36">
      <div id="solutions" className="space-y-16 lg:space-y-24">
        <ScrollReveal variant="slide-up">
          <div className="flex flex-col gap-6 border-b border-foreground/6 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
                [ 03 / ARCHITECTURAL CAPABILITIES ]
              </span>
              <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Systems engineered for uncompromising scale.
              </h2>
            </div>
            <p className="max-w-md font-mono text-xs leading-relaxed text-muted-foreground">
              Strict engineering standards governing state atomicity, sub-second
              latency, and deterministic reliability.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="divide-y divide-foreground/6">
          {items.map((service, index) => (
            <StaggerItem
              key={service.title}
              className="group rounded-2xl px-4 py-10 transition-colors-luxury hover:bg-foreground/[0.015] sm:py-12"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="flex items-start justify-between lg:col-span-3">
                  <div className="space-y-1">
                    <span className="font-mono text-sm font-light text-foreground/40">
                      0{index + 1}
                    </span>
                    <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      CAPABILITY SPEC
                    </p>
                  </div>
                </div>

                <div className="space-y-4 lg:col-span-5">
                  <h3 className="text-2xl font-medium tracking-tight text-foreground transition-colors-luxury group-hover:text-foreground/80 sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                <div className="lg:col-span-4">
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2.5">
                      <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        DELIVERABLES & ARTIFACTS
                      </p>
                      <ul className="space-y-2 text-xs font-light text-foreground/90">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-foreground/40" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal variant="scale" delay={0.1}>
          <div className="space-y-8 rounded-3xl border border-foreground/10 bg-foreground/[0.01] p-8 transition-hover-lift sm:p-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  ENGINEERING LIFECYCLE
                </span>
                <h4 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                  The Deterministic Execution Protocol
                </h4>
              </div>
              <Link
                href="/#call-to-action"
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors-luxury hover:text-foreground"
              >
                <span>Consult On Project Scope</span>
                <ArrowRight className="size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {engineeringProcess.map((phase) => (
                <div
                  key={phase.dateTime}
                  className="space-y-2 border-t border-foreground/8 pt-4 transition-hover-lift"
                >
                  <span className="font-mono text-xs font-semibold text-foreground/40">
                    {phase.date}
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    {phase.name}
                  </p>
                  <p className="text-xs leading-relaxed font-light text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Container>
  )
}
