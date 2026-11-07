"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlowCard({ className, children, ...props }: GlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [coords, setCoords] = React.useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = React.useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 transition-hover-lift hover:border-foreground/20",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, oklch(var(--foreground) / 0.05), transparent 70%)`,
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
      />
      {children}
    </div>
  )
}

