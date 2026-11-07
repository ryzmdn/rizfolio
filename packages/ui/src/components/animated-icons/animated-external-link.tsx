import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedExternalLinkProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export function AnimatedExternalLink({
  size = 14,
  className,
  ...props
}: AnimatedExternalLinkProps) {
  return (
    <ArrowUpRight
      size={size}
      className={cn(
        "shrink-0 opacity-60 transition-transform-luxury group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100",
        className
      )}
      {...props}
    />
  )
}
