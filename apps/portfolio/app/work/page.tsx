import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, Filter, Code2 } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { getCaseStudies } from "@/lib/queries"
import {
  getBaseUrl,
  SEO_CONFIG,
  createBreadcrumbJsonLd,
} from "@workspace/ui/lib/seo"

export const revalidate = 3600

const baseUrl = getBaseUrl("portfolio")
const pageUrl = `${baseUrl}/work`

export const metadata: Metadata = {
  title: `Case Studies & Engineering Systems | ${SEO_CONFIG.author.name}`,
  description:
    "Comprehensive technical case studies spanning distributed systems, component architecture, cloud automation, and digital commerce platforms.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Case Studies & Engineering Systems | ${SEO_CONFIG.author.name}`,
    description:
      "A curated repository of engineering initiatives focused on high throughput, architectural clarity, and verifiable business impact.",
    type: "website",
    url: pageUrl,
    images: [{ url: SEO_CONFIG.author.avatar, alt: SEO_CONFIG.author.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Case Studies & Engineering Systems | ${SEO_CONFIG.author.name}`,
    description:
      "Comprehensive technical case studies spanning distributed systems, component architecture, and cloud automation.",
    images: [SEO_CONFIG.author.avatar],
  },
}

export default async function WorkIndexPage() {
  const caseStudies = await getCaseStudies()
  const categories = Array.from(new Set(caseStudies.map((s) => s.category)))

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", url: baseUrl },
    { name: "Work & Case Studies", url: pageUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="space-y-16 py-16 sm:py-24">
        <Container className="space-y-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Overview</span>
          </Link>

          <div className="space-y-4 border-b border-foreground/6 pb-8">
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
              [ ARCHITECTURE ARCHIVE ]
            </span>
            <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl">
              Selected Works & Systems.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed font-light text-muted-foreground">
              Every system reflects an uncompromising engineering approach:
              decoupling monolithic dependencies, optimizing database
              transaction budgets, and delivering sub-second edge execution.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-4">
              <span className="inline-flex items-center gap-1.5 pr-2 font-mono text-xs text-muted-foreground uppercase">
                <Filter className="size-3" />
                <span>Disciplines:</span>
              </span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] tracking-wider text-foreground uppercase"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {caseStudies.map((item, index) => (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                prefetch={true}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.01] p-6 transition-all duration-500 hover:border-foreground/30 hover:bg-foreground/[0.02] sm:p-8"
              >
                <div className="space-y-6">
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-foreground/8 bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-3.5 right-3.5 flex size-9 items-center justify-center rounded-full border border-foreground/15 bg-background/85 text-foreground backdrop-blur-md transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="size-4" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                      <span>{item.category}</span>
                      <span>{item.year || `0${index + 1}`}</span>
                    </div>

                    <h2 className="text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
                      {item.title}
                    </h2>

                    {item.summary && (
                      <p className="line-clamp-2 text-xs leading-relaxed font-light text-muted-foreground sm:text-sm">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-3 border-t border-foreground/6 pt-4">
                  {item.metrics && Object.keys(item.metrics).length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {Object.entries(item.metrics)
                        .slice(0, 2)
                        .map(([k, v]) => (
                          <span
                            key={k}
                            className="rounded-md border border-foreground/8 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] text-foreground"
                          >
                            <strong>{String(v)}</strong> {k}
                          </span>
                        ))}
                    </div>
                  )}

                  {item.techStack && item.techStack.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Code2 className="size-3 text-muted-foreground" />
                      {item.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-sm font-mono text-[10px] text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Container>

        <Container>
          <div className="rounded-3xl border border-foreground/15 bg-foreground/[0.02] p-8 text-center sm:p-14">
            <h3 className="text-2xl font-light tracking-tight text-foreground sm:text-4xl">
              Initiate an Architectural Engagement
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed font-light text-muted-foreground sm:text-sm">
              Available for technical advisory, distributed systems engineering,
              and dedicated platform contracts.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/#call-to-action"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-3.5 font-mono text-xs tracking-widest text-background uppercase shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Initiate Discussion</span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
