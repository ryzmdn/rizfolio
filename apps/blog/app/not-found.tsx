import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mx-auto max-w-sm space-y-6">
        <p className="font-mono text-xs tracking-widest text-muted-foreground">
          404
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Article not found.
        </h1>

        <p className="text-sm/relaxed text-muted-foreground">
          This article may have been archived, renamed, or is temporarily
          unavailable.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to all articles</span>
        </Link>
      </div>
    </Container>
  )
}
