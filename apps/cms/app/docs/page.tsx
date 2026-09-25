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
      title="Documentation & Code Explorer Manager"
      description="Kelola repositori sumber terbuka, penjelajah pohon berkas kode, dan arsip rilis perangkat lunak."
    >
      <DocsManagerView
        repositories={repositories}
        files={files}
        releases={releases}
      />
    </CmsPageShell>
  )
}
