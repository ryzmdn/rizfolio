import React from "react"
import { Container } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { User } from "lucide-react"
import { personalInfo } from "@/data/portfolio-data"

export function AboutSection() {
  return (
    <Container id="journey" className="space-y-6 py-24">
      <h2 className="text-lg text-muted-foreground">About My self</h2>

      <div className="space-y-5">
        {personalInfo.bio.map((paragraph, index) => (
          <p
            key={index}
            className={index === 0 ? "text-lg/7" : "leading-7 text-muted-foreground"}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-x-4">
        {personalInfo.emails.map((email, index, array) => (
          <React.Fragment key={index}>
            <a
              href={`mailto:${email}`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "font-normal"
              )}
            >
              <User className="size-4" />
              <span>{email}</span>
            </a>

            {index !== array.length - 1 && (
              <span className="text-muted-foreground">&bull;</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <dl className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-16 lg:grid lg:grid-cols-4">
        {personalInfo.stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <dt className="text-sm/7 text-muted-foreground">{stat.label}</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-accent-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  )
}
