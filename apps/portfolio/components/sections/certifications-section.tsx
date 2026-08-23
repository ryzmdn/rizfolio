import { Container } from "@workspace/ui/components/layouts"
import { Marquee } from "@workspace/ui/components/marquee"
import { SectionEyebrow } from "@workspace/ui/components/section-eyebrow"
import { certifications as fallbackCertifications } from "@/data"
import type { CertificationItem } from "@/lib/queries"

interface CertificationsSectionProps {
  certifications?: CertificationItem[]
  sectionNumber?: number | string
}

export function CertificationsSection({
  certifications = fallbackCertifications,
  sectionNumber = 12,
}: CertificationsSectionProps) {
  const midpoint = Math.ceil(certifications.length / 2)
  const firstRow = certifications.slice(0, midpoint)
  const secondRow = certifications.slice(midpoint)

  return (
    <Container id="certifications" className="py-20">
      <hgroup className="w-full space-y-2">
        <SectionEyebrow
          number={sectionNumber}
          label="Verified Certifications."
        />
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Licenses & Verified Certifications
        </h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Validated industry credentials and technical achievements across
            cloud computing, web standards, and secure software development.
          </p>
        </div>
      </hgroup>

      <div className="relative flow-root w-full space-y-5 py-10">
        {firstRow.length > 0 && (
          <Marquee pauseOnHover className="[--duration:55s] [--gap:24px]">
            {firstRow.map((item) => (
              <div
                key={item.id}
                className="aspect-4/3 max-h-40 w-auto overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm sm:max-h-52 lg:max-h-60"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </Marquee>
        )}
        {secondRow.length > 0 && (
          <Marquee
            pauseOnHover
            reverse
            className="[--duration:55s] [--gap:24px]"
          >
            {secondRow.map((item) => (
              <div
                key={item.id}
                className="aspect-4/3 max-h-40 w-auto overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm sm:max-h-52 lg:max-h-60"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </Marquee>
        )}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background/90 to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background/90 to-transparent sm:w-20" />
      </div>
    </Container>
  )
}
