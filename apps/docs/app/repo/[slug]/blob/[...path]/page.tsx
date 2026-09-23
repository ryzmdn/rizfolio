import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FolderGit2 } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"
import {
  getRepositoryBySlug,
  getFileContent,
  getAllRepoSlugs,
  getAllRepoFilePaths,
} from "../../../../../lib/queries"
import { highlightCode } from "../../../../../lib/shiki"
import { CodeViewer } from "../../../../../components/code-viewer"
import { CopyPathButton } from "../../../../../components/copy-path-button"

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllRepoSlugs()
  const params: { slug: string; path: string[] }[] = []

  for (const slug of slugs) {
    const filePaths = await getAllRepoFilePaths(slug)
    for (const filePath of filePaths) {
      params.push({
        slug,
        path: filePath.split("/"),
      })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>
}): Promise<Metadata> {
  const { slug, path } = await params
  const filePath = path.join("/")
  const filename = path[path.length - 1] || filePath
  const repo = await getRepositoryBySlug(slug)

  if (!repo) {
    return {
      title: "File Not Found",
    }
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_DOCS_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://docs.rizkyramadhan.dev"

  const title = `${filename} (${filePath}) — ${repo.name}`
  const description = `Technical source code inspection for ${filePath} in repository ${repo.name}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/repo/${slug}/blob/${filePath}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function FileViewPage({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>
}) {
  const { slug, path } = await params
  const filePath = path.join("/")

  const repo = await getRepositoryBySlug(slug)
  if (!repo) {
    notFound()
  }

  const file = await getFileContent(repo.id, filePath)
  if (!file) {
    notFound()
  }

  const code = file.contentText || ""
  const highlightedHtml = await highlightCode(code, file.filename)

  const parentPath = path.length > 1 ? path.slice(0, -1).join("/") : ""
  const parentName = path.length > 1 ? path[path.length - 2] : repo.name

  return (
    <Container className="space-y-6 py-10">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link
            href={
              path.length > 1
                ? `/repo/${slug}?path=${encodeURIComponent(parentPath)}`
                : `/repo/${slug}`
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
            title={`Back to ${parentName}`}
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back to {parentName}</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <span className="text-border">|</span>

          <Link
            href="/"
            className="transition-colors hover:text-foreground text-xs uppercase tracking-wider"
          >
            Repositories
          </Link>

          <span>/</span>

          <Link
            href={`/repo/${slug}`}
            className="font-medium text-foreground transition-colors hover:text-foreground"
          >
            {repo.name}
          </Link>

          {path.map((segment, index) => {
            const isLast = index === path.length - 1
            const segmentPath = path.slice(0, index + 1).join("/")

            return (
              <span key={segmentPath} className="flex items-center gap-2">
                <span>/</span>
                {isLast ? (
                  <span className="font-mono font-medium text-foreground">
                    {segment}
                  </span>
                ) : (
                  <Link
                    href={`/repo/${slug}?path=${encodeURIComponent(segmentPath)}`}
                    className="font-mono text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {segment}
                  </Link>
                )}
              </span>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <CopyPathButton path={filePath} />

          <Link
            href={`/repo/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            title="Browse all repository files and documentation"
          >
            <FolderGit2 className="size-3.5" />
            <span className="hidden sm:inline">Repository Overview</span>
            <span className="sm:hidden">Repo</span>
          </Link>
        </div>
      </div>

      <CodeViewer
        filename={file.filename}
        code={code}
        highlightedHtml={highlightedHtml}
        sizeBytes={file.sizeBytes}
      />
    </Container>
  )
}
