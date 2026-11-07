"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  stagger?: number
  duration?: number
  distance?: number
  itemSelector?: string
  once?: boolean
  children: React.ReactNode
}

export function StaggerContainer({
  stagger = 0.08,
  duration = 0.7,
  distance = 24,
  itemSelector = ".stagger-item",
  once = true,
  className,
  children,
  ...props
}: StaggerContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const items = container.querySelectorAll(itemSelector)
      if (items.length === 0) return

      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: distance },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 88%",
            once,
          },
        }
      )
    },
    { scope: containerRef, dependencies: [stagger, duration, distance, itemSelector, once] }
  )

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  )
}

export interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function StaggerItem({ className, children, ...props }: StaggerItemProps) {
  return (
    <div className={cn("stagger-item will-change-transform", className)} {...props}>
      {children}
    </div>
  )
}

