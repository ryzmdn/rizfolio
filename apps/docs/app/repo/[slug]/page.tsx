import { notFound } from "next/navigation"
import { Container } from "@workspace/ui/components/layouts/container"
import { getRepositoryBySlug, getRepoFiles } from "../../../lib/queries"
import { incrementRepoView } from "../../../lib/actions"
import { RepoHeader } from "../../../components/repo-header"
import { FileTreeBrowser } from "../../../components/file-tree-browser"
import { ReadmeViewer } from "../../../components/readme-viewer"

export const dynamic = "force-dynamic"

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

  // Increment view on server render
  incrementRepoView(slug).catch((err: unknown) => {
    console.error(
      "[Docs Detail Page] Failed to increment repo view:",
      err instanceof Error ? err.message : String(err)
    )
  })

  const files = await getRepoFiles(repo.id, path)

  return (
    <Container className="space-y-8 py-10">
      {/* Header */}
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
        githubUrl={repo.githubUrl}
        demoUrl={repo.demoUrl}
        license={repo.license}
      />

      {/* File Tree Browser */}
      <div className="space-y-4">
        <h2 className="text-sm font-medium text-foreground">Files</h2>
        <FileTreeBrowser slug={repo.slug} files={files} currentPath={path} />
      </div>

      {/* README.md Viewer */}
      {repo.readmeContent && (
        <div className="space-y-4 pt-4">
          <ReadmeViewer content={repo.readmeContent} />
        </div>
      )}
    </Container>
  )
}
