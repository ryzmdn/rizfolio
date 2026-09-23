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

  const baseUrl =
    process.env.NEXT_PUBLIC_DOCS_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://docs.rizkyramadhan.dev"

  const title = `${repo.name} — Technical Architecture & Code`
  const description =
    repo.description ||
    `Interactive documentation and source code for ${repo.name}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/repo/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  // Increment view on server render asynchronously
  incrementRepoView(slug).catch((err: unknown) => {
    console.error(
      "[Docs Detail Page] Failed to increment repo view:",
      err instanceof Error ? err.message : String(err)
    )
  })

  const files = await getRepoFiles(repo.id, path)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: repo.name,
    description: repo.description,
    codeRepository: repo.githubUrl || undefined,
    programmingLanguage: repo.techStack || undefined,
    license: repo.license || "MIT",
    author: {
      "@type": "Person",
      name: "Rizky Ramadhan",
      url: "https://rizkyramadhan.dev",
    },
  }

  return (
    <Container className="space-y-10 py-10">
      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Repository Header */}
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

      {/* Quick Jump Anchor Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3 text-xs">
        <a
          href="#files"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Code2 className="size-3.5" />
          <span>Files ({files.length})</span>
        </a>

        {repo.readmeContent && (
          <a
            href="#readme"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-muted"
          >
            <BookOpen className="size-3.5" />
            <span>README Documentation</span>
          </a>
        )}
      </div>

      {/* File Tree Browser Section */}
      <section id="files" className="space-y-3 scroll-mt-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Code2 className="size-4" />
            <h2>Source Code & File Hierarchy</h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Branch: main
          </span>
        </div>
        <FileTreeBrowser slug={repo.slug} files={files} currentPath={path} />
      </section>

      {/* README.md Viewer Section with Table of Contents */}
      {repo.readmeContent && (
        <section id="readme" className="space-y-3 pt-6 scroll-mt-24">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="size-4" />
            <h2>Repository Overview & Architecture</h2>
          </div>
          <ReadmeViewer content={repo.readmeContent} />
        </section>
      )}
    </Container>
  )
}
