import { CmsPageShell } from "@/components/cms-page-shell"
import { MediaBrowserView } from "@/components/media/media-browser-view"
import { listMediaAssets } from "@/lib/actions/media-browser-actions"

export const dynamic = "force-dynamic"

export default async function MediaLibraryPage() {
  const assets = await listMediaAssets()

  return (
    <CmsPageShell
      title="Media Library Asset Browser & Storage Hub"
      description="Kelola aset visual, penjelajah folder penyimpanan, tautan CDN global, dan utilitas unggah drag-and-drop."
    >
      <MediaBrowserView initialAssets={assets} />
    </CmsPageShell>
  )
}
