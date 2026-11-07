import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedToggleProps extends React.SVGProps<SVGSVGElement> {
  open?: boolean
  size?: number
  className?: string
}

export function AnimatedToggle({
  open = false,
  size = 16,
  className,
  ...props
}: AnimatedToggleProps) {
  return (
    <Plus
      size={size}
      className={cn(
        "shrink-0 transition-transform duration-300 ease-luxury",
        open && "rotate-45",
        className
      )}
      {...props}
    />
  )
}
