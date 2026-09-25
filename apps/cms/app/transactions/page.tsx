import { CmsPageShell } from "../../components/cms-page-shell"
import {
  getMasterTransactions,
  getMasterTransactionStats,
} from "../../lib/actions/transaction-actions"
import {
  Activity,
  Receipt,
  CheckCircle2,
  Search,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { TransactionLedgerTable } from "../../components/transactions/transaction-ledger-table"

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

  return (
    <CmsPageShell
      title="Master Transactions & System Ledger"
      description="Pusat audit trail, pencatatan transaksi terpadu, dan rekonsiliasi data lintas 7 domain monorepo."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total Transaction Events
              </span>
              <Activity className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {stats.total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Execution Success Rate
              </span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {stats.successRate}%
              </span>
              <span className="text-xs text-muted-foreground">
                ({stats.completed} berhasil)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Settled Commerce Volume
              </span>
              <Receipt className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                Rp {stats.commerceVolume.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Audit Domains Tracked
              </span>
              <Layers className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                7
              </span>
              <span className="text-xs text-muted-foreground">
                Domains Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <form className="flex flex-1 items-center gap-2" method="GET">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Cari nomor TRX, aksi, atau entitas ID..."
                className="w-full rounded-lg border border-border bg-background py-2 pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-hidden"
              />
            </div>

            <select
              name="domain"
              defaultValue={domain || "ALL"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-foreground/40 focus:outline-hidden"
            >
              <option value="ALL">Semua Domain</option>
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
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-foreground/40 focus:outline-hidden"
            >
              <option value="ALL">Semua Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REVERTED">Reverted</option>
            </select>

            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Filter
            </button>

            {(domain || status || search) && (
              <Link
                href="/transactions"
                className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Reset
              </Link>
            )}
          </form>

          <div className="text-xs text-muted-foreground">
            Menampilkan{" "}
            <span className="font-medium text-foreground">{items.length}</span>{" "}
            dari <span className="font-medium text-foreground">{total}</span>{" "}
            transaksi
          </div>
        </div>

        <TransactionLedgerTable transactions={items} />
      </div>
    </CmsPageShell>
  )
}
