import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { experienceList } from "@/data/portfolio-data"

export function ExperienceSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Experience</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Helping businesses build intuitive products that drive growth.
          </p>
        </div>
      </hgroup>

      <div className="flow-root w-full space-y-10 divide-y divide-border py-10">
        {experienceList.map((exp, idx) => (
          <div key={idx} className="w-full space-y-5 bg-transparent pb-10">
            <hgroup className="flex items-center justify-between">
              <div className="w-full text-sm/6">
                <h3 className="text-lg font-medium text-primary">
                  {exp.role}
                </h3>
                <div className="flex items-center gap-x-2 text-muted-foreground">
                  <p>{exp.company}</p>
                  <span className="text-xs">&bull;</span>
                  <p>{exp.type}</p>
                </div>
                <p className="text-muted-foreground">{exp.location}</p>
              </div>
              <div className="text-end text-sm/6 text-muted-foreground">
                <p>{exp.period}</p>
                <p>{exp.workMode}</p>
              </div>
            </hgroup>

            <div className="w-full leading-7">
              <p>{exp.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {exp.skills.map((skill, sIdx) => (
                <Badge key={sIdx} variant="secondary">
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
