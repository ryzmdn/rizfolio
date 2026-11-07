"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "fade" | "slide-up" | "scale"
  duration?: number
  delay?: number
  distance?: number
  once?: boolean
  children: React.ReactNode
}

export function ScrollReveal({
  variant = "slide-up",
  duration = 0.8,
  delay = 0,
  distance = 30,
  once = true,
  className,
  children,
  ...props
}: ScrollRevealProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = containerRef.current
      if (!el) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 })
        return
      }

      const initialVars: gsap.TweenVars = { opacity: 0 }
      if (variant === "slide-up") initialVars.y = distance
      if (variant === "scale") initialVars.scale = 0.96

      gsap.fromTo(
        el,
        initialVars,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once,
          },
        }
      )
    },
    { scope: containerRef, dependencies: [variant, duration, delay, distance, once] }
  )

  return (
    <div ref={containerRef} className={cn("will-change-transform", className)} {...props}>
      {children}
    </div>
  )
}

