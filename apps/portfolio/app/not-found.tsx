import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts"
import { ArrowLeft, Home, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-xs font-semibold text-primary">
          <Sparkles className="size-3" />
          <span>404 — Page Not Found</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Resource does not exist.
        </h1>

        <p className="text-sm/relaxed text-muted-foreground">
          The requested page, project link, or portfolio asset could not be found.
          It may have been moved, renamed, or is under active development.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            <Home className="size-3.5" />
            <span>Return to Portfolio</span>
          </Link>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            <span>Explore Case Studies</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
