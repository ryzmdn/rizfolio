import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowUpRight, Sparkles, Filter, Code2 } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { getCaseStudies } from "@/lib/queries"
import { getBaseUrl, SEO_CONFIG, createBreadcrumbJsonLd } from "@workspace/ui/lib/seo"

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

      <div className="space-y-12 py-10 sm:py-16">
        <Container>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Overview</span>
          </Link>
        </Container>

        <Container className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3" />
            <span>Architecture & Engineering Portfolio</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Selected Works & Systems
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every case study reflects a rigorous engineering approach: from
            decoupling monolithic frontend dependencies and optimizing database
            query latency to deploying resilient serverless pipelines.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground pr-2">
              <Filter className="size-3" />
              <span>Disciplines:</span>
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-lg border border-border bg-card/60 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur-xs"
              >
                {cat}
              </span>
            ))}
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {caseStudies.map((item) => (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-foreground/30 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="size-4" />
                  </div>
                </div>

                <div className="mt-4 flex flex-1 flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      <span>{item.category}</span>
                      {item.year && <span>{item.year}</span>}
                    </div>

                    <h2 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h2>

                    {item.summary && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-border/50">
                    {item.metrics && Object.keys(item.metrics).length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {Object.entries(item.metrics)
                          .slice(0, 2)
                          .map(([k, v]) => (
                            <span
                              key={k}
                              className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                            >
                              <strong className="font-semibold">{String(v)}</strong> {k}
                            </span>
                          ))}
                      </div>
                    )}

                    {item.techStack && item.techStack.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Code2 className="size-3 text-muted-foreground" />
                        {item.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-sm border border-border/60 bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.techStack.length > 4 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{item.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>

        <Container>
          <div className="rounded-2xl border border-border/80 bg-card/60 p-8 text-center backdrop-blur-xs sm:p-12">
            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Ready to Architect Your Next System?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Available for high-stakes engineering projects, technical advisory,
              and full-stack production delivery.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/#call-to-action"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
              >
                <span>Initiate Engineering Discussion</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
