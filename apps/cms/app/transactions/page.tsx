import { CmsPageShell } from "../../components/cms-page-shell"
import { Badge } from "@workspace/ui/components/badge"
import {
  getMasterTransactions,
  getMasterTransactionStats,
} from "../../lib/actions/transaction-actions"
import {
  Activity,
  Receipt,
  CheckCircle2,
  Search,
  Shield,
  Layers,
  FileText,
  ShoppingBag,
  BookOpen,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

const domainBadges: Record<
  string,
  {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
    icon: LucideIcon
  }
> = {
  COMMERCE: { label: "Commerce", variant: "default", icon: ShoppingBag },
  CONTENT: { label: "Blog & Content", variant: "secondary", icon: FileText },
  PORTFOLIO: { label: "Portfolio", variant: "secondary", icon: Layers },
  CODE_DOCS: { label: "Docs & Repo", variant: "outline", icon: BookOpen },
  AUTH_SECURITY: {
    label: "Security & Auth",
    variant: "destructive",
    icon: Shield,
  },
  SYSTEM: { label: "System", variant: "outline", icon: Activity },
}

const statusBadges: Record<
  string,
  {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
  }
> = {
  COMPLETED: { label: "Completed", variant: "default" },
  PENDING: { label: "Pending", variant: "outline" },
  FAILED: { label: "Failed", variant: "destructive" },
  REVERTED: { label: "Reverted", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "outline" },
}

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

        <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
          <div className="border-b border-border/80 px-6 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Master Ledger Records
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 bg-muted/40 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3.5">Transaction Ref</th>
                  <th className="px-6 py-3.5">Domain</th>
                  <th className="px-6 py-3.5">Action & Entity</th>
                  <th className="px-6 py-3.5">Actor</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      Belum ada catatan transaksi master yang sesuai dengan
                      filter.
                    </td>
                  </tr>
                ) : (
                  items.map((trx) => {
                    const domBadge = domainBadges[trx.domain] || {
                      label: trx.domain,
                      variant: "outline" as const,
                      icon: Layers,
                    }
                    const statBadge = statusBadges[trx.status] || {
                      label: trx.status,
                      variant: "outline" as const,
                    }
                    const Icon = domBadge.icon

                    return (
                      <tr
                        key={trx.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-medium text-foreground">
                          {trx.trxNumber}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={domBadge.variant}
                            className="gap-1 text-xs"
                          >
                            <Icon className="size-3" />
                            <span>{domBadge.label}</span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="font-medium text-foreground">
                              {trx.actionType}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {trx.entityType}: {trx.entityId.substring(0, 18)}
                              {trx.entityId.length > 18 ? "..." : ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          <span className="rounded bg-secondary/80 px-2 py-0.5 font-mono text-[11px] text-foreground">
                            {trx.actorType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-foreground">
                          {trx.amount && trx.amount > 0 ? (
                            `Rp ${trx.amount.toLocaleString("id-ID")}`
                          ) : (
                            <span className="text-muted-foreground/60">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={statBadge.variant}
                            className="text-xs"
                          >
                            {statBadge.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-muted-foreground">
                          {new Date(trx.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CmsPageShell>
  )
}
