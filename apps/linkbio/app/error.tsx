"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[LinkBio Client Error Boundary]:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-sm space-y-4">
        <p className="font-mono text-xs tracking-widest text-rose-500">
          Execution exception
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Unable to load links.
        </h1>

        <p className="text-sm text-muted-foreground">
          An unexpected error occurred while loading profile links. Please retry
          or visit the main portfolio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted/50"
          >
            <RotateCcw className="size-3.5" />
            <span>Try again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Reload</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
