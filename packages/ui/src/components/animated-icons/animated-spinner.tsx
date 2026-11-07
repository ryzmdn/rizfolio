import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export function AnimatedSpinner({
  size = 16,
  className,
  ...props
}: AnimatedSpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn("shrink-0 animate-spin text-muted-foreground", className)}
      {...props}
    />
  )
}

