import { Container } from "@workspace/ui/components/layouts"
import { SectionEyebrow } from "@workspace/ui/components/section-eyebrow"
import { engineeringProcess } from "@/data"

interface ProcessSectionProps {
  sectionNumber?: number | string
}

export function ProcessSection({ sectionNumber = 3 }: ProcessSectionProps) {
  return (
    <Container id="process" className="space-y-16 py-20">
      <hgroup className="w-full space-y-2">
        <SectionEyebrow number={sectionNumber} label="Engineering Process." />
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Engineering Lifecycle
        </h2>
        <p className="leading-7 text-muted-foreground">
          A deterministic, battle-tested methodology designed to transform
          complex product requirements into robust, production-ready software
          systems.
        </p>
      </hgroup>

      <div className="grid gap-x-8 gap-y-16 overflow-hidden py-10 md:grid-cols-2">
        {engineeringProcess.map((item) => (
          <div key={item.name}>
            <time
              dateTime={item.dateTime}
              className="flex items-center text-sm/6 text-muted-foreground"
            >
              <svg
                viewBox="0 0 4 4"
                aria-hidden="true"
                className="mr-4 size-1 flex-none"
              >
                <circle r={2} cx={2} cy={2} fill="currentColor" />
              </svg>
              {item.date}
              <div
                aria-hidden="true"
                className="absolute -ml-2 h-px w-screen -translate-x-full bg-border sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              />
            </time>
            <p className="mt-6 text-xl/8 font-medium tracking-tight text-primary">
              {item.name}
            </p>
            <p className="mt-3.5 leading-7 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Container>
  )
}
