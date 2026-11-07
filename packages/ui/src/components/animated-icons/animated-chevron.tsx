import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedChevronProps extends React.SVGProps<SVGSVGElement> {
  open?: boolean
  direction?: "down" | "right"
  size?: number
  className?: string
}

export function AnimatedChevron({
  open = false,
  direction = "down",
  size = 16,
  className,
  ...props
}: AnimatedChevronProps) {
  const Component = direction === "down" ? ChevronDown : ChevronRight

  return (
    <Component
      size={size}
      className={cn(
        "shrink-0 transition-transform duration-300 ease-luxury",
        direction === "down" && open && "rotate-180",
        direction === "right" && open && "rotate-90",
        className
      )}
      {...props}
    />
  )
}

