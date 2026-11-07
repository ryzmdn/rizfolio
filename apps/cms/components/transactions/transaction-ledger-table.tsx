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
    icon: LucideIcon
  }
> = {
  COMMERCE: { label: "Commerce", icon: ShoppingBag },
  CONTENT: { label: "Blog & Content", icon: FileText },
  PORTFOLIO: { label: "Portfolio", icon: Layers },
  CODE_DOCS: { label: "Docs & Repo", icon: BookOpen },
  AUTH_SECURITY: {
    label: "Security & Auth",
    icon: Shield,
  },
  SYSTEM: { label: "System", icon: Activity },
}

export function TransactionLedgerTable({
  transactions,
}: TransactionLedgerTableProps) {
  const [selectedTrx, setSelectedTrx] = useState<MasterTransaction | null>(null)

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 backdrop-blur-xl shadow-xs">
        <div className="flex flex-col gap-3 border-b border-foreground/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h2 className="font-serif text-lg font-light tracking-tight text-foreground">
              Master Ledger Records
            </h2>
            <p className="font-mono text-[11px] text-muted-foreground">
              Klik pada baris transaksi untuk melihat metadata dan inspeksi JSON
              diff.
            </p>
          </div>

          <TransactionExportButton transactions={transactions} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-foreground/8 bg-foreground/[0.02] font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-normal">Ref Transaksi</th>
                <th className="px-6 py-4 font-normal">Domain</th>
                <th className="px-6 py-4 font-normal">Aksi & Entitas</th>
                <th className="px-6 py-4 font-normal">Aktor</th>
                <th className="px-6 py-4 font-normal">Nilai</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Waktu</th>
                <th className="px-4 py-4 text-right font-normal">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center font-mono text-xs text-muted-foreground"
                  >
                    Belum ada catatan transaksi master yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => {
                  const domBadge = domainBadges[trx.domain] || {
                    label: trx.domain,
                    icon: Layers,
                  }
                  const Icon = domBadge.icon

                  return (
                    <tr
                      key={trx.id}
                      onClick={() => setSelectedTrx(trx)}
                      className="group cursor-pointer transition-colors hover:bg-foreground/[0.02]"
                    >
                      <td className="px-6 py-4.5 font-mono text-xs font-semibold text-foreground">
                        {trx.trxNumber}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          <Icon className="size-3" />
                          <span>{domBadge.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="space-y-0.5">
                          <p className="font-serif text-sm font-normal text-foreground">
                            {trx.actionType}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {trx.entityType}: {trx.entityId.substring(0, 18)}
                            {trx.entityId.length > 18 ? "..." : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 font-mono text-xs text-muted-foreground">
                        <span className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 text-[10px]">
                          {trx.actorType}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 font-mono text-xs text-foreground">
                        {trx.amount && trx.amount > 0 ? (
                          `Rp ${trx.amount.toLocaleString("id-ID")}`
                        ) : (
                          <span className="text-muted-foreground/40">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-foreground">
                          <span className="size-1.5 rounded-full bg-foreground/60" />
                          <span>{trx.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4.5 font-mono text-xs whitespace-nowrap text-muted-foreground">
                        {new Date(trx.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 py-4.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTrx(trx)
                          }}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                        >
                          <ChevronRight className="size-4" />
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
