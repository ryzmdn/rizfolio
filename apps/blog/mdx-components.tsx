import type { MDXComponents } from "mdx/types"
import { useMDXComponents as useSharedMDXComponents } from "@workspace/ui/components/mdx"

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...useSharedMDXComponents(),
    ...components,
  } as unknown as MDXComponents
}
