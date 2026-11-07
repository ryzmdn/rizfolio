"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface ReadingProgressProps {
  className?: string
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const barRef = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const bar = barRef.current
      if (!bar) return

      gsap.set(bar, { scaleX: 0, transformOrigin: "left" })

      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
        },
      })
    },
    { scope: barRef }
  )

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] bg-transparent"
    >
      <div
        ref={barRef}
        className={cn(
          "h-full w-full bg-foreground/80 will-change-transform",
          className
        )}
      />
    </div>
  )
}
