"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface MagneticProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: number
  children: React.ReactNode
}

export function Magnetic({
  strength = 0.3,
  className,
  children,
  ...props
}: MagneticProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const isTouch = window.matchMedia("(pointer: coarse)").matches

      if (prefersReducedMotion || isTouch) return

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = el.getBoundingClientRect()
        const x = (clientX - (left + width / 2)) * strength
        const y = (clientY - (top + height / 2)) * strength

        gsap.to(el, {
          x,
          y,
          duration: 0.4,
          ease: "power2.out",
        })
      }

      const handleMouseLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        })
      }

      el.addEventListener("mousemove", handleMouseMove)
      el.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        el.removeEventListener("mousemove", handleMouseMove)
        el.removeEventListener("mouseleave", handleMouseLeave)
      }
    },
    { scope: containerRef, dependencies: [strength] }
  )

  return (
    <div
      ref={containerRef}
      className={cn("inline-block will-change-transform", className)}
      {...props}
    >
      {children}
    </div>
  )
}

