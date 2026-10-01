"use client"

import { useEffect, useRef } from "react"
import { incrementPostView } from "@/lib/actions"

interface ViewTrackerProps {
  postId: string
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!hasTracked.current && postId) {
      hasTracked.current = true
      incrementPostView(postId).catch((err: unknown) => {
        console.error(
          "[ViewTracker] Failed to increment post view:",
          err instanceof Error ? err.message : String(err)
        )
      })
    }
  }, [postId])

  return null
}
