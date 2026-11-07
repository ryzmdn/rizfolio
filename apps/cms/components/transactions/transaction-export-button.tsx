"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, FileCode, ChevronDown } from "lucide-react"
import type { MasterTransaction } from "@workspace/db"

interface TransactionExportButtonProps {
  transactions: MasterTransaction[]
}

export function TransactionExportButton({
  transactions,
}: TransactionExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  function exportAsJson() {
    if (transactions.length === 0) return
    const jsonStr = JSON.stringify(transactions, null, 2)
    const blob = new Blob([jsonStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-audit-export-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  function exportAsCsv() {
    if (transactions.length === 0) return

    const headers = [
      "TRX Number",
      "Domain",
      "Action Type",
      "Status",
      "Actor Type",
      "Actor ID",
      "Amount",
      "Currency",
      "Entity Type",
      "Entity ID",
      "Created At",
      "Client IP",
    ]

    const rows = transactions.map((t) => [
      `"${t.trxNumber}"`,
      `"${t.domain}"`,
      `"${t.actionType}"`,
      `"${t.status}"`,
      `"${t.actorType}"`,
      `"${t.actorId || ""}"`,
      t.amount || 0,
      `"${t.currency || "IDR"}"`,
      `"${t.entityType}"`,
      `"${t.entityId}"`,
      `"${new Date(t.createdAt).toISOString()}"`,
      `"${t.clientIp || ""}"`,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-audit-export-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={transactions.length === 0}
        className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3.5 py-1.5 font-mono text-xs text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        <Download className="size-3.5 text-muted-foreground" />
        <span>Ekspor Data Audit</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-2xl border border-foreground/10 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={exportAsCsv}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs text-foreground transition-colors hover:bg-foreground/[0.04]"
            >
              <FileSpreadsheet className="size-3.5 text-muted-foreground" />
              <span>Format CSV (.csv)</span>
            </button>
            <button
              type="button"
              onClick={exportAsJson}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-mono text-xs text-foreground transition-colors hover:bg-foreground/[0.04]"
            >
              <FileCode className="size-3.5 text-muted-foreground" />
              <span>Format JSON (.json)</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
