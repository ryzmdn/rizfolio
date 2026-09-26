"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RotateCcw, ArrowLeft, Milestone } from "lucide-react"
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
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center sm:py-28">
      <span className="font-mono text-xs font-semibold tracking-wider text-rose-500 uppercase">
        Error : Runtime Exception
      </span>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Failed to Compile Release Notes
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
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
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90"
        >
          <RotateCcw className="size-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-3.5" />
          <span>Timeline Home</span>
        </Link>

        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Milestone className="size-3.5" />
          <span>Product Roadmap</span>
        </Link>
      </div>
    </Container>
  )
}
