import { Container } from "@workspace/ui/components/layouts/container"

export default function PortfolioLoading() {
  return (
    <Container className="space-y-16 py-12">
      <div className="flex flex-col gap-6 pt-6">
        <div className="h-6 w-32 animate-pulse rounded-full bg-muted/60" />
        <div className="h-14 w-full max-w-2xl animate-pulse rounded-lg bg-muted/70" />
        <div className="h-6 w-full max-w-xl animate-pulse rounded-md bg-muted/50" />
        <div className="flex gap-4 pt-2">
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted/70" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-2">
        <div className="h-64 rounded-xl border border-border/40 bg-muted/20 p-6">
          <div className="h-5 w-40 animate-pulse rounded-md bg-muted/70" />
          <div className="mt-4 space-y-2.5">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted/40" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted/40" />
            <div className="h-4 w-4/6 animate-pulse rounded-md bg-muted/40" />
          </div>
        </div>
        <div className="h-64 rounded-xl border border-border/40 bg-muted/20 p-6">
          <div className="h-5 w-40 animate-pulse rounded-md bg-muted/70" />
          <div className="mt-4 space-y-2.5">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted/40" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted/40" />
            <div className="h-4 w-4/6 animate-pulse rounded-md bg-muted/40" />
          </div>
        </div>
      </div>
    </Container>
  )
}
