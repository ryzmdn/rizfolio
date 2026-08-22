import Image from "next/image"
import { Container } from "@workspace/ui/components/layouts"
import { testimonials } from "@/data"

export function TestimonialsSection() {
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

      <div className="grid gap-6 py-10 sm:grid-cols-2">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="pt-6 sm:inline-block sm:w-full sm:px-4"
          >
            <figure className="rounded-2xl bg-secondary p-6 text-sm/6">
              <blockquote className="text-accent-foreground">
                {item.content}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="relative size-11 overflow-hidden rounded-full bg-background">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="-space-y-1">
                  <h3 className="font-medium text-primary">{item.name}</h3>
                  <p className="text-muted-foreground">&#64;{item.handle}</p>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </Container>
  )
}
