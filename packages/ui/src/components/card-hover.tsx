import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface CardHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  lift?: boolean
  glow?: boolean
  scaleImage?: boolean
  overlayFade?: boolean
  children: React.ReactNode
}

export function CardHover({
  lift = true,
  glow = true,
  scaleImage = false,
  overlayFade = false,
  className,
  children,
  ...props
}: CardHoverProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden transition-hover-lift",
        lift && "hover:-translate-y-1.5",
        glow && "hover:shadow-xl hover:border-foreground/20",
        scaleImage && "[&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-luxury group-hover:[&_img]:scale-105",
        overlayFade && "[&_.overlay]:transition-opacity [&_.overlay]:duration-300 group-hover:[&_.overlay]:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

