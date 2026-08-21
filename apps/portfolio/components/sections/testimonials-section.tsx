import { Quote } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { testimonials as fallbackTestimonials } from "@/data"
import type { TestimonialItem } from "@/lib/queries"

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[]
}

export function TestimonialsSection({
  testimonials = fallbackTestimonials,
}: TestimonialsSectionProps) {
  return (
    <Container id="testimonials" className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Peer & Client Endorsements</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Perspectives from engineering leads, founders, and product managers
            on technical rigor, execution speed, and collaboration.
          </p>
        </div>
      </hgroup>

      <div className="grid gap-8 py-12 sm:grid-cols-2">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between space-y-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xs"
          >
            <div className="space-y-4">
              <Quote className="size-6 text-muted-foreground/40" />
              <p className="text-sm/relaxed leading-7 text-muted-foreground">
                &ldquo;{item.content}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-x-4 border-t border-border/40 pt-4">
              <div className="size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="size-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">{item.handle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
