import { cn } from "@workspace/ui/lib/utils"
import React, { forwardRef } from "react"

export type HeaderProps = React.ComponentPropsWithoutRef<"header">

export const Footer = forwardRef<HTMLElement, HeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <footer ref={ref} className={cn(className)} {...props}>
        {children}
      </footer>
    )
  }
)

Footer.displayName = "Footer"
