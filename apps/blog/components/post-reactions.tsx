"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface PostReactionsProps {
  postId: string
  initialCount?: number
}

export function PostReactions({
  postId,
  initialCount = 12,
}: PostReactionsProps) {
  const [likes, setLikes] = useState(initialCount)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`blog_reaction_${postId}`)
      if (stored) {
        setHasLiked(true)
      }
    } catch {
      // LocalStorage inaccessible
    }
  }, [postId])

  const handleToggleLike = () => {
    const nextState = !hasLiked
    setHasLiked(nextState)
    setLikes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)))

    try {
      if (nextState) {
        localStorage.setItem(`blog_reaction_${postId}`, "true")
      } else {
        localStorage.removeItem(`blog_reaction_${postId}`)
      }
    } catch {
      // LocalStorage inaccessible
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <button
        type="button"
        onClick={handleToggleLike}
        aria-label={hasLiked ? "Unlike this article" : "Like this article"}
        className={cn(
          buttonVariants({
            variant: hasLiked ? "default" : "outline",
            size: "sm",
          }),
          "gap-x-2 text-xs h-8 px-3 rounded-lg transition-all"
        )}
      >
        <Heart
          className={cn(
            "size-3.5 transition-transform",
            hasLiked ? "fill-current scale-110" : ""
          )}
        />
        <span>{likes}</span>
      </button>
      <span className="text-[11px] text-muted-foreground">
        Found this insightful
      </span>
    </div>
  )
}
