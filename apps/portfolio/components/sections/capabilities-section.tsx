import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { Marquee } from "@workspace/ui/components/marquee"
import { Brain, BrainCircuit, Handshake } from "lucide-react"

const softSkillsList = [
  "Communication",
  "Problem Solving",
  "Leadership",
  "Teamwork",
  "Adaptability",
  "Critical Thinking",
]

const hardSkillsList = [
  "React & Next.js",
  "TypeScript",
  "Node.js",
  "Cloud Architecture",
  "PostgreSQL",
  "API Design",
]

const knowledgeSkillsList = [
  "System Design",
  "Data Structures",
  "CI/CD Pipelines",
  "Software Patterns",
  "Observability",
  "Performance Profiling",
]

export function CapabilitiesSection() {
  return (
    <Container id="capabilities" className="w-full space-y-12 py-20">
      <hgroup className="grid w-full space-y-2 lg:grid-cols-2">
        <h2 className="text-2xl font-medium">Core Infrastructure</h2>

        <div className="text-2xl/snug">
          <p>
            Design solutions that elevate brands and create seamless user
            experiences.{" "}
            <span className="text-muted-foreground">
              I help bring ideas to life with strategy and creativity
            </span>
          </p>
        </div>
      </hgroup>

      <div className="grid w-full min-w-0 gap-4 lg:grid-cols-3">
        {/* Soft Skills Card */}
        <div className="relative w-full min-w-0 space-y-1.5 overflow-hidden rounded-2xl p-1.5">
          <hgroup className="flex items-center justify-between rounded-xl bg-background px-3 py-2 shadow-2xl">
            <h2 className="font-medium">Soft Skills</h2>
            <div className="flex size-8 items-center justify-center rounded-md">
              <Handshake className="size-5" />
            </div>
          </hgroup>
          <div className="rounded-xl p-4">
            <p className="text-sm/6 text-muted-foreground">
              Interpersonal strengths, strategic communication, and proactive
              problem-solving to drive cross-functional collaboration.
            </p>

            <div className="relative w-full min-w-0 overflow-hidden py-10">
              <Marquee pauseOnHover className="[--gap:8px]">
                {softSkillsList.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </Marquee>
              <Marquee pauseOnHover reverse className="[--gap:8px]">
                {softSkillsList.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </Marquee>

              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background/90 to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background/90 to-transparent sm:w-16" />
            </div>
          </div>
        </div>

        {/* Hard Skills Card */}
        <div className="w-full min-w-0 space-y-1.5 overflow-hidden rounded-2xl bg-foreground p-1 shadow-2xl lg:h-max">
          <hgroup className="flex items-center justify-between rounded-xl bg-brand px-3 py-2 text-secondary shadow">
            <h2 className="font-medium">Hard Skills</h2>
            <div className="flex size-8 items-center justify-center rounded-md bg-background">
              <BrainCircuit className="size-5 text-primary" />
            </div>
          </hgroup>
          <div className="rounded-xl bg-brand p-4">
            <p className="text-sm/6 text-secondary">
              Modern frontend and backend engineering, type safety, modular
              architectures, and high-performance serverless deployment.
            </p>

            <div className="relative w-full min-w-0 overflow-hidden py-10">
              <Marquee pauseOnHover className="[--gap:8px]">
                {hardSkillsList.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-secondary">
                    {skill}
                  </Badge>
                ))}
              </Marquee>
              <Marquee pauseOnHover reverse className="[--gap:8px]">
                {hardSkillsList.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-secondary">
                    {skill}
                  </Badge>
                ))}
              </Marquee>

              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 h-full w-12 bg-linear-to-r from-brand/90 to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 h-full w-12 bg-linear-to-l from-brand/90 to-transparent sm:w-16" />
            </div>
          </div>
        </div>

        {/* Knowledge Skills Card */}
        <div className="w-full min-w-0 space-y-1.5 overflow-hidden rounded-2xl p-1.5">
          <hgroup className="flex items-center justify-between rounded-xl bg-background px-3 py-2 shadow-2xl">
            <h2 className="font-medium">Knowledge Skills</h2>
            <div className="flex size-8 items-center justify-center rounded-md bg-background">
              <Brain className="size-5 text-primary" />
            </div>
          </hgroup>
          <div className="rounded-xl p-4">
            <p className="text-sm/6 text-muted-foreground">
              Theoretical foundations, scalable system boundaries, automated
              deployment pipelines, and deep runtime optimization.
            </p>

            <div className="relative w-full min-w-0 overflow-hidden py-10">
              <Marquee pauseOnHover className="[--gap:8px]">
                {knowledgeSkillsList.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </Marquee>
              <Marquee pauseOnHover reverse className="[--gap:8px]">
                {knowledgeSkillsList.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </Marquee>

              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background/90 to-transparent sm:w-16" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background/90 to-transparent sm:w-16" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
