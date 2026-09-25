import { Container } from "@workspace/ui/components/layouts/container"

export default function CheckoutLoading() {
  return (
    <Container className="max-w-6xl py-10 md:py-16">
      <div className="mb-8 h-4 w-32 animate-pulse rounded-md bg-muted/60" />

      <div className="mb-8 space-y-2">
        <div className="h-8 w-72 animate-pulse rounded-xl bg-muted/70" />
        <div className="h-4 w-full max-w-md animate-pulse rounded-md bg-muted/40" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="space-y-8 lg:col-span-7">
          <div className="space-y-4 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
            <div className="h-5 w-48 animate-pulse rounded-md bg-muted/60" />
            <div className="h-3.5 w-full max-w-sm animate-pulse rounded-md bg-muted/40" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-10 animate-pulse rounded-xl bg-muted/40" />
              <div className="h-10 animate-pulse rounded-xl bg-muted/40" />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted/60" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl border border-border/50 bg-muted/20"
                />
              ))}
            </div>
          </div>

          <div className="h-12 w-full animate-pulse rounded-xl bg-muted/70" />
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-6 rounded-3xl border border-border/70 bg-card/40 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted/60" />
              <div className="h-4 w-16 animate-pulse rounded-md bg-muted/40" />
            </div>

            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 py-2">
                  <div className="size-14 animate-pulse rounded-xl bg-muted/60" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/50" />
                    <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted/40" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border/50 pt-4">
              <div className="flex justify-between">
                <div className="h-3.5 w-16 animate-pulse rounded-md bg-muted/40" />
                <div className="h-3.5 w-24 animate-pulse rounded-md bg-muted/50" />
              </div>
              <div className="flex justify-between pt-2">
                <div className="h-5 w-20 animate-pulse rounded-md bg-muted/60" />
                <div className="h-6 w-32 animate-pulse rounded-md bg-muted/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
