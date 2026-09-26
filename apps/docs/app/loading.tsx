import { Container } from "@workspace/ui/components/layouts/container"

export default function DocsLoading() {
  return (
    <Container className="space-y-12 py-10 animate-pulse">
      <div className="space-y-6 max-w-3xl">
        <div className="h-6 w-44 rounded-full bg-muted/80" />
        <div className="space-y-3">
          <div className="h-10 w-4/5 rounded-xl bg-muted" />
          <div className="h-5 w-full rounded-lg bg-muted/60" />
          <div className="h-5 w-2/3 rounded-lg bg-muted/50" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card/60 p-3.5 space-y-2"
            >
              <div className="h-3 w-16 rounded bg-muted/60" />
              <div className="h-7 w-12 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full sm:w-72 rounded-xl bg-muted/70" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-9 w-20 rounded-lg bg-muted/60" />
          <div className="h-9 w-28 rounded-lg bg-muted/60" />
          <div className="h-9 w-28 rounded-lg bg-muted/60" />
          <div className="h-9 w-28 rounded-lg bg-muted/60" />
          <div className="h-9 w-32 rounded-lg bg-muted/70" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/60 p-6 space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-24 rounded-full bg-muted/80" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 rounded bg-muted/60" />
                  <div className="h-4 w-12 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-6 w-3/4 rounded-lg bg-muted" />
              <div className="space-y-1.5">
                <div className="h-4 w-full rounded bg-muted/60" />
                <div className="h-4 w-4/5 rounded bg-muted/50" />
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-border/50">
              <div className="flex flex-wrap gap-1.5">
                <div className="h-5 w-14 rounded-md bg-muted/50" />
                <div className="h-5 w-16 rounded-md bg-muted/50" />
                <div className="h-5 w-12 rounded-md bg-muted/50" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="h-8 w-28 rounded-lg bg-muted" />
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-muted/60" />
                  <div className="size-8 rounded-lg bg-muted/60" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
