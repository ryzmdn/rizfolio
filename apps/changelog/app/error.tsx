"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw, Home, Milestone } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export default function ChangelogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="max-w-xl py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-xs">
          <AlertCircle className="size-7" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Unexpected Error Occurred
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          An error occurred while compiling or retrieving release note records.
          You can attempt to reload the view or return to the main timeline.
        </p>

        {error.digest && (
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            Digest: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Home className="size-3.5" />
            <span>Timeline Home</span>
          </Link>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Milestone className="size-3.5" />
            <span>Product Roadmap</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
