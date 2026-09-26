"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { buttonVariants } from "@workspace/ui/components/button"
import { RotateCcw, ArrowLeft, AlertCircle } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

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
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-500 shadow-xs">
          <AlertCircle className="size-6" />
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs text-rose-500">Execution Exception</p>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Unable to Load Publication
          </h1>
          <p className="text-xs/relaxed text-muted-foreground sm:text-sm/relaxed">
            An unexpected error occurred while compiling the page data. You can attempt to retry the request or return to the overview.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className={cn(buttonVariants({ size: "sm" }), "gap-x-2 text-xs px-4")}
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-x-2 text-xs px-4")}
          >
            <ArrowLeft className="size-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
