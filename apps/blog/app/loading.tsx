import { Container } from "@workspace/ui/components/layouts/container"

export default function BlogLoading() {
  return (
    <Container className="space-y-12 py-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="max-w-2xl space-y-4">
        <div className="h-6 w-48 rounded-full bg-muted" />
        <div className="h-10 w-3/4 rounded-xl bg-muted" />
        <div className="h-4 w-full rounded-md bg-muted/60" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex h-12 w-full items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4" />

      {/* Posts Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-4 space-y-4"
          >
            <div className="aspect-video w-full rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="h-6 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted/70" />
            </div>
            <div className="h-4 w-1/4 rounded bg-muted/50 pt-4" />
          </div>
        ))}
      </div>
    </Container>
  )
}
