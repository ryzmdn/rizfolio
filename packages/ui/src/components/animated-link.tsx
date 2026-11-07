import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@workspace/ui/lib/utils"

const animatedLinkVariants = cva(
  "group inline-flex cursor-pointer items-center gap-1 rounded-xs text-sm font-medium transition-colors-luxury outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
  {
    variants: {
      variant: {
        underline:
          "link-underline-slide text-foreground hover:text-foreground/80",
        arrow: "text-foreground hover:text-foreground/80",
        external: "text-foreground hover:text-foreground/80",
        fade: "text-muted-foreground transition-opacity-luxury hover:text-foreground",
        pill: "rounded-full border border-foreground/10 bg-card/60 px-3.5 py-1 text-xs text-muted-foreground backdrop-blur-xs transition-hover-lift hover:border-foreground/30 hover:bg-foreground/[0.04] hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  }
)

export interface AnimatedLinkProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps,
    VariantProps<typeof animatedLinkVariants> {
  children: React.ReactNode
  isExternal?: boolean
  className?: string
}

export function AnimatedLink({
  href,
  variant = "underline",
  children,
  isExternal = false,
  className,
  ...props
}: AnimatedLinkProps) {
  const content = (
    <>
      <span>{children}</span>
      {variant === "arrow" && (
        <ArrowRight className="size-3.5 transition-transform duration-300 ease-luxury group-hover:translate-x-1" />
      )}
      {(variant === "external" || isExternal) && variant !== "arrow" && (
        <ArrowUpRight className="size-3.5 opacity-70 transition-transform duration-300 ease-luxury group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      )}
    </>
  )

  if (
    isExternal ||
    (typeof href === "string" &&
      (href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:")))
  ) {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(animatedLinkVariants({ variant, className }))}
        {...props}
      >
        {content}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(animatedLinkVariants({ variant, className }))}
      {...props}
    >
      {content}
    </Link>
  )
}
