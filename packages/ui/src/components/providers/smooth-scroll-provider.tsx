"use client"

import * as React from "react"
import { ReactLenis } from "lenis/react"

export interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.065,
        wheelMultiplier: 0.2,
        touchMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        orientation: "vertical",
        gestureOrientation: "vertical",
        overscroll: true,
        anchors: true,
        autoRaf: true,
        autoResize: true,
        respectReducedMotion: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
