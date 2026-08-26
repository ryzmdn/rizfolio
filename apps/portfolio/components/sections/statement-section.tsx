import { Container } from "@workspace/ui/components/layouts"

export function StatementSection() {
  return (
    <Container id="statement" className="py-10">
      <div className="mx-auto max-w-4xl space-y-5 text-center">
        <p className="text-sm/6 text-muted-foreground">
          Engineering Mission & Philosophy
        </p>
        <p className="text-2xl/snug font-medium text-foreground sm:text-3xl/snug">
          Building high-impact digital systems at the intersection of robust
          architecture, refined interface design, and scalable performance —{" "}
          <span className="text-muted-foreground">
            turning complex technical challenges into seamless, elegant software
            experiences.
          </span>
        </p>
      </div>
    </Container>
  )
}
