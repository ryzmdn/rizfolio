import { Container } from "@workspace/ui/components/layouts/container"

export default function RepoDetailLoading() {
  return (
    <Container className="space-y-10 py-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-4">
        <div className="h-4 w-16 rounded bg-muted/60" />
        <div className="h-4 w-3 rounded bg-muted/40" />
        <div className="h-4 w-36 rounded bg-muted" />
      </div>

      {/* RepoHeader Skeleton */}
      <div className="space-y-6 rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-5 w-24 rounded-full bg-muted/80" />
              <div className="h-5 w-16 rounded-full bg-muted/60" />
              <div className="h-5 w-16 rounded-full bg-muted/60" />
            </div>
            <div className="h-9 w-3/4 rounded-xl bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded bg-muted/60" />
              <div className="h-4 w-4/5 rounded bg-muted/50" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-9 w-24 rounded-lg bg-muted/70" />
            <div className="h-9 w-28 rounded-lg bg-muted/70" />
            <div className="h-9 w-20 rounded-lg bg-muted/70" />
          </div>
        </div>

        {/* Stats & Metadata Bar Skeleton */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
          <div className="h-5 w-20 rounded bg-muted/60" />
          <div className="h-5 w-20 rounded bg-muted/60" />
          <div className="h-5 w-24 rounded bg-muted/60" />
          <div className="flex gap-1.5">
            <div className="h-5 w-16 rounded-md bg-muted/50" />
            <div className="h-5 w-16 rounded-md bg-muted/50" />
            <div className="h-5 w-16 rounded-md bg-muted/50" />
          </div>
        </div>
      </div>

      {/* Quick Jump Tabs Skeleton */}
      <div className="flex items-center gap-3 border-b border-border/70 pb-3">
        <div className="h-8 w-32 rounded-lg bg-muted/80" />
        <div className="h-8 w-36 rounded-lg bg-muted/60" />
      </div>

      {/* File Tree Browser Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 rounded bg-muted/70" />
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/50">
          <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 p-3">
            <div className="h-7 w-48 rounded-lg bg-muted/60" />
            <div className="h-7 w-40 rounded-lg bg-muted/50" />
          </div>
          <div className="divide-y divide-border/40">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="size-4 rounded bg-muted/70" />
                  <div className="h-4 w-36 rounded bg-muted/60" />
                </div>
                <div className="h-3 w-14 rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* README Skeleton */}
      <div className="space-y-4 pt-6">
        <div className="h-6 w-36 rounded bg-muted/70" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-9 rounded-2xl border border-border/80 bg-card/50 p-6 md:p-8">
            <div className="h-8 w-2/3 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted/60" />
              <div className="h-4 w-5/6 rounded bg-muted/60" />
              <div className="h-4 w-3/4 rounded bg-muted/50" />
            </div>
            <div className="h-36 w-full rounded-xl bg-muted/40" />
          </div>
          <div className="hidden lg:col-span-3 lg:block space-y-3">
            <div className="h-5 w-28 rounded bg-muted/60" />
            <div className="space-y-2 border-l-2 border-border/50 pl-3">
              <div className="h-4 w-32 rounded bg-muted/50" />
              <div className="h-4 w-24 rounded bg-muted/40" />
              <div className="h-4 w-28 rounded bg-muted/40" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
