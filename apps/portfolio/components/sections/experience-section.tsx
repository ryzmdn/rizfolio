import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { experienceList } from "@/data"

export function ExperienceSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Professional Experience</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Demonstrated track record of engineering scalable platforms,
            leading frontend systems, and collaborating with cross-functional
            teams.
          </p>
        </div>
      </hgroup>

      <div className="flow-root w-full space-y-12 divide-y divide-border py-10">
        {experienceList.map((exp, idx) => (
          <div key={idx} className="w-full space-y-5 bg-transparent pt-10 first:pt-0">
            <hgroup className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
              <div className="text-sm/6">
                <h3 className="text-xl font-medium text-primary">
                  {exp.role}
                </h3>
                <div className="flex items-center gap-x-2 text-muted-foreground">
                  <p className="font-medium text-foreground">{exp.company}</p>
                  <span className="text-xs">&bull;</span>
                  <p>{exp.type}</p>
                </div>
                <p className="text-xs text-muted-foreground/80">{exp.location}</p>
              </div>
              <div className="text-start sm:text-end text-sm/6 text-muted-foreground">
                <p className="font-medium text-foreground">{exp.period}</p>
                <p className="text-xs">{exp.workMode}</p>
              </div>
            </hgroup>

            <div className="w-full leading-7 text-muted-foreground">
              <p>{exp.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {exp.skills.map((skill, sIdx) => (
                <Badge key={sIdx} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
