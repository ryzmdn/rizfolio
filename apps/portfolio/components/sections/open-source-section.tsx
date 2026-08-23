import { Container } from "@workspace/ui/components/layouts"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { ExternalLink, Star } from "lucide-react"
import { Github } from "@workspace/ui/constants/icons"
import { openSourceProjects } from "@/data"

export function OpenSourceSection() {
  return (
    <Container id="experiments" className="flow-root space-y-12 py-20">
      <hgroup className="mx-auto max-w-3xl text-center">
        <small className="text-muted-foreground">Experiments</small>
        <h2 className="mt-2 mb-4 text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
          Open-Source Toolkits & Experiments
        </h2>
        <p className="text-muted-foreground">
          Developer utilities, libraries, and templates crafted to elevate
            developer ergonomics and give back to the engineering community.
        </p>
      </hgroup>

      <div className="grid w-full gap-x-8 gap-y-12 py-10 sm:grid-cols-2">
        {openSourceProjects.map((project, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6"
          >
            <div>
              <hgroup className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">
                  {project.name}
                </h3>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Star className="size-3" />
                  {project.stars}
                </Badge>
              </hgroup>

              <div className="my-4 space-y-3">
                <p className="text-sm/6 text-muted-foreground">
                  {project.description}
                </p>
                <Badge variant="outline" className="font-mono text-xs">
                  {project.language}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-x-3 border-t border-border/40 pt-4">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Github className="size-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <ExternalLink className="size-3.5" />
                <span>Documentation</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
