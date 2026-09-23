import { Container } from "@workspace/ui/components/layouts/container"

export default function ShopLoading() {
  return (
    <div className="space-y-16 pb-20 pt-10 sm:space-y-20">
      <section className="space-y-10">
        <Container>
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="mx-auto h-7 w-64 animate-pulse rounded-full bg-muted/60" />
            <div className="mx-auto h-12 w-full max-w-xl animate-pulse rounded-2xl bg-muted/80" />
            <div className="mx-auto space-y-2">
              <div className="mx-auto h-4 w-full max-w-lg animate-pulse rounded-lg bg-muted/50" />
              <div className="mx-auto h-4 w-3/4 max-w-md animate-pulse rounded-lg bg-muted/40" />
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <div className="h-11 w-36 animate-pulse rounded-xl bg-muted/70" />
              <div className="h-11 w-36 animate-pulse rounded-xl bg-muted/50" />
            </div>
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/70 bg-card/30 p-6 sm:grid-cols-4 sm:p-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 p-3">
                <div className="h-8 w-20 animate-pulse rounded-lg bg-muted/70" />
                <div className="h-4 w-28 animate-pulse rounded-md bg-muted/50" />
                <div className="h-3 w-36 animate-pulse rounded-md bg-muted/40" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-3 rounded-2xl border border-border/60 bg-card/30 p-6"
              >
                <div className="size-10 animate-pulse rounded-xl bg-muted/70" />
                <div className="h-4 w-36 animate-pulse rounded-md bg-muted/60" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded-md bg-muted/40" />
                  <div className="h-3 w-4/5 animate-pulse rounded-md bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="space-y-8">
        <Container className="space-y-6">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded-lg bg-muted/70" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-muted/40" />
          </div>

          <div className="space-y-4">
            <div className="h-14 w-full animate-pulse rounded-2xl border border-border/60 bg-card/40" />
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-24 shrink-0 animate-pulse rounded-xl bg-muted/50"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-5"
              >
                <div className="aspect-video w-full animate-pulse rounded-xl bg-muted/60" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted/50" />
                  <div className="h-5 w-24 animate-pulse rounded-md bg-muted/70" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-5 w-4/5 animate-pulse rounded-md bg-muted/60" />
                  <div className="h-3 w-full animate-pulse rounded-md bg-muted/40" />
                  <div className="h-3 w-3/4 animate-pulse rounded-md bg-muted/40" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 w-16 animate-pulse rounded-md bg-muted/40" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-muted/40" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-muted/40" />
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div className="h-8 w-24 animate-pulse rounded-lg bg-muted/60" />
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
