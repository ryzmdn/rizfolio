import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { cn } from "@workspace/ui/lib/utils"

export interface NavLinkProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  active?: boolean
  children: React.ReactNode
  className?: string
}

export function NavLink({
  href,
  active = false,
  className,
  children,
  ...props
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors-luxury outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 md:text-sm",
        active
          ? "font-semibold text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-3 bottom-0 left-3 h-[1.5px] origin-left bg-foreground transition-transform duration-300 ease-luxury",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  )
}
