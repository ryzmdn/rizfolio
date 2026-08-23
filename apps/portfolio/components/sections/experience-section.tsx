import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { SectionEyebrow } from "@workspace/ui/components/section-eyebrow"
import Image from "next/image"
import { experienceList as fallbackExperienceList } from "@/data"
import type { ExperienceItem } from "@/lib/queries"

interface ExperienceSectionProps {
  experiences?: ExperienceItem[]
  sectionNumber?: number | string
}

export function ExperienceSection({
  experiences = fallbackExperienceList,
  sectionNumber = 8,
}: ExperienceSectionProps) {
  return (
    <Container id="experience" className="space-y-12 py-20">
      <hgroup className="w-full space-y-2">
        <SectionEyebrow number={sectionNumber} label="Career History." />
        <h2 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          Professional Experience
        </h2>
        <p className="leading-7 text-muted-foreground">
          Demonstrated track record of engineering scalable platforms, leading
          frontend systems, and collaborating with cross-functional teams.
        </p>
      </hgroup>

      <div className="flow-root w-full space-y-12 divide-y divide-border py-10">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="w-full space-y-5 bg-transparent pt-10 first:pt-0"
          >
            <hgroup className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-x-5">
                {exp.logo ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      fill
                      priority
                      className="size-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="text-sm/6">
                  <h3 className="text-xl font-medium text-primary">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-x-2 text-muted-foreground">
                    <p className="font-medium text-foreground">{exp.company}</p>
                    {exp.type && (
                      <>
                        <span className="text-xs">&bull;</span>
                        <p>{exp.type}</p>
                      </>
                    )}
                  </div>
                  {exp.location && (
                    <p className="text-xs text-muted-foreground/80">
                      {exp.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-start text-sm/6 text-muted-foreground sm:text-end">
                <p className="font-medium text-foreground">{exp.period}</p>
                {exp.workMode && <p className="text-xs">{exp.workMode}</p>}
              </div>
            </hgroup>

            <div className="w-full leading-7 text-muted-foreground">
              <p>{exp.description}</p>
            </div>

            {exp.skills && exp.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {exp.skills.map((skill, sIdx) => (
                  <Badge key={sIdx} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  )
}
