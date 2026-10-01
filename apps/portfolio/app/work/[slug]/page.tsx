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
} from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"
import { Container } from "@workspace/ui/components/layouts"
import {
  getCaseStudyBySlug,
  getAllCaseStudySlugs,
  getCaseStudies,
} from "@/lib/queries"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="space-y-12 py-10 sm:py-16">
        <Container>
          <Link
            href="/work"
            prefetch={true}
            className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Case Studies</span>
          </Link>
        </Container>

        <Container className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
              {study.category}
            </span>
            {study.year && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {study.year}
              </span>
            )}
            {study.clientName && (
              <span className="text-xs text-muted-foreground">
                • {study.clientName}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {study.title}
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {study.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
              >
                <span>Live Project Demo</span>
                <ExternalLink className="size-3.5" />
              </a>
            )}
            {study.repoUrl && (
              <a
                href={study.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <GitHub className="size-3.5" />
                <span>Source Code</span>
              </a>
            )}
            {study.role && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:ml-auto">
                <Award className="size-3.5" />
                <span>Role: {study.role}</span>
              </div>
            )}
          </div>
        </Container>

        <Container>
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-muted shadow-xl ring-1 ring-border">
            <Image
              src={study.image}
              alt={study.title}
              fill
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
              className="object-cover"
            />
          </div>
        </Container>

        {study.metrics && Object.keys(study.metrics).length > 0 && (
          <Container>
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-xs sm:p-8">
              <div className="mb-6 flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <BarChart3 className="size-4 text-primary" />
                <span>Verifiable Architectural Benchmarks</span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Object.entries(study.metrics).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex flex-col rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {String(val)}
                    </span>
                    <span className="mt-1 text-xs font-medium text-muted-foreground">
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
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <Layers className="size-3.5 text-primary" />
                <span>Technologies & Framework Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {study.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/30"
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
            <div className="prose prose-neutral dark:prose-invert max-w-none rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-10">
              <div className="space-y-6 leading-relaxed">
                {study.contentMd.split("\n\n").map((block, idx) => {
                  if (block.startsWith("## ")) {
                    return (
                      <h2
                        key={idx}
                        className="text-2xl font-bold tracking-tight text-foreground"
                      >
                        {block.replace("## ", "")}
                      </h2>
                    )
                  }
                  if (block.startsWith("### ")) {
                    return (
                      <h3
                        key={idx}
                        className="text-xl font-semibold tracking-tight text-foreground"
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
                      <ul key={idx} className="space-y-2 pl-4">
                        {items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-emerald-500" />
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
                        className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground"
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
                      className="text-sm leading-relaxed text-muted-foreground sm:text-base"
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
          <div className="grid grid-cols-1 gap-4 border-t border-border/80 pt-8 sm:grid-cols-2">
            {prevStudy ? (
              <Link
                href={`/work/${prevStudy.slug}`}
                prefetch={true}
                className="group flex flex-col items-start rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
                  <span>Previous Case Study</span>
                </div>
                <span className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary">
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
                className="group flex flex-col items-end rounded-xl border border-border/70 bg-card p-5 text-right transition-colors hover:border-foreground/30 hover:bg-muted"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Next Case Study</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
                <span className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary">
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
