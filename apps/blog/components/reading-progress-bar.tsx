"use client"

import { useEffect, useState } from "react"

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const percentage = Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
        setProgress(percentage)
      }
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  if (progress <= 0) return null

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-0.5 w-full bg-transparent"
    >
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
