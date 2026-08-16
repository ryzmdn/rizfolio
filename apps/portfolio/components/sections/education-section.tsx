import { Container } from "@workspace/ui/components/layouts"
import { educationList } from "@/data/portfolio-data"

export function EducationSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">Education</h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Helping businesses build intuitive products that drive growth.
          </p>
        </div>
      </hgroup>

      <div className="w-full bg-transparent py-12">
        {educationList.map((edu, idx) => (
          <div
            key={idx}
            className="grid w-full items-center pb-12 lg:grid-cols-4"
          >
            <div className="w-full text-sm/6">
              <h3 className="relative w-max text-2xl font-medium text-primary">
                {edu.institution}{" "}
                <small className="absolute -right-5 text-xs opacity-50">
                  0{idx + 1}
                </small>
              </h3>
            </div>
            <div className="text-center text-muted-foreground lg:col-span-2">
              <p>{edu.degree}</p>
              <p>{edu.field}</p>
            </div>
            <div className="flex items-center justify-end gap-x-2 leading-7 text-muted-foreground">
              <p>{edu.period}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
