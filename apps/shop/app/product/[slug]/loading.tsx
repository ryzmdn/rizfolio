import { Container } from "@workspace/ui/components/layouts/container"

export default function ProductLoading() {
  return (
    <Container className="max-w-6xl py-10 md:py-16">
      <div className="mb-8 h-4 w-36 animate-pulse rounded-md bg-muted/60" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-10 lg:col-span-7">
          <div className="space-y-4">
            <div className="aspect-16/10 w-full animate-pulse rounded-lg border border-border/70 bg-muted/60" />
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-video animate-pulse rounded-md bg-muted/50"
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-7 w-64 animate-pulse rounded-md bg-muted/70" />
            <div className="space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded-sm bg-muted/40" />
              <div className="h-3.5 w-full animate-pulse rounded-sm bg-muted/40" />
              <div className="h-3.5 w-4/5 animate-pulse rounded-sm bg-muted/40" />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
            <div className="h-5 w-56 animate-pulse rounded-md bg-muted/60" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="size-3.5 animate-pulse rounded-full bg-muted/60" />
                  <div className="h-3.5 w-40 animate-pulse rounded-sm bg-muted/40" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
            <div className="h-5 w-48 animate-pulse rounded-md bg-muted/60" />
            <div className="space-y-2">
              <div className="h-9 w-full animate-pulse rounded-md bg-muted/30" />
              <div className="h-9 w-full animate-pulse rounded-md bg-muted/30" />
            </div>
          </div>

          <div className="space-y-4 border-t border-border/60 pt-10">
            <div className="h-6 w-52 animate-pulse rounded-md bg-muted/60" />
            <div className="h-28 w-full animate-pulse rounded-lg bg-muted/30" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-6 rounded-lg border border-border/70 bg-card/40 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="h-6 w-28 animate-pulse rounded-md bg-muted/60" />
              <div className="h-5 w-24 animate-pulse rounded-sm bg-muted/50" />
            </div>

            <div className="space-y-2">
              <div className="h-10 w-44 animate-pulse rounded-md bg-muted/70" />
              <div className="h-3.5 w-60 animate-pulse rounded-sm bg-muted/40" />
            </div>

            <div className="space-y-3 border-t border-border/60 pt-4">
              <div className="h-4 w-32 animate-pulse rounded-sm bg-muted/50" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="h-24 animate-pulse rounded-md border border-border/60 bg-muted/30" />
                <div className="h-24 animate-pulse rounded-md border border-border/60 bg-muted/30" />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="h-11 w-full animate-pulse rounded-md bg-muted/70" />
              <div className="h-10 w-full animate-pulse rounded-md bg-muted/40" />
            </div>

            <div className="space-y-2 border-t border-border/60 pt-4">
              <div className="h-3.5 w-full animate-pulse rounded-sm bg-muted/30" />
              <div className="h-3.5 w-4/5 animate-pulse rounded-sm bg-muted/30" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
