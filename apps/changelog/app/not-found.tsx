import Link from "next/link"
import { ArrowLeft, Milestone, Rss } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts/container"

export default function ChangelogNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center sm:py-28">
      <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        404 : Not Found
      </span>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        Release or Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The requested release version, timeline filter, or documentation endpoint does not
        exist in the active changelog index.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Timeline</span>
        </Link>

        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Milestone className="size-3.5" />
          <span>View Roadmap</span>
        </Link>

        <a
          href="/rss.xml"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Rss className="size-3.5 text-amber-500" />
          <span>RSS Feed</span>
        </a>
      </div>
    </Container>
  )
}
