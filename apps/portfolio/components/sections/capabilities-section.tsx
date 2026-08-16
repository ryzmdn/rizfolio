import { Brain, BrainCircuit, Handshake } from "lucide-react"
import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { Marquee } from "@workspace/ui/components/marquee"

const softSkillsList = [
  "Strategic Communication",
  "Product-Driven Mindset",
  "Cross-Functional Leadership",
  "Pragmatic Problem Solving",
  "Agile Sprint Delivery",
  "Mentorship & Code Review",
  "Stakeholder Alignment",
  "Root Cause Analysis",
]

const hardSkillsList = [
  "Next.js 16 & React 19",
  "TypeScript (Strict Mode)",
  "Node.js & Express / Hono",
  "PostgreSQL & Redis Caching",
  "Tailwind CSS v4 & Radix UI",
  "Docker & Turborepo",
  "REST & GraphQL / tRPC APIs",
  "Edge Functions & Serverless",
]

const knowledgeSkillsList = [
  "System Design & Microservices",
  "CI/CD Pipeline Automation",
  "Web Performance (Core Web Vitals)",
  "WCAG 2.1 Accessibility (a11y)",
  "Distributed State Management",
  "Database Indexing & Modeling",
  "Observability & Telemetry",
  "Applied LLMs & Prompt Engineering",
]

export function CapabilitiesSection() {
  return (
    <Container id="capabilities" className="w-full space-y-12 py-20">
      <hgroup className="grid w-full space-y-2 lg:grid-cols-2">
        <h2 className="text-2xl font-medium">Core Competencies & Stack</h2>

        <div className="text-2xl/snug">
          <p>
            Architecting resilient digital solutions with precision.{" "}
            <span className="text-muted-foreground">
              A balanced synthesis of technical mastery, system thinking, and
              collaborative leadership.
            </span>
          </p>
        </div>
      </hgroup>

      <div className="grid w-full min-w-0 gap-4 lg:grid-cols-3">
        {/* Soft Skills Card */}
        <div className="relative w-full min-w-0 space-y-1.5 overflow-hidden rounded-2xl p-1.5">
          <hgroup className="flex items-center justify-between rounded-xl bg-background px-3 py-2 shadow-2xl">
            <h2 className="font-medium">Soft Skills & Leadership</h2>
            <div className="flex size-8 items-center justify-center rounded-md">
              <Handshake className="size-5" />
            </div>
          </hgroup>
          <div className="rounded-xl p-4">
            <p className="text-sm/6 text-muted-foreground">
              Interpersonal strengths, strategic clarity, and active ownership
              to foster productive, high-trust engineering cultures.
            </p>

            <div className="relative w-full min-w-0 overflow-hidden py-10">
              <Marquee pauseOnHover className="[--gap:8px]">
                {softSkillsList.slice(0, 4).map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </Marquee>
              <Marquee pauseOnHover reverse className="[--gap:8px]">
                {softSkillsList.slice(4).map((skill) => (
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
            <h2 className="font-medium">Technical Proficiencies</h2>
            <div className="flex size-8 items-center justify-center rounded-md bg-background">
              <BrainCircuit className="size-5 text-primary" />
            </div>
          </hgroup>
          <div className="rounded-xl bg-brand p-4">
            <p className="text-sm/6 text-secondary">
              Modern frontend and backend engineering, strict type safety,
              modular design systems, and resilient database modeling.
            </p>

            <div className="relative w-full min-w-0 overflow-hidden py-10">
              <Marquee pauseOnHover className="[--gap:8px]">
                {hardSkillsList.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-secondary">
                    {skill}
                  </Badge>
                ))}
              </Marquee>
              <Marquee pauseOnHover reverse className="[--gap:8px]">
                {hardSkillsList.slice(4).map((skill) => (
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
            <h2 className="font-medium">Architecture & Domain</h2>
            <div className="flex size-8 items-center justify-center rounded-md bg-background">
              <Brain className="size-5 text-primary" />
            </div>
          </hgroup>
          <div className="rounded-xl p-4">
            <p className="text-sm/6 text-muted-foreground">
              Deep runtime profiling, automated delivery pipelines, distributed
              boundaries, and security-first cloud architecture.
            </p>

            <div className="relative w-full min-w-0 overflow-hidden py-10">
              <Marquee pauseOnHover className="[--gap:8px]">
                {knowledgeSkillsList.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </Marquee>
              <Marquee pauseOnHover reverse className="[--gap:8px]">
                {knowledgeSkillsList.slice(4).map((skill) => (
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
