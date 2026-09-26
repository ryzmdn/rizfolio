import { CmsPageShell } from "@/components/cms-page-shell"
import { Badge } from "@workspace/ui/components/badge"
import {
  getMasterTransactions,
  getMasterTransactionStats,
} from "@/lib/actions/transaction-actions"
import { TransactionLedgerTable } from "@/components/transactions/transaction-ledger-table"
import {
  Activity,
  Receipt,
  CheckCircle2,
  Search,
  Layers,
  Filter,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; status?: string; search?: string }>
}) {
  const { domain, status, search } = await searchParams

  const [{ items, total }, stats] = await Promise.all([
    getMasterTransactions({
      domain: domain || undefined,
      status: status || undefined,
      search: search || undefined,
      limit: 100,
    }),
    getMasterTransactionStats(),
  ])

  const hasActiveFilters = Boolean(domain || status || search)

  return (
    <CmsPageShell
      title="Master Transactions & System Ledger"
      description="Central audit trail, unified transaction recording, and data reconciliation across all monorepo domains."
    >
      <div className="space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs transition-colors hover:border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Transaction Events
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs transition-colors hover:border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Execution Success Rate
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {stats.successRate}%
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                ({stats.completed} succeeded)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs transition-colors hover:border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Settled Commerce Volume
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Receipt className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                Rp {stats.commerceVolume.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-xs transition-colors hover:border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Audit Domains Tracked
              </span>
              <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <Layers className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                7
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                Active Domains
              </Badge>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
          <form className="flex flex-1 flex-wrap items-center gap-2.5" method="GET">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search TRX ref, action type, or entity ID..."
                className="h-9 w-full rounded-lg border border-border bg-background py-1.5 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
              />
            </div>

            <select
              name="domain"
              defaultValue={domain || "ALL"}
              className="h-9 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
            >
              <option value="ALL">All Domains</option>
              <option value="COMMERCE">Commerce</option>
              <option value="CONTENT">Content & Blog</option>
              <option value="PORTFOLIO">Portfolio</option>
              <option value="CODE_DOCS">Docs & Repo</option>
              <option value="AUTH_SECURITY">Security & Auth</option>
              <option value="SYSTEM">System</option>
            </select>

            <select
              name="status"
              defaultValue={status || "ALL"}
              className="h-9 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REVERTED">Reverted</option>
            </select>

            <button
              type="submit"
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Filter className="size-3" />
              Filter
            </button>

            {hasActiveFilters && (
              <Link
                href="/transactions"
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Reset
              </Link>
            )}
          </form>

          <div className="font-mono text-xs text-muted-foreground shrink-0">
            Showing <span className="font-medium text-foreground">{items.length}</span> of{" "}
            <span className="font-medium text-foreground">{total}</span> records
          </div>
        </div>

        {/* Master Transaction Ledger Table with Detail Drawer & Export */}
        <TransactionLedgerTable transactions={items} />
      </div>
    </CmsPageShell>
  )
}
