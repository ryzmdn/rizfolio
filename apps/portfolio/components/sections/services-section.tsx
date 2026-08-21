import { Check } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { services as fallbackServices } from "@/data"
import type { ServiceItem } from "@/lib/queries"

interface ServicesSectionProps {
  services?: ServiceItem[]
}

export function ServicesSection({
  services = fallbackServices,
}: ServicesSectionProps) {
  return (
    <Container id="solutions" className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Services & Technical Capabilities</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Comprehensive full-stack engineering solutions tailored for scaling
            startups, modern SaaS platforms, and enterprise digital
            transformations.
          </p>
        </div>
      </hgroup>

      <div className="flow-root w-full space-y-10 divide-y divide-border py-10">
        {services.map((service, idx) => (
          <div key={idx} className="pb-10 lg:flex">
            <div className="lg:flex-auto">
              <h3 className="relative w-max text-2xl font-medium tracking-tight text-primary max-w-full">
                {service.title}{" "}
                <small className="absolute -right-7 hidden text-xs font-normal opacity-50 sm:inline">
                  0{idx + 1}
                </small>
              </h3>
              <p className="mt-4 text-base/7 text-muted-foreground">
                {service.description}
              </p>
              {service.features && service.features.length > 0 && (
                <>
                  <div className="mt-8 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm/6 font-semibold text-accent-foreground">
                      Deliverables & Features
                    </h4>
                    <div className="h-px flex-auto bg-border/60" />
                  </div>
                  <ul
                    role="list"
                    className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-muted-foreground sm:grid-cols-2 sm:gap-6"
                  >
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-x-3 text-foreground">
                        <Check className="size-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
