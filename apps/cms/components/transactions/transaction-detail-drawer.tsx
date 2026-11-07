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
import { cn } from "@workspace/ui/lib/utils"
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
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity"
    >
      <div
        className={cn(
          "flex h-full flex-col border-l border-foreground/10 bg-card/95 shadow-2xl backdrop-blur-2xl transition-all duration-300",
          isExpanded ? "w-full max-w-5xl" : "w-full max-w-2xl"
        )}
      >
        <div className="flex items-center justify-between border-b border-foreground/8 p-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <Activity className="size-5 shrink-0 text-foreground" />
            <div className="overflow-hidden">
              <h3 className="truncate font-mono text-sm font-semibold text-foreground">
                {transaction.trxNumber}
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground">
                Audit Trail Record ID: {transaction.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              title={isExpanded ? "Perkecil panel" : "Perbesar panel"}
            >
              {isExpanded ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3.5 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-5 sm:grid-cols-4">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Domain</span>
              <p className="font-mono text-xs font-semibold text-foreground">
                {transaction.domain}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Aksi Sistem
              </span>
              <p className="font-serif text-xs font-medium text-foreground">
                {transaction.actionType}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</span>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 font-mono text-[10px] text-foreground">
                  {transaction.status}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Nilai Transaksi
              </span>
              <p className="font-mono text-xs font-semibold text-foreground">
                {transaction.amount && transaction.amount > 0
                  ? `Rp ${transaction.amount.toLocaleString("id-ID")}`
                  : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-3.5 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-5 text-xs">
            <h4 className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Metadata Konteks & Keamanan
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="size-3.5 shrink-0 text-foreground" />
                <span>Aktor:</span>
                <strong className="font-mono text-foreground font-normal">
                  {transaction.actorType}{" "}
                  {transaction.actorId
                    ? `(${transaction.actorId.substring(0, 10)}...)`
                    : ""}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="size-3.5 shrink-0 text-foreground" />
                <span>Entitas:</span>
                <strong className="font-mono text-foreground font-normal">
                  {transaction.entityType}: {transaction.entityId}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-3.5 shrink-0 text-foreground" />
                <span>Waktu Catat:</span>
                <strong className="font-mono text-foreground font-normal">
                  {new Date(transaction.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  })}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Network className="size-3.5 shrink-0 text-foreground" />
                <span>Client IP:</span>
                <strong className="font-mono text-foreground font-normal">
                  {transaction.clientIp || "Internal Cluster / Localhost"}
                </strong>
              </div>
            </div>

            {transaction.userAgent && (
              <div className="flex items-start gap-2 pt-1 text-muted-foreground">
                <Laptop className="mt-0.5 size-3.5 shrink-0 text-foreground" />
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

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-foreground/8 pb-3">
              <div className="flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("diff")}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs transition-colors",
                    activeTab === "diff"
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Audit Diff
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("after")}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs transition-colors",
                    activeTab === "after"
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Payload After
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("before")}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs transition-colors",
                    activeTab === "before"
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Payload Before
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("metadata")}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs transition-colors",
                    activeTab === "metadata"
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
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
                className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3 py-1 font-mono text-xs text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Salin JSON</span>
                  </>
                )}
              </button>
            </div>

            {activeTab === "diff" && (
              <div className="space-y-2">
                {diffEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-foreground/15 p-8 text-center font-mono text-xs text-muted-foreground">
                    Tidak ada perubahan data payload pada rekaman audit ini.
                  </div>
                ) : (
                  <div className="divide-y divide-foreground/5 overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.01]">
                    {diffEntries.map((entry) => (
                      <div
                        key={entry.key}
                        className={cn(
                          "p-4 font-mono text-xs transition-colors",
                          entry.status === "added" && "bg-emerald-500/[0.04]",
                          entry.status === "removed" && "bg-destructive/[0.04]",
                          entry.status === "modified" && "bg-amber-500/[0.04]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            {entry.key}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                              entry.status === "added" && "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                              entry.status === "removed" && "border border-destructive/20 bg-destructive/10 text-destructive",
                              entry.status === "modified" && "border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                              entry.status === "unchanged" && "border border-foreground/10 bg-foreground/[0.02] text-muted-foreground"
                            )}
                          >
                            {entry.status}
                          </span>
                        </div>

                        {entry.status === "modified" && (
                          <div className="mt-3 grid grid-cols-1 gap-2.5 border-t border-foreground/5 pt-2 sm:grid-cols-2">
                            <div>
                              <span className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
                                Sebelum:
                              </span>
                              <pre className="overflow-x-auto rounded-xl border border-foreground/8 bg-background/50 p-3 font-mono text-[11px] text-destructive">
                                {JSON.stringify(entry.beforeValue, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="mb-1 block font-mono text-[10px] text-muted-foreground uppercase">
                                Sesudah:
                              </span>
                              <pre className="overflow-x-auto rounded-xl border border-foreground/8 bg-background/50 p-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                                {JSON.stringify(entry.afterValue, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {entry.status === "added" && (
                          <div className="mt-2.5 pt-1">
                            <pre className="overflow-x-auto rounded-xl border border-foreground/8 bg-background/50 p-3 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                              {JSON.stringify(entry.afterValue, null, 2)}
                            </pre>
                          </div>
                        )}

                        {entry.status === "removed" && (
                          <div className="mt-2.5 pt-1">
                            <pre className="overflow-x-auto rounded-xl border border-foreground/8 bg-background/50 p-3 font-mono text-[11px] text-destructive">
                              {JSON.stringify(entry.beforeValue, null, 2)}
                            </pre>
                          </div>
                        )}

                        {entry.status === "unchanged" && (
                          <div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
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
              <pre className="max-h-96 overflow-auto rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-5 font-mono text-[11px] text-foreground">
                {JSON.stringify(transaction.payloadAfter, null, 2) || "{}"}
              </pre>
            )}

            {activeTab === "before" && (
              <pre className="max-h-96 overflow-auto rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-5 font-mono text-[11px] text-foreground">
                {JSON.stringify(transaction.payloadBefore, null, 2) || "{}"}
              </pre>
            )}

            {activeTab === "metadata" && (
              <pre className="max-h-96 overflow-auto rounded-2xl border border-foreground/8 bg-foreground/[0.015] p-5 font-mono text-[11px] text-foreground">
                {JSON.stringify(transaction.metadata, null, 2) || "{}"}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
