import * as React from "react"
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedArrowProps extends React.SVGProps<SVGSVGElement> {
  direction?: "right" | "left" | "up" | "down"
  size?: number
  className?: string
}

export function AnimatedArrow({
  direction = "right",
  size = 16,
  className,
  ...props
}: AnimatedArrowProps) {
  const directionClasses = {
    right: "group-hover:translate-x-1",
    left: "group-hover:-translate-x-1",
    up: "group-hover:-translate-y-1",
    down: "group-hover:translate-y-1",
  }

  const Component = {
    right: ArrowRight,
    left: ArrowLeft,
    up: ArrowUp,
    down: ArrowDown,
  }[direction]

  return (
    <Component
      size={size}
      className={cn(
        "shrink-0 transition-transform duration-300 ease-luxury",
        directionClasses[direction],
        className
      )}
      {...props}
    />
  )
}

