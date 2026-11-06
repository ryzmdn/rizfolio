import { Container } from "@workspace/ui/components/layouts"
import { experienceList as fallbackExperienceList, educationList, certifications as fallbackCertifications } from "@/data"
import { ArrowUpRight, Award, GraduationCap } from "lucide-react"
import type { ExperienceItem, EducationItem, CertificationItem } from "@/lib/queries"

interface ExperienceSectionProps {
  experiences?: ExperienceItem[]
  education?: EducationItem[]
  certifications?: CertificationItem[]
}

export function ExperienceSection({
  experiences = fallbackExperienceList,
  education = educationList,
  certifications = fallbackCertifications,
}: ExperienceSectionProps) {
  return (
    <Container id="archive" className="py-24 md:py-36">
      <div id="experience" className="space-y-16 lg:space-y-24">
        <div className="flex flex-col gap-6 border-b border-foreground/6 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase">
              [ 04 / CAREER ARCHIVE & TRACK RECORD ]
            </span>
            <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Chronological track record & engineering ledger.
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs leading-relaxed text-muted-foreground">
            Demonstrated engineering leadership spanning production SaaS platforms, distributed systems, and modern component architectures.
          </p>
        </div>

        <div className="space-y-12">
          <div className="border-b border-foreground/6 pb-3">
            <h3 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
              PROFESSIONAL ENGAGEMENTS & LEADERSHIP
            </h3>
          </div>

          <div className="divide-y divide-foreground/6">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="group py-8 transition-colors duration-200 hover:bg-foreground/[0.01] sm:py-10"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="space-y-1 lg:col-span-3">
                    <span className="font-mono text-xs font-medium text-foreground">
                      {exp.period}
                    </span>
                    <p className="font-mono text-[11px] text-muted-foreground uppercase">
                      {exp.location || "Remote / Global"}
                    </p>
                  </div>

                  <div className="space-y-2 lg:col-span-4">
                    <h4 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                      {exp.role}
                    </h4>
                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span className="text-foreground/80 font-medium">{exp.company}</span>
                      {exp.type && (
                        <>
                          <span>•</span>
                          <span>{exp.type}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 lg:col-span-5">
                    <p className="text-xs font-light leading-relaxed text-muted-foreground sm:text-sm">
                      {exp.description}
                    </p>

                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md border border-foreground/8 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] text-foreground/80"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 border-t border-foreground/6 pt-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-foreground/6 pb-3">
              <GraduationCap className="size-4 text-muted-foreground" />
              <h3 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
                ACADEMIC THEORY & FOUNDATIONS
              </h3>
            </div>

            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>{edu.institution}</span>
                    <span>{edu.period}</span>
                  </div>
                  <h4 className="text-base font-medium text-foreground">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-light text-muted-foreground">
                    {edu.field}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-foreground/6 pb-3">
              <Award className="size-4 text-muted-foreground" />
              <h3 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
                CREDENTIALS & INDUSTRY BENCHMARKS
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {certifications.slice(0, 6).map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between rounded-xl border border-foreground/8 bg-foreground/[0.01] p-3 text-xs transition-colors hover:border-foreground/20"
                >
                  <span className="font-light text-foreground/90">{cert.title}</span>
                  <ArrowUpRight className="size-3 text-muted-foreground shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
