import { Container } from "@workspace/ui/components/layouts/container"
import { FolderGit2, ArrowUpRight } from "lucide-react"

export default function ArchivePage() {
  return (
    <Container className="py-20">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <FolderGit2 className="size-3.5" />
          <span>Code & Assignment Archive</span>
        </div>
        <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Open Source & Academic Archive
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          A minimalist repository explorer for university coursework, mini
          experiments, and open-source tools.
        </p>
      </div>
    </Container>
  )
}
