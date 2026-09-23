import { Container } from "@workspace/ui/components/layouts/container"

export default function BlobLoading() {
  return (
    <Container className="space-y-6 py-10 animate-pulse">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-24 rounded-lg bg-muted/70" />
          <div className="h-4 w-2 rounded bg-muted/40" />
          <div className="h-4 w-20 rounded bg-muted/60" />
          <div className="h-4 w-2 rounded bg-muted/40" />
          <div className="h-4 w-28 rounded bg-muted/80" />
          <div className="h-4 w-2 rounded bg-muted/40" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-7 w-24 rounded-lg bg-muted/60" />
          <div className="h-7 w-32 rounded-lg bg-muted/60" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded bg-muted/70" />
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-4 w-16 rounded-full bg-muted/60" />
            <div className="h-4 w-14 rounded bg-muted/50" />
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-6 w-14 rounded-lg bg-muted/60" />
            <div className="h-6 w-14 rounded-lg bg-muted/60" />
            <div className="h-6 w-14 rounded-lg bg-muted/60" />
            <div className="h-6 w-16 rounded-lg bg-muted/60" />
          </div>
        </div>

        <div className="flex bg-background/50 p-4">
          <div className="space-y-2 border-r border-border/60 pr-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-3 w-4 rounded bg-muted/40" />
            ))}
          </div>

          <div className="flex-1 space-y-2 pl-6">
            <div className="h-3.5 w-1/3 rounded bg-muted/70" />
            <div className="h-3.5 w-1/4 rounded bg-muted/50" />
            <div className="h-3.5 w-1/2 rounded bg-muted/60" />
            <div className="h-3.5 w-2/3 rounded bg-muted/70" />
            <div className="h-3.5 w-5/6 rounded bg-muted/60" />
            <div className="h-3.5 w-3/4 rounded bg-muted/50" />
            <div className="h-3.5 w-1/2 rounded bg-muted/60" />
            <div className="h-3.5 w-2/5 rounded bg-muted/40" />
            <div className="h-3.5 w-3/5 rounded bg-muted/60" />
            <div className="h-3.5 w-4/5 rounded bg-muted/70" />
            <div className="h-3.5 w-1/3 rounded bg-muted/50" />
            <div className="h-3.5 w-1/6 rounded bg-muted/40" />
          </div>
        </div>
      </div>
    </Container>
  )
}
