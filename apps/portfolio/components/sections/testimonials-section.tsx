import { Container } from "@workspace/ui/components/layouts"
import { User } from "lucide-react"
import { testimonials } from "@/data/portfolio-data"

export function TestimonialsSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Activities</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Helping businesses build intuitive products that drive growth.
          </p>
        </div>
      </hgroup>

      <div className="grid gap-x-10 gap-y-12 py-14 sm:grid-cols-2">
        {testimonials.map((item, idx) => (
          <div key={idx} className="w-full space-y-8 bg-transparent">
            <hgroup className="flex justify-between">
              <div className="flex items-center gap-x-5">
                <div className="size-14 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                </div>
                <div className="w-full">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-sm/6 text-muted-foreground">
                    {item.handle}
                  </p>
                </div>
              </div>

              <User className="size-5 text-muted-foreground" />
            </hgroup>

            <div className="w-full">
              <p className="leading-7 text-muted-foreground">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
