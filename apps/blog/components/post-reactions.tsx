"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
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
  const [hasLiked, setHasLiked] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      return Boolean(localStorage.getItem(`blog_reaction_${postId}`))
    } catch {
      return false
    }
  })

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
      // LocalStorage unavailable
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggleLike}
        aria-label={hasLiked ? "Unlike this article" : "Like this article"}
        aria-pressed={hasLiked}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-all",
          hasLiked
            ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            : "border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
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
      <span className="text-xs text-muted-foreground">
        Found this useful
      </span>
    </div>
  )
}
