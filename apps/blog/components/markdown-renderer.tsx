import React from "react"
import { highlightCodeBlock } from "@/lib/shiki"

interface MarkdownRendererProps {
  content: string
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const tokens = parseMarkdownContent(content)

  const renderedTokens = await Promise.all(
    tokens.map(async (token, idx) => {
      if (token.type === "code") {
        const highlightedHtml = await highlightCodeBlock(
          token.content,
          token.lang
        )
        return (
          <div
            key={idx}
            className="my-6 overflow-hidden rounded-xl border border-border/80 bg-muted/40 shadow-xs"
          >
            {token.lang && (
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/70 px-4 py-1.5 font-mono text-xs text-muted-foreground">
                <span>{token.lang}</span>
              </div>
            )}
            <div
              className="overflow-x-auto p-4 font-mono text-xs leading-relaxed [&_code]:bg-transparent! [&_pre]:bg-transparent!"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>
        )
      }

      return (
        <div
          key={idx}
          className="space-y-4"
          dangerouslySetInnerHTML={{
            __html: renderBasicMarkdown(token.content),
          }}
        />
      )
    })
  )

  return (
    <div className="space-y-6 text-sm leading-relaxed text-foreground/90 sm:text-base">
      {renderedTokens}
    </div>
  )
}

function parseMarkdownContent(
  content: string
): Array<{ type: "text" | "code"; content: string; lang?: string }> {
  const tokens: Array<{
    type: "text" | "code"
    content: string
    lang?: string
  }> = []
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      })
    }

    tokens.push({
      type: "code",
      lang: match[1] || undefined,
      content: match[2] || "",
    })

    lastIndex = codeBlockRegex.lastIndex
  }

  if (lastIndex < content.length) {
    tokens.push({
      type: "text",
      content: content.slice(lastIndex),
    })
  }

  return tokens
}

function renderBasicMarkdown(raw: string): string {
  let html = raw

  html = html.replace(
    /^### (.*$)/gim,
    '<h3 class="text-xl font-medium tracking-tight text-foreground mt-8 mb-3">$1</h3>'
  )
  html = html.replace(
    /^## (.*$)/gim,
    '<h2 class="text-2xl font-medium tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border/40">$1</h2>'
  )
  html = html.replace(
    /^# (.*$)/gim,
    '<h1 class="text-3xl font-medium tracking-tight text-foreground mt-12 mb-6">$1</h1>'
  )

  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-2 border-primary pl-4 py-1 my-4 italic text-muted-foreground bg-muted/20 rounded-r-lg">$1</blockquote>'
  )

  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
  html = html.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-medium text-foreground">$1</strong>'
  )
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

  html = html.replace(
    /`([^`]+)`/g,
    '<code class="rounded-md bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground font-normal border border-border/50">$1</code>'
  )

  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">$1</a>'
  )

  html = html.replace(
    /^- (.*$)/gim,
    '<li class="flex items-start gap-2 ml-4 list-disc">$1</li>'
  )

  html = html.replace(
    /^\d+\. (.*$)/gim,
    '<li class="ml-4 list-decimal">$1</li>'
  )

  const paragraphs = html.split(/\n\n+/).filter(Boolean)
  return paragraphs
    .map((p) => {
      const trimmed = p.trim()
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed
      }
      return `<p class="leading-relaxed text-muted-foreground">${trimmed}</p>`
    })
    .join("\n")
}
