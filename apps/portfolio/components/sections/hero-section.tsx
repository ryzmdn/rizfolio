import { Container } from "@workspace/ui/components/layouts"
import { personalInfo } from "@/data"

export function HeroSection() {
  return (
    <Container className="flow-root space-y-8 py-32">
      <div className="relative flex max-sm:flex-col max-sm:gap-y-5 gap-x-6 sm:items-center">
        <div className="size-24 rounded-full bg-foreground/10 p-1.5 ring-1 ring-border ring-inset sm:size-28">
          <div className="size-full overflow-hidden rounded-full">
            <img
              src={personalInfo.avatar}
              alt={personalInfo.name}
              className="size-full object-cover shadow-xl ring-1 ring-border"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl/relaxed font-medium text-primary">
            {personalInfo.name}
          </h1>
          <p className="text-muted-foreground">{personalInfo.role}</p>
        </div>

        <div className="absolute top-0 right-0 flex items-center gap-x-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          <p className="text-sm/6 text-accent-foreground">Available for Work</p>
        </div>
      </div>

      <div className="w-full max-w-xl space-y-4">
        <h2 className="text-3xl/snug font-medium text-primary">
          {personalInfo.headline}
        </h2>
        <p className="leading-7 text-muted-foreground">
          {personalInfo.subheadline}
        </p>
      </div>
    </Container>
  )
}
