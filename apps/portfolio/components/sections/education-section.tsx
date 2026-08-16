import { Container } from "@workspace/ui/components/layouts"
import { educationList } from "@/data/portfolio-data"

export function EducationSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Academic Background</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Formal foundation in computer science and software theory
            complemented by continuous specialized certifications in modern
            system architecture.
          </p>
        </div>
      </hgroup>

      <div className="w-full divide-y divide-border/60 py-10">
        {educationList.map((edu, idx) => (
          <div
            key={idx}
            className="grid w-full items-center py-8 lg:grid-cols-4"
          >
            <div className="w-full text-sm/6">
              <h3 className="relative w-max text-xl font-medium text-primary">
                {edu.institution}{" "}
                <small className="absolute -right-7 text-xs font-normal opacity-50">
                  0{idx + 1}
                </small>
              </h3>
            </div>
            <div className="text-start lg:text-center text-muted-foreground lg:col-span-2 mt-2 lg:mt-0">
              <p className="font-medium text-foreground">{edu.degree}</p>
              <p className="text-sm">{edu.field}</p>
            </div>
            <div className="flex items-center justify-start lg:justify-end gap-x-2 leading-7 text-sm font-medium text-muted-foreground mt-2 lg:mt-0">
              <p>{edu.period}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
