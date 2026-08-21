import React from "react"
import { Container } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ExternalLink, FileText, Mail } from "lucide-react"
import { personalInfo } from "@/data"
import { GitHub, LinkedIn } from "@workspace/ui/constants/icons"
import type { ProfileData } from "@/lib/queries"

interface AboutSectionProps {
  data?: ProfileData
}

export function AboutSection({ data = personalInfo }: AboutSectionProps) {
  const bio = data.bio || personalInfo.bio
  const emails = data.emails || personalInfo.emails
  const stats = data.stats || personalInfo.stats
  const resumeUrl = data.resumeUrl

  return (
    <Container id="journey" className="space-y-6 py-24">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-muted-foreground">
          About & Engineering Philosophy
        </h2>
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-x-2 rounded-lg text-xs"
            )}
          >
            <FileText className="size-3.5" />
            <span>Resume / CV</span>
          </a>
        )}
      </div>

      <div className="space-y-5">
        {bio.map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "text-lg/7 text-foreground"
                : "leading-7 text-muted-foreground"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {emails.map((item, index, array) => {
          const isEmail = item.includes("@")
          const isGithub = item.toLowerCase().includes("github")
          const isLinkedin = item.toLowerCase().includes("linkedin")
          const href = isEmail ? `mailto:${item}` : `https://${item}`

          return (
            <React.Fragment key={index}>
              <a
                href={href}
                target={isEmail ? undefined : "_blank"}
                rel={isEmail ? undefined : "noreferrer"}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "font-normal"
                )}
              >
                {isEmail ? (
                  <Mail className="size-4" />
                ) : isGithub ? (
                  <GitHub className="size-4" />
                ) : isLinkedin ? (
                  <LinkedIn className="size-4" />
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
        {stats.map((stat, index) => (
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
