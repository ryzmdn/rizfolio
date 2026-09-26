import { CmsPageShell } from "@/components/cms-page-shell"
import { DocsManagerView } from "@/components/docs/docs-manager-view"
import {
  getAdminRepositories,
  getAllAdminRepoFiles,
  getAllAdminRepoReleases,
} from "@/lib/actions/docs-actions"

export const dynamic = "force-dynamic"

export default async function DocsManagerPage() {
  const [repositories, files, releases] = await Promise.all([
    getAdminRepositories(),
    getAllAdminRepoFiles(),
    getAllAdminRepoReleases(),
  ])

  return (
    <CmsPageShell
      title="Documentation & Repositories Manager"
      description="Manage open-source repositories, technical documentation, releases, and files."
    >
      <DocsManagerView
        repositories={repositories}
        files={files}
        releases={releases}
      />
    </CmsPageShell>
  )
}
