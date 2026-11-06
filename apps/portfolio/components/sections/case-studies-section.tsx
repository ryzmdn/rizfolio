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

  const [featuredItem, ...secondaryItems] = items

  return (
    <Container id="case-studies" className="py-24 md:py-36">
      <div className="space-y-16 lg:space-y-24">
        <div className="flex flex-col gap-6 border-b border-foreground/6 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
              [ 02 / SELECTED WORKS & SYSTEMS ]
            </span>
            <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Architectural initiatives with verifiable impact.
            </h2>
          </div>
          <Link
            href="/work"
            prefetch={true}
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <span>All Works ({items.length})</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {featuredItem && (
          <Link
            href={`/work/${featuredItem.slug}`}
            prefetch={true}
            className="group relative block overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-700 hover:border-foreground/30 hover:shadow-2xl"
          >
            <div className="relative aspect-16/9 w-full overflow-hidden sm:aspect-21/9">
              <Image
                src={featuredItem.image}
                alt={featuredItem.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
              
              <div className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full border border-foreground/20 bg-background/80 text-foreground backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-foreground group-hover:text-background">
                <ArrowUpRight className="size-4" />
              </div>

              <div className="absolute inset-x-6 bottom-6 flex flex-col justify-end gap-3 sm:inset-x-10 sm:bottom-10 sm:gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-foreground/20 bg-background/60 px-3 py-1 font-mono text-[10px] tracking-widest text-foreground uppercase backdrop-blur-md">
                    FEATURED ARCHITECTURE
                  </span>
                  <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {featuredItem.category}
                  </span>
                  {featuredItem.year && (
                    <>
                      <span className="text-foreground/30">•</span>
                      <span className="font-mono text-xs text-muted-foreground">{featuredItem.year}</span>
                    </>
                  )}
                </div>

                <h3 className="text-2xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {featuredItem.title}
                </h3>

                {featuredItem.summary && (
                  <p className="max-w-3xl line-clamp-2 text-sm font-light text-muted-foreground sm:text-base">
                    {featuredItem.summary}
                  </p>
                )}
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {secondaryItems.slice(0, 4).map((item, index) => (
            <Link
              key={item.id}
              href={`/work/${item.slug}`}
              prefetch={true}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-6 transition-all duration-500 hover:border-foreground/25 hover:bg-foreground/[0.02] sm:p-8"
            >
              <div className="space-y-6">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-foreground/8 bg-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full border border-foreground/15 bg-background/80 text-foreground backdrop-blur-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                    <span>{item.category}</span>
                    <span>0{index + 2}</span>
                  </div>

                  <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-2xl">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="line-clamp-2 text-xs font-light leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 pt-4 font-mono text-[11px] tracking-wider text-foreground/70 uppercase">
                <span>View Architecture</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center border-t border-foreground/6 pt-12">
          <Link
            href="/work"
            prefetch={true}
            className="group inline-flex items-center gap-3 rounded-full border border-foreground/15 px-8 py-3.5 font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:border-foreground/50 hover:bg-foreground hover:text-background"
          >
            <span>Explore All Systems Archive</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
