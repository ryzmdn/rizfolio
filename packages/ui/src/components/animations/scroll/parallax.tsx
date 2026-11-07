"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface SubtleParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number
  direction?: "up" | "down"
  children: React.ReactNode
}

export function SubtleParallax({
  speed = 30,
  direction = "up",
  className,
  children,
  ...props
}: SubtleParallaxProps) {
  const targetRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = targetRef.current
      if (!el) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const isTouch = window.matchMedia("(pointer: coarse)").matches

      if (prefersReducedMotion || isTouch) return

      const yDistance = direction === "up" ? -speed : speed

      gsap.to(el, {
        y: yDistance,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    },
    { scope: targetRef, dependencies: [speed, direction] }
  )

  return (
    <div ref={targetRef} className={cn("will-change-transform", className)} {...props}>
      {children}
    </div>
  )
}

