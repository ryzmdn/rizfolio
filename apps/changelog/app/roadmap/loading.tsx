import { Container } from "@workspace/ui/components/layouts/container"

export default function RoadmapLoading() {
  return (
    <Container className="max-w-6xl py-10 sm:py-16">
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="h-6 w-64 animate-pulse rounded-full border border-border/60 bg-muted/60" />

          <div className="space-y-3">
            <div className="h-10 w-80 animate-pulse rounded-xl bg-muted/60 sm:h-12 sm:w-96" />
            <div className="h-4 w-full max-w-xl animate-pulse rounded-lg bg-muted/60" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl border border-border/60 bg-card/50 p-4"
              >
                <div className="h-3 w-28 rounded-md bg-muted/60" />
                <div className="mt-3 h-6 w-10 rounded-md bg-muted/60" />
                <div className="mt-2 h-2.5 w-32 rounded-md bg-muted/60" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-24 animate-pulse rounded-2xl border border-border/60 bg-card/50 p-5" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-7 animate-pulse rounded-lg bg-muted/60" />
                  <div className="h-5 w-24 animate-pulse rounded-md bg-muted/60" />
                </div>
                <div className="h-4 w-8 animate-pulse rounded-md bg-muted/60" />
              </div>

              <div className="space-y-3.5">
                {[1, 2, 3].map((card) => (
                  <div
                    key={card}
                    className="h-36 animate-pulse rounded-2xl border border-border/60 bg-card/60 p-5"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl border border-border/80 bg-card/50 p-8" />
      </div>
    </Container>
  )
}
