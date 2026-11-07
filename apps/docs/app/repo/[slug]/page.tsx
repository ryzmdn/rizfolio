import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@workspace/ui/components/layouts/container"
import {
  getRepositoryBySlug,
  getRepoFiles,
  getAllRepoSlugs,
} from "../../../lib/queries"
import { incrementRepoView } from "../../../lib/actions"
import { RepoHeader } from "../../../components/repo-header"
import { FileTreeBrowser } from "../../../components/file-tree-browser"
import { ReadmeViewer } from "../../../components/readme-viewer"
import { Code2, BookOpen } from "lucide-react"
import {
  getBaseUrl,
  SEO_CONFIG,
  createBreadcrumbJsonLd,
} from "@workspace/ui/lib/seo"

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllRepoSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const repo = await getRepositoryBySlug(slug)

  if (!repo) {
    return {
      title: "Repository Not Found",
    }
  }

  const baseUrl = getBaseUrl("docs")
  const repoUrl = `${baseUrl}/repo/${slug}`

  const title = `${repo.name} — Technical Architecture & Code`
  const description =
    repo.description ||
    `Interactive documentation and source code for ${repo.name}.`

  return {
    title: `${title} | ${SEO_CONFIG.sites.docs.name}`,
    description,
    alternates: {
      canonical: repoUrl,
    },
    openGraph: {
      title,
      description,
      url: repoUrl,
      type: "article",
      images: [
        {
          url: SEO_CONFIG.author.avatar,
          width: 800,
          height: 800,
          alt: repo.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SEO_CONFIG.author.avatar],
    },
  }
}

export default async function RepoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ path?: string }>
}) {
  const { slug } = await params
  const { path = "" } = await searchParams

  const repo = await getRepositoryBySlug(slug)
  if (!repo) {
    notFound()
  }

  incrementRepoView(slug).catch((err: unknown) => {
    console.error(
      "[Docs Detail Page] Failed to increment repo view:",
      err instanceof Error ? err.message : String(err)
    )
  })

  const files = await getRepoFiles(repo.id, path)

  const baseUrl = getBaseUrl("docs")
  const repoUrl = `${baseUrl}/repo/${slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: repo.name,
    description: repo.description,
    codeRepository: repo.githubUrl || undefined,
    programmingLanguage: repo.techStack || undefined,
    license: repo.license || "MIT",
    url: repoUrl,
    author: {
      "@type": "Person",
      name: SEO_CONFIG.author.name,
      url: SEO_CONFIG.author.url,
    },
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Docs", url: baseUrl },
    { name: "Repositories", url: `${baseUrl}/categories` },
    { name: repo.name, url: repoUrl },
  ])

  return (
    <Container className="space-y-12 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <RepoHeader
        slug={repo.slug}
        name={repo.name}
        description={repo.description}
        category={repo.category}
        courseName={repo.courseName}
        semester={repo.semester}
        techStack={repo.techStack}
        starsCount={repo.starsCount}
        downloadsCount={repo.downloadsCount}
        viewsCount={repo.viewsCount}
        githubUrl={repo.githubUrl}
        demoUrl={repo.demoUrl}
        license={repo.license}
      />

      <div className="flex items-center gap-2 border-b border-foreground/8 pb-4 text-xs">
        <a
          href="#files"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
        >
          <Code2 className="size-3.5" />
          <span>Files ({files.length})</span>
        </a>

        {repo.readmeContent && (
          <a
            href="#readme"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 py-2 font-mono text-xs font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
          >
            <BookOpen className="size-3.5" />
            <span>README Documentation</span>
          </a>
        )}
      </div>

      <section id="files" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Code2 className="size-4 text-muted-foreground" />
            <h2 className="font-serif text-xl sm:text-2xl font-light tracking-tight">Source Code & File Hierarchy</h2>
          </div>
          <span className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1 font-mono text-[11px] text-muted-foreground">
            Branch: main
          </span>
        </div>
        <FileTreeBrowser slug={repo.slug} files={files} currentPath={path} />
      </section>

      {repo.readmeContent && (
        <section id="readme" className="scroll-mt-24 space-y-4 pt-8">
          <div className="flex items-center gap-2 text-foreground">
            <BookOpen className="size-4 text-muted-foreground" />
            <h2 className="font-serif text-xl sm:text-2xl font-light tracking-tight">Repository Overview & Architecture</h2>
          </div>
          <ReadmeViewer content={repo.readmeContent} />
        </section>
      )}
    </Container>
  )
}
