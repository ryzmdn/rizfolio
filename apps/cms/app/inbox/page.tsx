import { CmsPageShell } from "@/components/cms-page-shell"
import { getInquiriesAdmin, getInquiryStats } from "@/lib/actions/inbox-actions"
import { InboxManagerClient } from "@/components/inbox/inbox-manager-client"
import { Inbox, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CmsInboxPage() {
  const [inquiries, stats] = await Promise.all([
    getInquiriesAdmin(),
    getInquiryStats(),
  ])

  return (
    <CmsPageShell
      title="Client Inquiries & Project Inbox"
      description="Direct proposals, incoming engineering contracts, and consultation messages dispatched from apps/portfolio."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Inquiries
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Inbox className="size-4" />
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
                New &amp; Unread
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <AlertCircle className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.newCount}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                In Review
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Clock className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.inReviewCount}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Responded &amp; Closed
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.respondedCount}
              </span>
            </div>
          </div>
        </div>

        <InboxManagerClient initialInquiries={inquiries} />
      </div>
    </CmsPageShell>
  )
}
