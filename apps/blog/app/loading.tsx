import { Container } from "@workspace/ui/components/layouts/container"

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted/60 ${className ?? ""}`}
      aria-hidden="true"
    />
  )
}

export default function BlogLoading() {
  return (
    <>
      <section className="w-full border-b border-border/40 pt-10 pb-0 sm:pt-16">
        <Container>
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div className="flex flex-col justify-between py-6 pr-0 lg:col-span-5 lg:py-8 lg:pr-12">
              <div className="space-y-4">
                <SkeletonBlock className="h-3 w-40" />
                <SkeletonBlock className="h-10 w-full" />
                <SkeletonBlock className="h-10 w-4/5" />
                <SkeletonBlock className="h-10 w-3/5" />
                <SkeletonBlock className="mt-4 h-4 w-full" />
                <SkeletonBlock className="h-4 w-4/5" />
              </div>
            </div>

            <div className="aspect-video w-full bg-muted/40 lg:col-span-7 lg:aspect-[4/3]" />
          </div>
        </Container>
      </section>

      <div className="border-b border-border/50 py-3">
        <Container>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} className="h-7 w-16 rounded-md" />
              ))}
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-8 w-20 rounded-md" />
              <SkeletonBlock className="h-8 w-36 rounded-md" />
            </div>
          </div>
        </Container>
      </div>

      <section className="w-full py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 gap-px border border-border/40 bg-border/40 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse space-y-4 bg-background p-5"
              >
                <SkeletonBlock className="aspect-video w-full rounded-none" />
                <SkeletonBlock className="h-3 w-1/3" />
                <SkeletonBlock className="h-5 w-full" />
                <SkeletonBlock className="h-5 w-4/5" />
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
