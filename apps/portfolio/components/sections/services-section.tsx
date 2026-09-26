import { Container } from "@workspace/ui/components/layouts"
import { cn } from "@workspace/ui/lib/utils"
import type { ServiceItem } from "@/lib/queries"
import { services as fallbackServices } from "@/data"

interface ServicesSectionProps {
  services?: ServiceItem[]
}

const SERVICE_IMAGES: [string, string][] = [
  [
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400&auto=format&fit=crop&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&auto=format&fit=crop&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80",
  ],
]

export function ServicesSection({ services: propServices }: ServicesSectionProps) {
  const items = propServices && propServices.length > 0 ? propServices : fallbackServices

  const container = "absolute -top-1 left-1/2 -translate-x-1/2 z-40 h-20 w-16"
  const effect =
    "relative duration-500 delay-100 shadow-none group-hover/reveal:shadow-xl scale-0 group-hover/reveal:scale-100 opacity-0 group-hover/reveal:opacity-100 group-hover/reveal:w-full group-hover/reveal:h-full w-16 h-16 overflow-hidden transition-all rounded-md"

  return (
    <Container id="solutions" className="space-y-12 py-20">
      <hgroup className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-sm/6 text-muted-foreground">Services & Solutions.</p>
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Services & Technical Capabilities
        </h2>
        <p className="leading-7 text-muted-foreground">
          Comprehensive full-stack engineering solutions tailored for scaling
          startups, modern SaaS platforms, and enterprise digital
          transformations.
        </p>
      </hgroup>

      <div className="space-y-6">
        {items.map((item, index) => {
          const imgPair = SERVICE_IMAGES[index % SERVICE_IMAGES.length]!

          return (
            <div
              key={item.title}
              className="group/reveal relative grid w-full items-center gap-6 border-b border-border/40 py-8 lg:grid-cols-5"
            >
              <div className="text-4xl font-semibold text-foreground/40 font-mono">
                <p>0{index + 1}</p>
              </div>

              <div className="relative lg:col-span-2">
                <h3 className="text-2xl sm:text-3xl font-semibold text-foreground transition-opacity duration-500 group-hover/reveal:opacity-40">
                  {item.title}
                </h3>

                <div className={container}>
                  <div className={effect}>
                    <img
                      alt={item.title}
                      src={imgPair[1]}
                      className="size-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    container,
                    "translate-x-0 translate-y-0 rotate-0 transition-transform delay-150 duration-500 group-hover/reveal:translate-x-6 group-hover/reveal:translate-y-6 group-hover/reveal:rotate-12"
                  )}
                >
                  <div className={cn(effect, "duration-200")}>
                    <img
                      alt={item.title}
                      src={imgPair[0]}
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm/6 text-muted-foreground lg:col-span-2">
                <p className="leading-relaxed">{item.description}</p>
                {item.features && item.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.features.map((feat) => (
                      <span
                        key={feat}
                        className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-xs text-foreground/80 font-mono"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
