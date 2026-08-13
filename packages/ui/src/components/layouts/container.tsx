import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface ContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  padded?: boolean
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ padded = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-7xl min-w-xs bg-transparent", 
          padded && "px-4 sm:px-6 lg:px-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = "Container"