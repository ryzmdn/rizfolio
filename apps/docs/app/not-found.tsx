import Link from "next/link"
import { Container } from "@workspace/ui/components/layouts/container"
import { buttonVariants } from "@workspace/ui/components/button"
import { FolderGit2, ArrowLeft, BookOpen } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export default function DocsNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-card text-muted-foreground shadow-xs">
          <FolderGit2 className="size-6 text-primary" />
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs text-muted-foreground">
            404 Notice
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h1>
          <p className="text-xs/relaxed text-muted-foreground sm:text-sm/relaxed">
            The documentation resource, repository catalog, or file you are trying to access does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className={cn(buttonVariants({ size: "sm" }), "gap-x-2 text-xs px-4")}
          >
            <ArrowLeft className="size-3.5" />
            <span>Browse All Repositories</span>
          </Link>
          <Link
            href="/categories"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-x-2 text-xs px-4"
            )}
          >
            <BookOpen className="size-3.5" />
            <span>Academic Curriculum</span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
