"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, ArrowRight } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ShopError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Shop application error occurred:", error)
  }, [error])

  return (
    <Container className="max-w-2xl py-20 text-center">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/5 p-8 py-16 backdrop-blur-md sm:p-12">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>

        <span className="mt-4 font-mono text-xs font-semibold uppercase tracking-widest text-destructive">
          Runtime Exception
        </span>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Storefront Encountered an Unexpected Error
        </h1>

        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          An unexpected error occurred while loading this section of the store.
          You can attempt to refresh the component state or return to the main catalog.
        </p>

        {error.digest && (
          <div className="mt-4 rounded-lg border border-border/80 bg-background/80 px-3 py-1 font-mono text-[11px] text-muted-foreground">
            Error Reference ID: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
