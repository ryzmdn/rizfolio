"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface HeroEntranceProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  children: React.ReactNode
}

export function HeroEntrance({
  delay = 0.1,
  className,
  children,
  ...props
}: HeroEntranceProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const elements = container.querySelectorAll("[data-hero-element]")
      if (elements.length === 0) return

      if (prefersReducedMotion) {
        gsap.set(elements, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        elements,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          stagger: 0.12,
          ease: "power3.out",
        }
      )
    },
    { scope: containerRef, dependencies: [delay] }
  )

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  )
}

