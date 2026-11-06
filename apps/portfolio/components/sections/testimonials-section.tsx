import Image from "next/image"
import { Container } from "@workspace/ui/components/layouts"
import { testimonials as fallbackTestimonials } from "@/data"
import type { TestimonialItem } from "@/lib/queries"

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[]
}

export function TestimonialsSection({
  testimonials: propTestimonials,
}: TestimonialsSectionProps) {
  const items =
    propTestimonials && propTestimonials.length > 0
      ? propTestimonials
      : fallbackTestimonials

  return (
    <Container id="testimonials" className="py-24 md:py-36">
      <div className="space-y-16 lg:space-y-24">
        <div className="flex flex-col gap-6 border-b border-foreground/6 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
              [ 05 / ENDORSEMENTS & PEER PERSPECTIVES ]
            </span>
            <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Perspectives on technical rigor & execution speed.
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs leading-relaxed text-muted-foreground">
            Direct feedback from engineering leads, product founders, and distributed collaborators.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-foreground/8 bg-foreground/[0.01] p-8 sm:p-10 transition-colors duration-300 hover:border-foreground/20"
            >
              <blockquote className="font-serif text-lg font-light leading-relaxed text-foreground/90 sm:text-xl">
                &ldquo;{item.content}&rdquo;
              </blockquote>

              <div className="mt-8 flex items-center gap-4 border-t border-foreground/6 pt-6">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-foreground/15 bg-muted">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="44px"
                    className="object-cover grayscale contrast-125"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground tracking-tight">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    &#64;{item.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
