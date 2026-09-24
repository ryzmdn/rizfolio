import Link from "next/link"
import { GitCommit, ArrowLeft, Milestone, Rss } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export default function ChangelogNotFound() {
  return (
    <Container className="max-w-xl py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-card text-primary shadow-xs">
          <GitCommit className="size-7" />
        </div>

        <span className="mt-6 rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
          404 Error
        </span>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Page or Release Not Found
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The requested release version, timeline filter, or endpoint does not
          exist in the active changelog index.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Timeline</span>
          </Link>

          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Milestone className="size-3.5" />
            <span>View Roadmap</span>
          </Link>

          <a
            href="/rss.xml"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Rss className="size-3.5 text-amber-500" />
            <span>RSS Feed</span>
          </a>
        </div>
      </div>
    </Container>
  )
}
