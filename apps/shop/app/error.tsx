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
      <div className="flex flex-col items-center justify-center rounded-lg border border-border/70 bg-card/40 p-6 py-14 sm:p-10">
        <div className="flex size-12 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>

        <span className="mt-3 font-mono text-[11px] font-semibold tracking-widest text-destructive uppercase">
          Runtime Exception
        </span>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Storefront Encountered an Unexpected Error
        </h1>

        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
          An unexpected error occurred while loading this section of the store.
          You can attempt to refresh the component state or return to the main
          catalog.
        </p>

        {error.digest && (
          <div className="mt-4 rounded-md border border-border/70 bg-background/80 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            Error Reference ID: {error.digest}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={reset}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
