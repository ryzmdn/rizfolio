"use client"

import { useEffect, useRef } from "react"
import { trackCaseStudyViewAction } from "@/lib/actions"

interface CaseStudyTrackerProps {
  caseStudyId: string | number
  slug: string
}

export function CaseStudyTracker({ caseStudyId, slug }: CaseStudyTrackerProps) {
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (hasTriggeredRef.current) return

    const storageKey = `cs_view_${slug}`
    try {
      const alreadyViewed = sessionStorage.getItem(storageKey)
      if (!alreadyViewed) {
        hasTriggeredRef.current = true
        sessionStorage.setItem(storageKey, Date.now().toString())
        void trackCaseStudyViewAction(String(caseStudyId))
      }
    } catch {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        void trackCaseStudyViewAction(String(caseStudyId))
      }
    }
  }, [caseStudyId, slug])

  return null
}
