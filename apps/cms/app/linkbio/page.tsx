import { CmsPageShell } from "@/components/cms-page-shell"
import { getBioLinksAdmin, getBioLinkStats } from "@/lib/actions/linkbio-actions"
import { LinkbioManagerClient } from "@/components/linkbio/linkbio-manager-client"
import { Link2, MousePointerClick, CheckCircle2, Globe } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CmsLinkbioPage() {
  const [links, stats] = await Promise.all([
    getBioLinksAdmin(),
    getBioLinkStats(),
  ])

  return (
    <CmsPageShell
      title="Linkbio Ecosystem Manager"
      description="Manage public links, ecosystem routing, featured articles, and click performance on apps/linkbio."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Bio Links
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Link2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.total}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Active on Public Bio
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.active}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Click Events
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <MousePointerClick className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.totalClicks}
              </span>
            </div>
          </div>
        </div>

        <LinkbioManagerClient initialLinks={links} />
      </div>
    </CmsPageShell>
  )
}
