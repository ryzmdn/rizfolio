"use client"

import * as React from "react"
import { useGSAP } from "../use-gsap"
import { gsap } from "../gsap-init"
import { cn } from "@workspace/ui/lib/utils"

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function CountUp({
  value,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
  ...props
}: CountUpProps) {
  const spanRef = React.useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = React.useState(0)

  useGSAP(
    () => {
      const el = spanRef.current
      if (!el) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (prefersReducedMotion) {
        setDisplayValue(value)
        return
      }

      const counter = { val: 0 }

      gsap.to(counter, {
        val: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
        onUpdate: () => {
          setDisplayValue(Math.floor(counter.val))
        },
      })
    },
    { scope: spanRef, dependencies: [value, duration] }
  )

  return (
    <span ref={spanRef} className={cn("tabular-nums", className)} {...props}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}
