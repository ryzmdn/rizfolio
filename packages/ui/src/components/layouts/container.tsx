import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export type ContainerProps = React.ComponentPropsWithoutRef<"div">

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mx-auto size-full bg-transparent max-w-7xl px-4 sm:px-6 lg:px-8 min-w-xs", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"
