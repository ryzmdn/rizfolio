"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { ArrowLeft, RotateCcw } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Blog Client Error Boundary]:", error)
  }, [error])

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mx-auto max-w-sm space-y-6">
        <p className="font-mono text-xs tracking-widest text-rose-500">
          Execution exception
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Unable to load this page.
        </h1>

        <p className="text-sm/relaxed text-muted-foreground">
          An unexpected error occurred while loading the page data. You can retry or return to the overview.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-foreground/30 hover:bg-muted/50"
          >
            <RotateCcw className="size-3.5" />
            <span>Try again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
