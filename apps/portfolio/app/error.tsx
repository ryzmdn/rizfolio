"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts"
import { RotateCcw, Home, AlertCircle } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Portfolio Runtime Error]:", error)
  }, [error])

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-1 font-mono text-xs font-semibold text-destructive">
          <AlertCircle className="size-3.5" />
          <span>Application Exception</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Something went wrong.
        </h1>

        <p className="text-xs/relaxed text-muted-foreground sm:text-sm">
          A client-side hydration or data rendering failure occurred while
          loading this view. You can attempt to retry the action.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Home className="size-3.5" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
