"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

import { togglePostReactionAction } from "@/lib/actions"

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
  const [isPending, setIsPending] = useState(false)

  const handleToggleLike = async () => {
    if (isPending) return
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

    setIsPending(true)
    try {
      const res = await togglePostReactionAction(postId, nextState)
      if (res.success && typeof res.likes === "number") {
        setLikes(res.likes)
      }
    } catch {
      // Resilience: keep optimistic UI
    } finally {
      setIsPending(false)
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
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs tracking-wider uppercase transition-all duration-200",
          hasLiked
            ? "border-foreground/30 bg-foreground/10 text-foreground"
            : "border-foreground/10 bg-foreground/3 text-muted-foreground hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
        )}
      >
        <Heart
          className={cn(
            "size-3.5 transition-transform",
            hasLiked ? "scale-110 fill-current text-rose-500" : ""
          )}
        />
        <span>{likes}</span>
      </button>
      <span className="font-mono text-[11px] tracking-wider text-muted-foreground/60 uppercase">
        Peer Endorsements
      </span>
    </div>
  )
}
