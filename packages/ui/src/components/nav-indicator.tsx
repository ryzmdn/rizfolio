import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { cn } from "@workspace/ui/lib/utils"

export interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
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
        "group relative inline-flex items-center px-3 py-1.5 text-xs md:text-sm font-medium transition-colors-luxury outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 rounded-full",
        active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-3 right-3 h-[1.5px] bg-foreground transition-transform duration-300 ease-luxury origin-left",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  )
}

