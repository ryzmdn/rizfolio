import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  Layers,
  Award,
  BarChart3,
  CheckCircle2,
  Eye,
} from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"
import { Container } from "@workspace/ui/components/layouts"
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
  getCaseStudies,
} from "@/lib/queries"
import { CaseStudyTracker } from "@/components/case-study-tracker"
import { getBaseUrl, SEO_CONFIG } from "@workspace/ui/lib/seo"

interface CaseStudyPageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudyBySlug(slug)

  if (!study) {
    return { title: "Case Study Not Found" }
  }

  const baseUrl = getBaseUrl("portfolio")
  const pageUrl = `${baseUrl}/work/${study.slug}`
  const ogImage = study.image || SEO_CONFIG.author.avatar

  return {
    title: `${study.title} | Case Studies | ${SEO_CONFIG.author.name}`,
    description: study.summary,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: study.title,
      description: study.summary,
      type: "article",
      url: pageUrl,
      images: [{ url: ogImage, alt: study.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.summary,
      images: [ogImage],
    },
  }
}

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyPageProps) {
  const { slug } = await params
  const [study, allStudies] = await Promise.all([
    getCaseStudyBySlug(slug),
    getCaseStudies(),
  ])

  if (!study) {
    notFound()
  }

  const currentIndex = allStudies.findIndex((s) => s.slug === study.slug)
  const prevStudy = currentIndex > 0 ? allStudies[currentIndex - 1] : null
  const nextStudy =
    currentIndex < allStudies.length - 1 ? allStudies[currentIndex + 1] : null

  const baseUrl = getBaseUrl("portfolio")
  const pageUrl = `${baseUrl}/work/${study.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    headline: study.title,
    description: study.summary,
    image: study.image,
    url: pageUrl,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
  }

  return (
    <>
      <CaseStudyTracker caseStudyId={study.id} slug={study.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="space-y-16 py-16 sm:py-24">
        <Container className="space-y-8">
          <Link
            href="/work"
            prefetch={true}
            className="group inline-flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Works Archive</span>
          </Link>

          <div className="space-y-6 border-b border-foreground/6 pb-8">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="rounded-full border border-foreground/15 bg-foreground/[0.02] px-3 py-1 text-[10px] tracking-widest text-foreground uppercase">
                {study.category}
              </span>
              {study.year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3 text-muted-foreground" />
                  {study.year}
                </span>
              )}
              {study.clientName && (
                <span>• {study.clientName}</span>
              )}
              {study.viewsCount !== undefined && study.viewsCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3 text-muted-foreground" />
                  {study.viewsCount} views
                </span>
              )}
            </div>

            <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {study.title}
            </h1>

            <p className="max-w-3xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
              {study.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {study.liveUrl && (
                <a
                  href={study.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-xs tracking-wider text-background uppercase shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Launch Live System</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              {study.repoUrl && (
                <a
                  href={study.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-6 py-2.5 font-mono text-xs tracking-wider text-foreground uppercase transition-colors hover:border-foreground/40"
                >
                  <GitHub className="size-3.5" />
                  <span>Source Archive</span>
                </a>
              )}
              {study.role && (
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground sm:ml-auto">
                  <Award className="size-3.5" />
                  <span>ROLE: {study.role}</span>
                </div>
              )}
            </div>
          </div>
        </Container>

        <Container>
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-3xl border border-foreground/15 bg-muted shadow-2xl sm:aspect-21/9">
            <Image
              src={study.image}
              alt={study.title}
              fill
              priority
              quality={90}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </Container>

        {study.metrics && Object.keys(study.metrics).length > 0 && (
          <Container>
            <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.01] p-8 sm:p-12">
              <div className="mb-6 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <BarChart3 className="size-4 text-foreground" />
                <span>ARCHITECTURAL BENCHMARKS & VERIFIABLE OUTCOMES</span>
              </div>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {Object.entries(study.metrics).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex flex-col space-y-1 border-t border-foreground/8 pt-4"
                  >
                    <span className="font-mono text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                      {String(val)}
                    </span>
                    <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        )}

        {study.techStack && study.techStack.length > 0 && (
          <Container>
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <Layers className="size-3.5 text-foreground" />
                <span>SYSTEM & COMPONENT ARCHITECTURE STACK</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {study.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-3.5 py-1 font-mono text-xs text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        )}

        {study.contentMd && (
          <Container>
            <div className="mx-auto max-w-[68ch] rounded-3xl border border-foreground/8 bg-foreground/[0.01] p-8 sm:p-14">
              <div className="space-y-8 leading-relaxed font-light text-foreground/90">
                {study.contentMd.split("\n\n").map((block, idx) => {
                  if (block.startsWith("## ")) {
                    return (
                      <h2
                        key={idx}
                        className="pt-4 text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
                      >
                        {block.replace("## ", "")}
                      </h2>
                    )
                  }
                  if (block.startsWith("### ")) {
                    return (
                      <h3
                        key={idx}
                        className="pt-2 text-xl font-medium tracking-tight text-foreground"
                      >
                        {block.replace("### ", "")}
                      </h3>
                    )
                  }
                  if (block.startsWith("* ")) {
                    const items = block
                      .split("\n")
                      .map((line) => line.replace(/^\* /, ""))
                    return (
                      <ul key={idx} className="space-y-2.5 pl-2 text-sm">
                        {items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2.5 text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-foreground/50" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (block.startsWith("1. ")) {
                    const items = block
                      .split("\n")
                      .map((line) => line.replace(/^\d+\.\s*/, ""))
                    return (
                      <ol
                        key={idx}
                        className="list-decimal space-y-2.5 pl-6 text-sm text-muted-foreground"
                      >
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ol>
                    )
                  }
                  return (
                    <p
                      key={idx}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {block}
                    </p>
                  )
                })}
              </div>
            </div>
          </Container>
        )}

        <Container>
          <div className="grid grid-cols-1 gap-6 border-t border-foreground/8 pt-10 sm:grid-cols-2">
            {prevStudy ? (
              <Link
                href={`/work/${prevStudy.slug}`}
                prefetch={true}
                className="group flex flex-col items-start rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-6 transition-all hover:border-foreground/30"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
                  <span>PREVIOUS SYSTEM</span>
                </div>
                <span className="mt-2 text-base font-medium text-foreground">
                  {prevStudy.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextStudy && (
              <Link
                href={`/work/${nextStudy.slug}`}
                prefetch={true}
                className="group flex flex-col items-end rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-6 text-right transition-all hover:border-foreground/30"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <span>NEXT SYSTEM</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
                <span className="mt-2 text-base font-medium text-foreground">
                  {nextStudy.title}
                </span>
              </Link>
            )}
          </div>
        </Container>
      </article>
    </>
  )
}
