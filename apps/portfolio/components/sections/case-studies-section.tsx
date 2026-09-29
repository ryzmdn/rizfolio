import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { caseStudies as fallbackCaseStudies } from "@/data"
import type { CaseStudyItem } from "@/lib/queries"

interface CaseStudiesSectionProps {
  caseStudies?: CaseStudyItem[]
}

export function CaseStudiesSection({
  caseStudies: propCaseStudies,
}: CaseStudiesSectionProps) {
  const items =
    propCaseStudies && propCaseStudies.length > 0
      ? propCaseStudies
      : fallbackCaseStudies

  return (
    <Container id="case-studies" className="space-y-12 py-20">
      <hgroup className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-sm/6 font-medium text-muted-foreground">Case Studies</p>
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Featured Case Studies & Systems
        </h2>
        <p className="leading-7 text-muted-foreground">
          A curated selection of engineering initiatives focused on high
          throughput, architectural clarity, and verifiable business impact.
        </p>
      </hgroup>

      <div className="grid w-full gap-y-10 py-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/work/${item.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-3/2 overflow-hidden rounded-xl bg-muted shadow-lg ring-1 ring-border">
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="size-4" />
              </div>
            </div>

            <div className="mt-4 w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium tracking-wider text-muted-foreground">
                <span>{item.category}</span>
                {item.year && <span>{item.year}</span>}
              </div>
              <h3 className="text-lg font-medium text-primary transition-colors group-hover:text-accent-foreground">
                {item.title}
              </h3>
              {item.summary && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {item.summary}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted hover:border-foreground/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>Explore All Engineering Systems & Case Studies</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Container>
  )
}
