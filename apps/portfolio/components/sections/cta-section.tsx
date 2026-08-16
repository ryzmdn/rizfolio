import { Container } from "@workspace/ui/components/layouts"
import { BriefcaseBusiness, Mail } from "lucide-react"
import { personalInfo } from "@/data"

export function CtaSection() {
  return (
    <Container id="call-to-action" className="my-20 w-full bg-foreground shadow-xl md:rounded-4xl">
      <div className="px-6 py-24 text-center shadow-2xl sm:px-16">
        <div className="mb-6 inline-flex items-center justify-center gap-x-2 rounded-full text-secondary text-sm">
          <BriefcaseBusiness className="size-4" />
          <span>Available for High-Impact Projects</span>
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-balance text-secondary sm:text-5xl lg:text-6xl">
          Ready to Build Something Exceptional?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base/relaxed text-pretty text-muted sm:text-lg/8">
          Whether you&apos;re launching a new digital venture, scaling existing
          cloud systems, or seeking high-caliber engineering leadership—let&apos;s
          turn ambitious visions into deterministic reality.
        </p>

        <ul className="mt-14 grid gap-6 text-secondary sm:mt-16 sm:grid-cols-2">
          {personalInfo.contactEmails.map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col items-start gap-y-1.5 rounded-xl border border-secondary/10 bg-secondary/5 p-6 text-start backdrop-blur-xs transition-colors hover:bg-secondary/10"
            >
              <div className="flex items-center gap-x-2 text-xs uppercase tracking-wider text-muted">
                <Mail className="size-3.5" />
                <span>{item.label}</span>
              </div>
              <a
                href={`mailto:${item.email}`}
                className="text-lg font-medium tracking-tight text-secondary hover:underline sm:text-xl"
              >
                {item.email}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
