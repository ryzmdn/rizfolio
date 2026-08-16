import { Container } from "@workspace/ui/components/layouts"
import { caseStudies } from "@/data/portfolio-data"

export function CaseStudiesSection() {
  return (
    <Container id="case-studies" className="py-32">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">
          Problem-Solution-Impact Case Studies
        </h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            A selection of projects focused on clarity, usability, and
            meaningful, lasting positive impact worldwide.
          </p>
        </div>
      </hgroup>

      <div className="grid w-full gap-y-10 py-10 sm:grid-cols-2 sm:gap-x-5">
        {caseStudies.map((item) => (
          <div key={item.id} className="relative overflow-hidden">
            <div className="aspect-3/2 overflow-hidden rounded-xl shadow-xl">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>

            <div className="mt-4 w-full space-y-1">
              <p className="text-sm/6 text-muted-foreground">{item.category}</p>
              <h3 className="text-xl font-medium text-primary">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
