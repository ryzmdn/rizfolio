import Image from "next/image"
import { Container } from "@workspace/ui/components/layouts"
import { caseStudies } from "@/data"

export function CaseStudiesSection() {
  return (
    <Container id="case-studies" className="space-y-12 py-20">
      <hgroup className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-sm/6 text-muted-foreground">Case Studies</p>
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Featured Case Studies & Systems
        </h2>
        <p className="leading-7 text-muted-foreground">
          A curated selection of engineering initiatives focused on high
          throughput, architectural clarity, and verifiable business impact.
        </p>
      </hgroup>

      <div className="grid w-full gap-y-10 py-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12">
        {caseStudies.map((item) => (
          <div key={item.id} className="group relative overflow-hidden">
            <div className="relative aspect-3/2 overflow-hidden rounded-xl bg-muted shadow-lg ring-1 ring-border">
              <Image
                src={item.image}
                alt={item.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-4 w-full space-y-1">
              <p className="text-xs font-medium tracking-wider text-muted-foreground">
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
