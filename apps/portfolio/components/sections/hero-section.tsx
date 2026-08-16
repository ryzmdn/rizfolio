import { Container } from "@workspace/ui/components/layouts"
import { personalInfo } from "@/data/portfolio-data"

export function HeroSection() {
  return (
    <Container className="flow-root space-y-8 py-32">
      <div className="flex items-center gap-x-6">
        <div className="size-28 rounded-full bg-foreground/10 p-1.5 ring-1 ring-border ring-inset">
          <div className="size-full overflow-hidden rounded-full">
            <img
              src={personalInfo.avatar}
              alt={personalInfo.name}
              className="size-full object-cover shadow-xl ring-1 ring-border"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl/relaxed font-medium">{personalInfo.name}</h1>
          <p className="text-muted-foreground">{personalInfo.role}</p>
        </div>
      </div>

      <div className="w-full max-w-xl space-y-4">
        <h2 className="text-3xl/snug font-medium">{personalInfo.headline}</h2>
        <p className="leading-7 text-muted-foreground">
          {personalInfo.subheadline}
        </p>
      </div>
    </Container>
  )
}
