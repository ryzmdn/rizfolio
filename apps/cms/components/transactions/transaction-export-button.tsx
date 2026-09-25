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

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    )

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
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5 text-primary" />
        <span>Ekspor Data Audit</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-border bg-card p-1 shadow-lg">
            <button
              type="button"
              onClick={exportAsCsv}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
              <span>Format CSV (.csv)</span>
            </button>
            <button
              type="button"
              onClick={exportAsJson}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
            >
              <FileCode className="h-3.5 w-3.5 text-blue-500" />
              <span>Format JSON (.json)</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
