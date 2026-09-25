"use client"

import { useState } from "react"
import {
  Layers,
  FileText,
  ShoppingBag,
  BookOpen,
  Shield,
  Activity,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import type { MasterTransaction } from "@workspace/db"
import { TransactionDetailDrawer } from "./transaction-detail-drawer"
import { TransactionExportButton } from "./transaction-export-button"

interface TransactionLedgerTableProps {
  transactions: MasterTransaction[]
}

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

export function TransactionLedgerTable({
  transactions,
}: TransactionLedgerTableProps) {
  const [selectedTrx, setSelectedTrx] = useState<MasterTransaction | null>(null)

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Master Ledger Records
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Klik pada baris transaksi untuk melihat metadata dan inspeksi JSON diff.
            </p>
          </div>

          <TransactionExportButton transactions={transactions} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3.5">Ref Transaksi</th>
                <th className="px-6 py-3.5">Domain</th>
                <th className="px-6 py-3.5">Aksi & Entitas</th>
                <th className="px-6 py-3.5">Aktor</th>
                <th className="px-6 py-3.5">Nilai Transaksi</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Waktu</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Belum ada catatan transaksi master yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => {
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
                      onClick={() => setSelectedTrx(trx)}
                      className="cursor-pointer transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
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
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTrx(trx)
                          }}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionDetailDrawer
        transaction={selectedTrx}
        isOpen={Boolean(selectedTrx)}
        onClose={() => setSelectedTrx(null)}
      />
    </>
  )
}
