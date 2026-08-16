import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { Star } from "lucide-react"
import { openSourceProjects } from "@/data/portfolio-data"

export function OpenSourceSection() {
  return (
    <Container className="py-20">
      <hgroup className="w-full space-y-2">
        <h2 className="text-2xl font-medium">
          Open-source experiments & tools.
        </h2>

        <div className="leading-7 text-muted-foreground">
          <p>
            Helping businesses build intuitive products that drive growth.
          </p>
        </div>
      </hgroup>

      <div className="grid w-full gap-x-10 gap-y-14 py-10 sm:grid-cols-2">
        {openSourceProjects.map((project, idx) => (
          <div key={idx}>
            <hgroup className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">{project.name}</h3>
              </div>
              <div>
                <Badge variant="secondary">
                  <Star data-icon="inline-start" className="size-3.5 mr-1" />
                  {project.stars}
                </Badge>
              </div>
            </hgroup>

            <div className="my-5 w-full space-y-3">
              <p className="text-sm/6 text-muted-foreground">
                {project.description}
              </p>
              <Badge variant="secondary">{project.language}</Badge>
            </div>

            <div className="flex items-center gap-x-5">
              <a
                href={project.githubUrl}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                GitHub
              </a>
              <a
                href={project.demoUrl}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
