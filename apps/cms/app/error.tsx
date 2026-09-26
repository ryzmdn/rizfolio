"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error("[CMS Resilience Root Boundary]", error)
  }, [error])

  function handleCopyError() {
    const details = [
      `Name: ${error.name}`,
      `Message: ${error.message}`,
      error.digest ? `Digest: ${error.digest}` : null,
      error.stack ? `Stack:\n${error.stack}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    navigator.clipboard.writeText(details)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-destructive/30 bg-card/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
            Error : Exception Boundary
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Terjadi Kendala Sistem
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Aplikasi menemui kendala saat memproses mutasi data. Anda dapat mencoba memuat ulang sesi atau kembali ke dashboard overview.
          </p>
        </div>

        {error.digest && (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            <span>Kode Diagnostik:</span>
            <strong className="text-foreground">{error.digest}</strong>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90"
          >
            <RotateCcw className="size-3.5" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Home className="size-3.5" />
            <span>Overview Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyError}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-500">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Salin Error</span>
              </>
            )}
          </button>
        </div>

        <div className="border-t border-border/60 pt-4 text-left">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex w-full items-center justify-between text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Detail Stack Trace & Log Error</span>
            {showDetails ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-border/80 bg-background/80 p-3 font-mono text-[10px] text-muted-foreground">
              <p className="font-bold text-destructive">{error.name}: {error.message}</p>
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap leading-relaxed">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
