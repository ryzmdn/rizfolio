import { Container } from "@workspace/ui/components/layouts"
import { caseStudies } from "@/data/portfolio-data"

export function CaseStudiesSection() {
  return (
    <Container id="case-studies" className="py-32">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">
          Featured Case Studies & Systems
        </h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            A curated selection of engineering initiatives focused on high
            throughput, architectural clarity, and verifiable business impact.
          </p>
        </div>
      </hgroup>

      <div className="grid w-full gap-y-10 py-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12">
        {caseStudies.map((item) => (
          <div key={item.id} className="group relative overflow-hidden">
            <div className="aspect-3/2 overflow-hidden rounded-xl bg-muted shadow-lg ring-1 ring-border/50 transition-all duration-300 group-hover:shadow-2xl">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-4 w-full space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.category}
              </p>
              <h3 className="text-lg font-medium text-primary transition-colors group-hover:text-accent-foreground">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
