import { Container } from "@workspace/ui/components/layouts"
import { BriefcaseBusiness } from "lucide-react"
import { personalInfo } from "@/data/portfolio-data"

export function CtaSection() {
  return (
    <Container className="my-20 w-full bg-foreground shadow-xl md:rounded-4xl">
      <div className="px-6 py-24 text-center shadow-2xl sm:px-16">
        <div className="mb-8 flex items-center justify-center gap-x-3 text-secondary">
          <BriefcaseBusiness className="size-4" />
          <p>Let&apos;s Work Together!</p>
        </div>

        <h2 className="text-4xl font-semibold tracking-tight text-balance text-secondary sm:text-5xl lg:text-6xl">
          Ready To Build Something Together
        </h2>
        <p className="mt-6 text-lg/8 text-pretty text-muted-foreground">
          Whether you&apos;re a brand, a platform or a creator - if
          you&apos;re serious about growing an audience and generating
          commercial value, let&apos;s talk.
        </p>

        <ul className="mt-16 grid gap-x-8 gap-y-10 text-secondary sm:mt-20 sm:grid-cols-2 sm:gap-y-16">
          {personalInfo.contactEmails.map((item, idx) => (
            <li
              key={idx}
              className="flex flex-col items-start gap-y-1 border-l border-border/10 pl-6"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <a
                href={`mailto:${item.email}`}
                className="text-xl font-medium tracking-tight hover:underline"
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
