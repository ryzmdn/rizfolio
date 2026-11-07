import { Container } from "@workspace/ui/components/layouts"
import { personalInfo } from "@/data"
import Image from "next/image"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react"
import { HeroEntrance } from "@workspace/ui/components/animations"
import type { ProfileData } from "@/lib/queries"

interface HeroSectionProps {
  data?: ProfileData
}

export function HeroSection({ data = personalInfo }: HeroSectionProps) {
  const status = data.status || "available"

  const statusConfig = {
    available: {
      color: "bg-emerald-400",
      label: "AVAILABLE FOR ADVISORY & SYSTEM ARCHITECTURE",
    },
    busy: {
      color: "bg-amber-400",
      label: "CURRENTLY COMMITTED TO CORE ARCHITECTURE",
    },
    building: {
      color: "bg-indigo-400",
      label: "BUILDING PRODUCTION PLATFORMS",
    },
  }[status] || {
    color: "bg-emerald-400",
    label: "AVAILABLE FOR ADVISORY & SYSTEM ARCHITECTURE",
  }

  const stats = [
    { value: "08+", label: "Years Experience" },
    { value: "99.99%", label: "Uptime Reliability" },
    { value: "100%", label: "Type-Safe Systems" },
    { value: "Sub-1s", label: "Latency Target" },
  ]

  return (
    <Container
      id="hero-section"
      className="flow-root pt-28 pb-20 md:pt-36 md:pb-32"
    >
      <HeroEntrance className="flex flex-col gap-y-12 lg:gap-y-16">
        <div
          data-hero-element
          className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/6 pb-6 text-xs"
        >
          <div className="flex items-center gap-x-3">
            <span className="relative flex size-2">
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                  statusConfig.color
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-full",
                  statusConfig.color
                )}
              />
            </span>
            <span className="font-mono tracking-[0.2em] text-foreground/80 uppercase">
              {statusConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-x-4 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
            <span>JAKARTA / UTC+7</span>
            <span className="text-foreground/20">•</span>
            <span>SYSTEM LOGS v2.4</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="space-y-8 lg:col-span-9">
            <div
              data-hero-element
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3.5 py-1 font-mono text-xs text-muted-foreground transition-hover-lift"
            >
              <Sparkles className="size-3 text-foreground" />
              <span>{data.role || "Lead Software Architect"}</span>
            </div>

            <h1
              data-hero-element
              className="text-4xl font-light tracking-[-0.04em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem] lg:leading-[0.98]"
            >
              Architecting resilient systems with{" "}
              <span className="font-serif text-foreground/80 italic">
                timeless restraint
              </span>
              .
            </h1>

            <p
              data-hero-element
              className="max-w-2xl text-base leading-relaxed font-light text-muted-foreground sm:text-lg"
            >
              {data.headline}. {data.subheadline}
            </p>

            <div
              data-hero-element
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href="/#case-studies"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-12 rounded-full px-7 font-mono text-xs tracking-widest uppercase transition-hover-lift"
                )}
              >
                <span>Explore Works</span>
                <ArrowDownRight className="ml-2 size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
              <Link
                href="/#call-to-action"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group h-12 rounded-full border-foreground/15 px-7 font-mono text-xs tracking-widest uppercase transition-hover-lift hover:border-foreground/40 hover:bg-foreground/[0.03]"
                )}
              >
                <span>Initiate Inquiry</span>
                <ArrowUpRight className="ml-2 size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          <div
            data-hero-element
            className="flex flex-col items-start gap-6 lg:col-span-3 lg:items-end"
          >
            <div className="group relative size-28 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 shadow-2xl transition-hover-lift sm:size-32">
              <Image
                src={data.avatar}
                alt={data.name}
                fill
                priority
                sizes="128px"
                className="size-full object-cover contrast-125 grayscale transition-all duration-700 ease-luxury group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            <div className="space-y-1 lg:text-right">
              <p className="text-sm font-medium tracking-wide text-foreground uppercase">
                {data.name}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                Software Engineering & Architecture
              </p>
            </div>
          </div>
        </div>

        <div
          data-hero-element
          className="grid grid-cols-2 gap-6 border-t border-foreground/6 pt-10 sm:grid-cols-4 lg:gap-8"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1 transition-hover-lift">
              <p className="font-mono text-2xl font-light tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </p>
              <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </HeroEntrance>
    </Container>
  )
}
