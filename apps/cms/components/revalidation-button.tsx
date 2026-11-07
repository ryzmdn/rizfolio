"use client"

import { useState } from "react"
import { RefreshCw, Check, AlertCircle } from "lucide-react"
import {
  revalidateAllAppsAction,
  type RevalidationReport,
} from "@/lib/actions/revalidate-actions"

export function RevalidationButton() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [report, setReport] = useState<RevalidationReport | null>(null)

  async function handleRevalidate() {
    setStatus("loading")
    try {
      const res = await revalidateAllAppsAction()
      setReport(res)
      if (res.success) {
        setStatus("success")
      } else {
        setStatus("error")
      }
      setTimeout(() => {
        setStatus("idle")
        setReport(null)
      }, 3500)
    } catch (error: unknown) {
      console.error(
        "[RevalidationButton] Failed to revalidate cache:",
        error instanceof Error ? error.message : String(error)
      )
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3500)
    }
  }

  return (
    <button
      type="button"
      onClick={handleRevalidate}
      disabled={status === "loading"}
      className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/60 px-3.5 py-1.5 font-mono text-xs text-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-50"
      title="Dispatches cache purge to all 6 consumer applications"
    >
      {status === "loading" && (
        <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
      )}
      {status === "success" && <Check className="size-3.5 text-emerald-500" />}
      {status === "error" && (
        <AlertCircle className="size-3.5 text-destructive" />
      )}
      {status === "idle" && (
        <RefreshCw className="size-3.5 text-muted-foreground" />
      )}
      <span>
        {status === "loading"
          ? "Purging Cache..."
          : status === "success"
            ? `Purged (${report ? `${report.successfulCount}/${report.totalCount}` : "Active"})`
            : status === "error"
              ? "Purge Failed"
              : "Purge Cache"}
      </span>
    </button>
  )
}
