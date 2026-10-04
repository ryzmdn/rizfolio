"use client"

import * as React from "react"
import { ReactLenis, type LenisRef } from "lenis/react"

export interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = React.useRef<LenisRef>(null)

  React.useEffect(() => {
    let rafId: number

    function raf(time: number) {
      lenisRef.current?.lenis?.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      autoRaf={false}
      options={{
        lerp: 0.09,
        duration: 1.2,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.075,
        orientation: "vertical",
        gestureOrientation: "vertical",
        overscroll: false,
        anchors: true,
        autoResize: true,
        respectReducedMotion: true,
        prevent: (node: Element) =>
          node.hasAttribute("data-lenis-prevent") ||
          node.classList.contains("lenis-prevent") ||
          (node.scrollHeight > node.clientHeight &&
            getComputedStyle(node).overflowY === "scroll"),
      }}
    >
      {children}
    </ReactLenis>
  )
}
