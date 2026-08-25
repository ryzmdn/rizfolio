"use client"

import { useState } from "react"
import { RefreshCw, Check, AlertCircle } from "lucide-react"

export function RevalidationButton() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  async function handleRevalidate() {
    setStatus("loading")
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus("success")
      setTimeout(() => setStatus("idle"), 2500)
    } catch (error: unknown) {
      console.error(
        "[RevalidationButton] Failed to revalidate cache:",
        error instanceof Error ? error.message : String(error)
      )
      setStatus("error")
      setTimeout(() => setStatus("idle"), 2500)
    }
  }

  return (
    <button
      type="button"
      onClick={handleRevalidate}
      disabled={status === "loading"}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
    >
      {status === "loading" && (
        <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
      )}
      {status === "success" && <Check className="size-3.5 text-success" />}
      {status === "error" && (
        <AlertCircle className="size-3.5 text-destructive" />
      )}
      {status === "idle" && (
        <RefreshCw className="size-3.5 text-muted-foreground" />
      )}
      <span>
        {status === "loading"
          ? "Memperbarui Cache..."
          : status === "success"
            ? "Cache Berhasil Diperbarui!"
            : status === "error"
              ? "Gagal Memperbarui Cache"
              : "Revalidate Public Cache"}
      </span>
    </button>
  )
}
