import { Container } from "@workspace/ui/components/layouts"
import { personalInfo } from "@/data"
import { ArrowUpRight, FileText, Shield, Zap, Lock } from "lucide-react"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { ProfileData } from "@/lib/queries"

interface StatementSectionProps {
  data?: ProfileData
}

export function StatementSection({ data = personalInfo }: StatementSectionProps) {
  const bio = data.bio || personalInfo.bio
  const resumeUrl = data.resumeUrl

  const principles = [
    {
      index: "01",
      icon: Shield,
      title: "Deterministic Integrity",
      subtitle: "Fail-Closed Security & Atomicity",
      description:
        "Every data mutation must be transactional, auditable, and strictly validated at runtime. Zero trust across trust boundaries.",
    },
    {
      index: "02",
      icon: Zap,
      title: "Cognitive Serenity",
      subtitle: "Aesthetic & Structural Restraint",
      description:
        "Interfaces should eliminate noise. We design high-density information systems that communicate authority without visual fatigue.",
    },
    {
      index: "03",
      icon: Lock,
      title: "Latency Discipline",
      subtitle: "Edge Execution & Sub-Second Speed",
      description:
        "Architecting software within uncompromising performance budgets. Sub-second response times, zero superfluous dependencies.",
    },
  ]

  return (
    <Container id="manifesto" className="py-24 md:py-36">
      <div id="journey" className="space-y-16 lg:space-y-24">
        <div className="flex flex-col gap-6 border-b border-foreground/6 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
              [ 01 / PHILOSOPHY & MANIFESTO ]
            </span>
            <h2 className="text-sm font-mono tracking-wider text-foreground/80 uppercase">
              The Architecture of Restraint
            </h2>
          </div>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "group h-9 rounded-full border-foreground/15 px-4 font-mono text-[11px] tracking-widest uppercase transition-colors hover:border-foreground/40"
              )}
            >
              <FileText className="mr-2 size-3.5" />
              <span>Executive Dossier</span>
              <ArrowUpRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <blockquote className="font-serif text-2xl font-normal leading-[1.35] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              &ldquo;True architectural elegance is the complete absence of unnecessary complexity. We do not build software by adding until nothing more can be added, but by refining until nothing more can be removed.&rdquo;
            </blockquote>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground lg:col-span-4 lg:pt-2">
            {bio.slice(0, 2).map((paragraph, index) => (
              <p key={index} className="font-light">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-foreground/6 pt-12 md:grid-cols-3 md:gap-12">
          {principles.map((item) => {
            const IconComponent = item.icon
            return (
              <div key={item.index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground/40">
                    /{item.index}
                  </span>
                  <div className="flex size-7 items-center justify-center rounded-md border border-foreground/10 bg-foreground/[0.02] text-foreground">
                    <IconComponent className="size-3.5 stroke-[1.5]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-medium text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-xs font-light leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
