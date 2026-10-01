import { CmsPageShell } from "@/components/cms-page-shell"
import { MediaBrowserView } from "@/components/media/media-browser-view"
import { listMediaAssets } from "@/lib/actions/media-browser-actions"

export const dynamic = "force-dynamic"

export default async function MediaLibraryPage() {
  const assets = await listMediaAssets("all")

  return (
    <CmsPageShell
      title="Media & Storage Assets"
      description="Upload, organize, and manage media assets stored on Supabase Storage global CDN."
    >
      <MediaBrowserView initialAssets={assets} />
    </CmsPageShell>
  )
}
