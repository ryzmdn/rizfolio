declare module "*.mdx" {
  import type { ComponentType, ReactNode } from "react"

  interface MDXProps {
    [key: string]: unknown
    components?: Record<string, ComponentType<unknown>>
    children?: ReactNode
  }

  const MDXComponent: ComponentType<MDXProps>
  export default MDXComponent

  export const frontmatter: Record<string, unknown>
}

declare module "*.md" {
  import type { ComponentType, ReactNode } from "react"

  interface MDProps {
    [key: string]: unknown
    components?: Record<string, ComponentType<unknown>>
    children?: ReactNode
  }

  const MDComponent: ComponentType<MDProps>
  export default MDComponent

  export const frontmatter: Record<string, unknown>
}
