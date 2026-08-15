import { cn } from "@workspace/ui/lib/utils"
import React, { forwardRef } from "react"

export type HeaderProps = React.ComponentPropsWithoutRef<"header">

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <header ref={ref} className={cn(className)} {...props}>
        {children}
      </header>
    )
  }
)

Header.displayName = "Header"
