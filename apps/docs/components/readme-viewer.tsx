import { BookOpen } from "lucide-react"

export function ReadmeViewer({ content }: { content: string }) {
  if (!content) return null

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="flex items-center gap-2 border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <BookOpen className="size-4 text-foreground/80" />
        <span className="font-mono font-medium text-foreground">README.md</span>
      </div>

      <div className="prose dark:prose-invert max-w-none p-6 font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">
        {content}
      </div>
    </div>
  )
}
