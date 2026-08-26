import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Hash } from "lucide-react"
import { Callout } from "./callout"
import { CodeBlock } from "./code-block"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { MetricCard, MetricGrid } from "./metrics"
import { FileTree, TreeFolder, TreeFile } from "./file-tree"
import { Steps, Step } from "./steps"

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as React.ElementType

  const sizeClasses: Record<number, string> = {
    1: "text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-12 mb-6 scroll-mt-24",
    2: "text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border/40 scroll-mt-24",
    3: "text-xl sm:text-2xl font-medium tracking-tight text-foreground mt-8 mb-3 scroll-mt-24",
    4: "text-lg font-medium tracking-tight text-foreground mt-6 mb-2 scroll-mt-24",
    5: "text-base font-medium tracking-tight text-foreground mt-4 mb-2 scroll-mt-24",
    6: "text-sm font-medium tracking-tight text-foreground mt-4 mb-2 scroll-mt-24",
  }

  const HeadingComponent = ({
    id,
    children,
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <Tag
        id={id}
        className={`group/heading relative flex items-center gap-2 ${sizeClasses[level]} ${className}`}
        {...props}
      >
        <span>{children}</span>
        {id && (
          <a
            href={`#${id}`}
            aria-label={`Link to section: ${String(children)}`}
            className="text-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100 hover:text-primary"
          >
            <Hash className="size-4" />
          </a>
        )}
      </Tag>
    )
  }
  HeadingComponent.displayName = `MDXHeading${level}`
  return HeadingComponent
}

export const defaultMDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={`my-4 text-sm leading-relaxed text-muted-foreground sm:text-base ${className}`}
      {...props}
    />
  ),
  strong: ({ className = "", ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={`font-semibold text-foreground ${className}`}
      {...props}
    />
  ),
  em: ({ className = "", ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className={`italic ${className}`} {...props} />
  ),
  blockquote: ({
    className = "",
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={`my-6 rounded-r-xl border-l-2 border-primary bg-muted/20 px-4.5 py-2.5 text-muted-foreground italic ${className}`}
      {...props}
    />
  ),
  ul: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={`my-4 ml-6 list-disc space-y-1 text-sm text-muted-foreground sm:text-base [&>li]:leading-relaxed ${className}`}
      {...props}
    />
  ),
  ol: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={`my-4 ml-6 list-decimal space-y-1 text-sm text-muted-foreground sm:text-base [&>li]:leading-relaxed ${className}`}
      {...props}
    />
  ),
  li: ({ className = "", ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={`leading-relaxed ${className}`} {...props} />
  ),
  hr: ({ className = "", ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={`my-8 border-border/60 ${className}`} {...props} />
  ),
  table: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-xl border border-border/80 bg-card shadow-xs">
      <table
        className={`w-full text-left text-xs sm:text-sm ${className}`}
        {...props}
      />
    </div>
  ),
  thead: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={`border-b border-border bg-muted/50 ${className}`}
      {...props}
    />
  ),
  tbody: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={`divide-y divide-border/60 ${className}`} {...props} />
  ),
  tr: ({
    className = "",
    ...props
  }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={`transition-colors hover:bg-muted/30 ${className}`}
      {...props}
    />
  ),
  th: ({
    className = "",
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={`px-4 py-3 font-semibold tracking-tight text-foreground ${className}`}
      {...props}
    />
  ),
  td: ({
    className = "",
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={`px-4 py-3 leading-relaxed text-muted-foreground ${className}`}
      {...props}
    />
  ),
  pre: ({
    className = "",
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    return (
      <CodeBlock className={className} {...props}>
        <pre className="overflow-x-auto">{children}</pre>
      </CodeBlock>
    )
  },
  code: ({
    className = "",
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes("language-")
    if (isInline) {
      return (
        <code
          className={`rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 font-mono text-[13px] font-normal text-foreground ${className}`}
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  a: ({
    href = "",
    className = "",
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternal = href.startsWith("/") || href.startsWith("#")
    if (isInternal) {
      return (
        <Link
          href={href}
          className={`font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-80 ${className}`}
          {...props}
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-80 ${className}`}
        {...props}
      >
        {children}
      </a>
    )
  },
  img: ({
    src,
    alt = "",
    className = "",
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null
    return (
      <div className="relative my-8 overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-sm">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-300 ${className}`}
        />

        {alt && (
          <div className="border-t border-border/40 bg-card/60 px-4 py-2 text-center text-xs text-muted-foreground">
            {alt}
          </div>
        )}
      </div>
    )
  },

  // Custom luxury components
  Callout,
  CodeBlock,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  MetricCard,
  MetricGrid,
  FileTree,
  TreeFolder,
  TreeFile,
  Steps,
  Step,
  Image,
}

export type MDXComponentsMap = typeof defaultMDXComponents

export function useMDXComponents(
  customComponents?: Partial<MDXComponentsMap>
): MDXComponentsMap {
  return {
    ...defaultMDXComponents,
    ...customComponents,
  }
}
