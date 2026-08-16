import { Container } from "@workspace/ui/components/layouts"
import { trustedLogos } from "@/data"

export function TrustedBySection() {
  return (
    <Container id="logos">
      <h2 className="leading-7 text-accent-foreground">
        Trusted by the world&apos;s most innovative teams
      </h2>
      <div className="grid grid-cols-2 py-8 sm:grid-cols-3 lg:grid-cols-5">
        {trustedLogos.map((logo) => (
          <img
            key={logo.name}
            alt={logo.name}
            src={logo.src}
            className="max-h-10"
          />
        ))}
      </div>
    </Container>
  )
}
