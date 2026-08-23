import { Check } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { SectionEyebrow } from "@workspace/ui/components/section-eyebrow"
import { services as fallbackServices } from "@/data"
import type { ServiceItem } from "@/lib/queries"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { buttonVariants } from "@workspace/ui/components/button"

interface ServicesSectionProps {
  services?: ServiceItem[]
  sectionNumber?: number | string
}

export function ServicesSection({
  services = fallbackServices,
  sectionNumber = 4,
}: ServicesSectionProps) {
  return (
    <Container id="solutions" className="space-y-12 py-20">
      <hgroup className="w-full space-y-2">
        <SectionEyebrow number={sectionNumber} label="Services & Solutions." />
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Services & Technical Capabilities
        </h2>
        <p className="leading-7 text-muted-foreground">
          Comprehensive full-stack engineering solutions tailored for scaling
          startups, modern SaaS platforms, and enterprise digital
          transformations.
        </p>
      </hgroup>

      <div className="flow-root w-full space-y-10 divide-y divide-ring/50 py-10">
        {services.map((service, idx) => (
          <div key={idx} className="pb-10 lg:flex">
            <div className="lg:flex-auto">
              <div className="w-full space-y-5">
                <h3 className="relative max-w-max text-2xl font-medium tracking-tight text-primary">
                  {service.title}
                  <small className="absolute -right-5 hidden text-xs font-normal opacity-50 sm:inline">
                    0{idx + 1}
                  </small>
                </h3>
                <p className="leading-7 text-muted-foreground">
                  {service.description}
                </p>
                <div className="flex gap-x-4 gap-y-3 max-sm:flex-col">
                  <Link
                    href="/#case-studies"
                    className={cn(buttonVariants({ size: "lg" }))}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/#call-to-action"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" })
                    )}
                  >
                    Service Detail
                  </Link>
                </div>
              </div>
              {service.features && service.features.length > 0 && (
                <>
                  <div className="mt-10 flex items-center gap-x-4">
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
                      <li
                        key={fIdx}
                        className="flex items-center gap-x-3 text-foreground"
                      >
                        <Check className="size-4 shrink-0 text-primary" />
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
