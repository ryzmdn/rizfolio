import { notFound } from "next/navigation"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { getRepositoryBySlug, getFileContent } from "../../../../../lib/queries"
import { highlightCode } from "../../../../../lib/shiki"
import { CodeViewer } from "../../../../../components/code-viewer"

export const dynamic = "force-dynamic"

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

  return (
    <Container className="space-y-6 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-4 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          archive
        </Link>
        <span>/</span>
        <Link
          href={`/repo/${slug}`}
          className="font-medium text-foreground transition-colors hover:text-foreground"
        >
          {slug}
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

      {/* Code Viewer */}
      <CodeViewer
        filename={file.filename}
        code={code}
        highlightedHtml={highlightedHtml}
        sizeBytes={file.sizeBytes}
      />
    </Container>
  )
}
