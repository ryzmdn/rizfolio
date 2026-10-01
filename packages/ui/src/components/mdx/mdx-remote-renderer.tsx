import React from "react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import { defaultMDXComponents } from "./mdx-components"

interface MDXRemoteRendererProps {
  source: string
  components?: Record<string, React.ComponentType<unknown>>
  className?: string
}

export async function MDXRemoteRenderer({
  source,
  components = {},
  className = "",
}: MDXRemoteRendererProps) {
  if (!source || !source.trim()) {
    return null
  }

  return (
    <div className={`mdx-content space-y-4 ${className}`}>
      <MDXRemote
        source={source}
        components={{
          ...defaultMDXComponents,
          ...components,
        }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "wrap",
                  properties: {
                    className: ["subheading-anchor"],
                    ariaLabel: "Link to section",
                  },
                },
              ],
              [
                rehypePrettyCode,
                {
                  theme: "github-dark-dimmed",
                  keepBackground: false,
                  defaultLang: "typescript",
                },
              ],
            ],
          },
        }}
      />
    </div>
  )
}
