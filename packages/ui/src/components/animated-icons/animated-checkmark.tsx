import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedCheckmarkProps extends React.SVGProps<SVGSVGElement> {
  checked?: boolean
  size?: number
  className?: string
}

export function AnimatedCheckmark({
  checked = true,
  size = 16,
  className,
  ...props
}: AnimatedCheckmarkProps) {
  return (
    <Check
      size={size}
      className={cn(
        "shrink-0 transition-transform duration-300 ease-spring",
        checked ? "scale-100 opacity-100" : "scale-0 opacity-0",
        className
      )}
      {...props}
    />
  )
}
