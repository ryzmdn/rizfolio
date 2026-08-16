import React from "react"
import { Container } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ExternalLink, Mail } from "lucide-react"
import { personalInfo } from "@/data/portfolio-data"

export function AboutSection() {
  return (
    <Container id="journey" className="space-y-6 py-24">
      <h2 className="text-lg font-medium text-muted-foreground">About & Engineering Philosophy</h2>

      <div className="space-y-5">
        {personalInfo.bio.map((paragraph, index) => (
          <p
            key={index}
            className={index === 0 ? "text-lg/7 text-foreground" : "leading-7 text-muted-foreground"}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {personalInfo.emails.map((item, index, array) => {
          const isEmail = item.includes("@")
          const href = isEmail ? `mailto:${item}` : `https://${item}`

          return (
            <React.Fragment key={index}>
              <a
                href={href}
                target={isEmail ? undefined : "_blank"}
                rel={isEmail ? undefined : "noreferrer"}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "px-0 font-normal text-muted-foreground hover:text-foreground"
                )}
              >
                {isEmail ? (
                  <Mail className="size-4" />
                ) : (
                  <ExternalLink className="size-4" />
                )}
                <span>{item}</span>
              </a>

              {index !== array.length - 1 && (
                <span className="text-muted-foreground/60">&bull;</span>
              )}
            </React.Fragment>
          )
        })}
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
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
