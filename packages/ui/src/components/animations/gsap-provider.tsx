"use client"

import React, { useEffect } from "react"
import { initGSAP, ScrollTrigger } from "./gsap-init"

interface GSAPProviderProps {
  children: React.ReactNode
  refreshOnResize?: boolean
}

export function GSAPProvider({
  children,
  refreshOnResize = true,
}: GSAPProviderProps) {
  useEffect(() => {
    initGSAP()

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 150)
    }

    if (refreshOnResize) {
      window.addEventListener("resize", handleResize)
    }

    return () => {
      clearTimeout(timer)
      clearTimeout(resizeTimer)
      if (refreshOnResize) {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [refreshOnResize])

  return <>{children}</>
}
