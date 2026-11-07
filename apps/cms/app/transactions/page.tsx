import { CmsPageShell } from "@/components/cms-page-shell"
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
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl transition-all hover:border-foreground/25 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Total Events
              </span>
              <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-muted-foreground">
                <Activity className="size-4" />
              </div>
            </div>
            <div className="mt-6">
              <span className="font-serif text-3xl font-light tracking-tight text-foreground tabular-nums">
                {stats.total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl transition-all hover:border-foreground/25 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Success Rate
              </span>
              <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-muted-foreground">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-light tracking-tight text-foreground tabular-nums">
                {stats.successRate}%
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ({stats.completed} done)
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl transition-all hover:border-foreground/25 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Commerce Volume
              </span>
              <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-muted-foreground">
                <Receipt className="size-4" />
              </div>
            </div>
            <div className="mt-6">
              <span className="font-serif text-3xl font-light tracking-tight text-foreground tabular-nums">
                Rp {stats.commerceVolume.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl transition-all hover:border-foreground/25 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Domains Tracked
              </span>
              <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-muted-foreground">
                <Layers className="size-4" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="font-serif text-3xl font-light tracking-tight text-foreground tabular-nums">
                7
              </span>
              <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                Active Domains
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-foreground/8 bg-card/40 p-4 sm:p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <form
            className="flex flex-1 flex-wrap items-center gap-2.5"
            method="GET"
          >
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search TRX ref, action type, or entity ID..."
                className="h-9 w-full rounded-full border border-foreground/10 bg-background/60 py-1.5 pr-4 pl-9 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-hidden"
              />
            </div>

            <select
              name="domain"
              defaultValue={domain || "ALL"}
              className="h-9 rounded-full border border-foreground/10 bg-background/60 px-3.5 py-1.5 font-mono text-xs text-foreground focus:border-foreground/30 focus:outline-hidden"
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
              className="h-9 rounded-full border border-foreground/10 bg-background/60 px-3.5 py-1.5 font-mono text-xs text-foreground focus:border-foreground/30 focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REVERTED">Reverted</option>
            </select>

            <button
              type="submit"
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-foreground bg-foreground px-4 text-xs font-mono text-background transition-all hover:bg-foreground/90"
            >
              <Filter className="size-3" />
              <span>Filter</span>
            </button>

            {hasActiveFilters && (
              <Link
                href="/transactions"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3.5 text-xs font-mono text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </Link>
            )}
          </form>

          <div className="shrink-0 font-mono text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{items.length}</span>{" "}
            of <span className="font-medium text-foreground">{total}</span>{" "}
            records
          </div>
        </div>

        <TransactionLedgerTable transactions={items} />
      </div>
    </CmsPageShell>
  )
}
