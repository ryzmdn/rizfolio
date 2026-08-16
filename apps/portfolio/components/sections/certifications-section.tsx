import { Container } from "@workspace/ui/components/layouts"
import { Marquee } from "@workspace/ui/components/marquee"
import { certifications } from "@/data/portfolio-data"

export function CertificationsSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Licenses & certifications</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Helping businesses build intuitive products that drive growth.
          </p>
        </div>
      </hgroup>

      <div className="relative flow-root w-full space-y-5 py-10">
        <Marquee pauseOnHover className="[--duration:55s] [--gap:32px]">
          {certifications.map((item) => (
            <div
              key={item.id}
              className="aspect-4/3 max-h-40 w-auto sm:max-h-52 lg:max-h-64"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="size-full"
              />
            </div>
          ))}
        </Marquee>
        <Marquee
          pauseOnHover
          reverse
          className="[--duration:55s] [--gap:32px]"
        >
          {certifications.map((item) => (
            <div
              key={item.id}
              className="aspect-4/3 max-h-40 w-auto sm:max-h-52 lg:max-h-64"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="size-full"
              />
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background/90 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background/90 to-transparent sm:w-20" />
      </div>
    </Container>
  )
}
