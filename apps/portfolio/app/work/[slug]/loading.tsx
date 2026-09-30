import { Container } from "@workspace/ui/components/layouts/container"

export default function CaseStudyDetailLoading() {
  return (
    <article className="space-y-12 py-10 sm:py-16 animate-in fade-in duration-150">
      <Container>
        <div className="h-4 w-36 animate-pulse rounded bg-muted/60" />
      </Container>

      <Container className="space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-32 animate-pulse rounded-full bg-muted/60" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted/40" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted/40" />
        </div>

        <div className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-muted/70 sm:h-14" />

        <div className="space-y-2 max-w-3xl">
          <div className="h-4.5 w-full animate-pulse rounded bg-muted/50" />
          <div className="h-4.5 w-5/6 animate-pulse rounded bg-muted/50" />
        </div>

        <div className="flex gap-3 pt-2">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-muted/70" />
          <div className="h-10 w-32 animate-pulse rounded-xl bg-muted/50" />
        </div>
      </Container>

      <Container>
        <div className="aspect-16/9 w-full animate-pulse rounded-2xl bg-muted/70 shadow-lg ring-1 ring-border/50" />
      </Container>

      <Container>
        <div className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8 space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-muted/50" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border/50 bg-background/40 p-4 space-y-2"
              >
                <div className="h-7 w-20 animate-pulse rounded bg-muted/70" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Container>
        <div className="rounded-2xl border border-border/60 bg-card/30 p-6 sm:p-10 space-y-6">
          <div className="h-7 w-48 animate-pulse rounded bg-muted/70" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-muted/40" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-muted/40" />
          </div>
          <div className="h-6 w-40 animate-pulse rounded bg-muted/60 pt-4" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted/40" />
          </div>
        </div>
      </Container>
    </article>
  )
}
