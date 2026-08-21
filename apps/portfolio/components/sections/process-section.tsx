import { Container } from "@workspace/ui/components/layouts"
import { engineeringProcess } from "@/data"

export function ProcessSection() {
  return (
    <Container
      id="process"
      className="space-y-16 bg-foreground py-16 md:rounded-4xl"
    >
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium text-secondary">
          Engineering Lifecycle
        </h2>

        <div className="leading-7 text-muted">
          <p>
            A deterministic, battle-tested methodology designed to transform
            complex product requirements into robust, production-ready software
            systems.
          </p>
        </div>
      </hgroup>

      <div className="flow-root gap-8 space-y-20 overflow-hidden">
        {engineeringProcess.map((item) => (
          <div key={item.name}>
            <time
              dateTime={item.dateTime}
              className="flex items-center text-sm/6 font-semibold text-muted"
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
                className="absolute -ml-2 h-px w-screen -translate-x-full bg-background/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
              />
            </time>
            <p className="mt-6 text-xl/8 font-medium tracking-tight text-secondary">
              {item.name}
            </p>
            <p className="mt-3.5 leading-7 text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}
