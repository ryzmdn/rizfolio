"use client"

import { useState, useMemo } from "react"
import {
  X,
  Copy,
  Check,
  Layers,
  Activity,
  Shield,
  Clock,
  Laptop,
  Network,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import type { MasterTransaction } from "@workspace/db"

interface TransactionDetailDrawerProps {
  transaction: MasterTransaction | null
  isOpen: boolean
  onClose: () => void
}

type TabMode = "diff" | "after" | "before" | "metadata"

interface DiffEntry {
  key: string
  status: "added" | "removed" | "modified" | "unchanged"
  beforeValue?: unknown
  afterValue?: unknown
}

function computeJsonDiff(before: unknown, after: unknown): DiffEntry[] {
  const objBefore = (
    before && typeof before === "object" ? before : {}
  ) as Record<string, unknown>
  const objAfter = (after && typeof after === "object" ? after : {}) as Record<
    string,
    unknown
  >

  const allKeys = Array.from(
    new Set([...Object.keys(objBefore), ...Object.keys(objAfter)])
  ).sort()

  return allKeys.map((key) => {
    const hasBefore = Object.prototype.hasOwnProperty.call(objBefore, key)
    const hasAfter = Object.prototype.hasOwnProperty.call(objAfter, key)
    const valBefore = objBefore[key]
    const valAfter = objAfter[key]

    if (!hasBefore && hasAfter) {
      return { key, status: "added", afterValue: valAfter }
    }
    if (hasBefore && !hasAfter) {
      return { key, status: "removed", beforeValue: valBefore }
    }
    if (JSON.stringify(valBefore) !== JSON.stringify(valAfter)) {
      return {
        key,
        status: "modified",
        beforeValue: valBefore,
        afterValue: valAfter,
      }
    }
    return {
      key,
      status: "unchanged",
      beforeValue: valBefore,
      afterValue: valAfter,
    }
  })
}

export function TransactionDetailDrawer({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabMode>("diff")
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const diffEntries = useMemo(() => {
    if (!transaction) return []
    return computeJsonDiff(transaction.payloadBefore, transaction.payloadAfter)
  }, [transaction])

  if (!isOpen || !transaction) return null

  function handleCopyJson(data: unknown, id: string) {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
    >
      <div
        className={`flex h-full flex-col border-l border-border bg-card shadow-2xl transition-all duration-300 ${
          isExpanded ? "w-full max-w-5xl" : "w-full max-w-2xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Activity className="h-5 w-5 shrink-0 text-primary" />
            <div className="overflow-hidden">
              <h3 className="truncate font-mono text-sm font-bold text-foreground">
                {transaction.trxNumber}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Audit Trail Record ID: {transaction.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title={isExpanded ? "Perkecil panel" : "Perbesar panel"}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-4">
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Domain</span>
              <p className="text-xs font-semibold text-foreground">
                {transaction.domain}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">
                Aksi Sistem
              </span>
              <p className="text-xs font-semibold text-foreground">
                {transaction.actionType}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">Status</span>
              <div>
                <Badge
                  variant={
                    transaction.status === "COMPLETED"
                      ? "default"
                      : transaction.status === "FAILED"
                        ? "destructive"
                        : "outline"
                  }
                  className="text-[10px]"
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-muted-foreground">
                Nilai Transaksi
              </span>
              <p className="font-mono text-xs font-semibold text-foreground">
                {transaction.amount && transaction.amount > 0
                  ? `Rp ${transaction.amount.toLocaleString("id-ID")}`
                  : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/70 bg-card p-4 text-xs">
            <h4 className="text-[11px] font-semibold tracking-wider text-foreground text-muted-foreground uppercase">
              Metadata Konteks & Keamanan
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Aktor:</span>
                <strong className="text-foreground">
                  {transaction.actorType}{" "}
                  {transaction.actorId
                    ? `(${transaction.actorId.substring(0, 10)}...)`
                    : ""}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Entitas:</span>
                <strong className="font-mono text-foreground">
                  {transaction.entityType}: {transaction.entityId}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Waktu Catat:</span>
                <strong className="text-foreground">
                  {new Date(transaction.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  })}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Network className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Client IP:</span>
                <strong className="font-mono text-foreground">
                  {transaction.clientIp || "Internal Cluster / Localhost"}
                </strong>
              </div>
            </div>

            {transaction.userAgent && (
              <div className="flex items-start gap-2 pt-1 text-muted-foreground">
                <Laptop className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="shrink-0">User Agent:</span>
                <span className="truncate font-mono text-[11px] text-foreground">
                  {transaction.userAgent}
                </span>
              </div>
            )}

            {transaction.traceId && (
              <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                <span className="shrink-0">Trace ID:</span>
                <span className="font-mono text-[11px] text-foreground">
                  {transaction.traceId}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("diff")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeTab === "diff"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Audit Diff
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("after")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeTab === "after"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Payload After
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("before")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeTab === "before"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Payload Before
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("metadata")}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeTab === "metadata"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Metadata JSON
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopyJson(
                    activeTab === "diff"
                      ? diffEntries
                      : activeTab === "after"
                        ? transaction.payloadAfter
                        : activeTab === "before"
                          ? transaction.payloadBefore
                          : transaction.metadata,
                    activeTab
                  )
                }
                className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted/80"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Salin JSON</span>
                  </>
                )}
              </button>
            </div>

            {activeTab === "diff" && (
              <div className="space-y-2">
                {diffEntries.length === 0 ? (
                  <div className="rounded-lg border border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                    Tidak ada perubahan data payload pada rekaman audit ini.
                  </div>
                ) : (
                  <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border bg-card">
                    {diffEntries.map((entry) => (
                      <div
                        key={entry.key}
                        className={`p-3 font-mono text-xs transition-colors ${
                          entry.status === "added"
                            ? "bg-emerald-500/5 dark:bg-emerald-500/10"
                            : entry.status === "removed"
                              ? "bg-destructive/5 dark:bg-destructive/10"
                              : entry.status === "modified"
                                ? "bg-amber-500/5 dark:bg-amber-500/10"
                                : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">
                            {entry.key}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                              entry.status === "added"
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : entry.status === "removed"
                                  ? "bg-destructive/20 text-destructive"
                                  : entry.status === "modified"
                                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                    : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </div>

                        {entry.status === "modified" && (
                          <div className="mt-2 grid grid-cols-1 gap-2 border-t border-border/40 pt-1 sm:grid-cols-2">
                            <div>
                              <span className="mb-0.5 block text-[10px] text-muted-foreground">
                                Sebelum:
                              </span>
                              <pre className="overflow-x-auto rounded bg-muted/40 p-2 text-[11px] text-destructive">
                                {JSON.stringify(entry.beforeValue, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="mb-0.5 block text-[10px] text-muted-foreground">
                                Sesudah:
                              </span>
                              <pre className="overflow-x-auto rounded bg-muted/40 p-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                                {JSON.stringify(entry.afterValue, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {entry.status === "added" && (
                          <div className="mt-2 pt-1">
                            <pre className="overflow-x-auto rounded bg-muted/40 p-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                              {JSON.stringify(entry.afterValue, null, 2)}
                            </pre>
                          </div>
                        )}

                        {entry.status === "removed" && (
                          <div className="mt-2 pt-1">
                            <pre className="overflow-x-auto rounded bg-muted/40 p-2 text-[11px] text-destructive">
                              {JSON.stringify(entry.beforeValue, null, 2)}
                            </pre>
                          </div>
                        )}

                        {entry.status === "unchanged" && (
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {JSON.stringify(entry.afterValue)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "after" && (
              <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-[11px] text-foreground">
                {JSON.stringify(transaction.payloadAfter, null, 2) || "{}"}
              </pre>
            )}

            {activeTab === "before" && (
              <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-[11px] text-foreground">
                {JSON.stringify(transaction.payloadBefore, null, 2) || "{}"}
              </pre>
            )}

            {activeTab === "metadata" && (
              <pre className="max-h-96 overflow-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-[11px] text-foreground">
                {JSON.stringify(transaction.metadata, null, 2) || "{}"}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
