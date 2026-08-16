import { Container } from "@workspace/ui/components/layouts"
import { Check } from "lucide-react"
import { services } from "@/data/portfolio-data"

export function ServicesSection() {
  return (
    <Container id="solutions" className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Services</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            A selection of projects focused on clarity, usability, and
            meaningful, lasting positive impact worldwide.
          </p>
        </div>
      </hgroup>

      <div className="flow-root w-full space-y-10 divide-y divide-border py-10">
        {services.map((service, idx) => (
          <div key={idx} className="pb-10 lg:flex">
            <div className="lg:flex-auto">
              <h3 className="relative w-max text-2xl font-medium tracking-tight text-primary">
                {service.title}{" "}
                <small className="absolute -right-5 text-xs opacity-50">
                  0{idx + 1}
                </small>
              </h3>
              <p className="mt-4 text-base/7 text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-8 flex items-center gap-x-4">
                <h4 className="flex-none text-sm/6 font-semibold text-accent-foreground">
                  What&apos;s included
                </h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6"
              >
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-x-3">
                    <Check className="size-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
