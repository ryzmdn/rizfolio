import { BookOpen } from "lucide-react"
import { MDXRemoteRenderer } from "@workspace/ui/components/mdx"
import { TableOfContents } from "./table-of-contents"
import { CopyMarkdownButton } from "./copy-markdown-button"

export function ReadmeViewer({ content }: { content: string }) {
  if (!content) return null

  const words = content.trim().split(/\s+/).length
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200))

  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 shadow-xs backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-foreground/8 bg-foreground/[0.02] px-5 py-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <BookOpen className="size-4 text-foreground/80" />
          <span className="font-mono font-medium text-foreground">
            README.md
          </span>
          <span className="text-foreground/20">•</span>
          <span className="font-mono text-[11px] tabular-nums">
            {readingTimeMinutes} min read
          </span>
        </div>

        <CopyMarkdownButton content={content} />
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8 xl:col-span-9">
            <MDXRemoteRenderer source={content} />
          </div>

          <div className="lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-24">
              <TableOfContents content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
