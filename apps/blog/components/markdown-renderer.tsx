import React from "react"
import { MDXRemoteRenderer } from "@workspace/ui/components/mdx"

interface MarkdownRendererProps {
  content: string
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null

  return <MDXRemoteRenderer source={content} />
}
