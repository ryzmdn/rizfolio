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
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-destructive/20 bg-card p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Terjadi Kendala Sistem
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Aplikasi menemui pengecualian tak terduga saat memproses data. Anda
            dapat mencoba memuat ulang komponen atau kembali ke ringkasan utama.
          </p>
        </div>

        {error.digest && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            <span>Kode Diagnostik:</span>
            <strong className="text-foreground">{error.digest}</strong>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Dashboard Overview</span>
          </Link>
        </div>

        <div className="border-t border-border pt-4 text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <span>Rincian Kesalahan Teknis</span>
            {showDetails ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2">
              <div className="max-h-48 overflow-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] text-foreground whitespace-pre-wrap break-all">
                {error.message || "Pesan galat tidak tersedia."}
                {error.stack && (
                  <div className="mt-2 text-[10px] text-muted-foreground">
                    {error.stack}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyError}
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Salin Laporan Kesalahan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
