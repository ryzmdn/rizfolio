"use client"

import { useState, useTransition, useEffect } from "react"
import {
  MessageSquare,
  CornerDownRight,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  type CommentItem,
  getPostCommentsAction,
  submitPostCommentAction,
} from "@/lib/actions"

interface CommentsSectionProps {
  postId: string
  postSlug: string
  initialComments?: CommentItem[]
}

function getInitials(name: string): string {
  if (!name.trim()) return "AN"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return (parts[0]?.slice(0, 2) || "AN").toUpperCase()
  }
  const first = parts[0]?.[0] || ""
  const last = parts[parts.length - 1]?.[0] || ""
  return (first + last).toUpperCase() || "AN"
}

function formatDate(dateInput: Date | string): string {
  const d = new Date(dateInput)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function CommentsSection({
  postId,
  postSlug,
  initialComments = [],
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [isLoading, setIsLoading] = useState(initialComments.length === 0)
  const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null)

  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [content, setContent] = useState("")

  const [replyName, setReplyName] = useState("")
  const [replyEmail, setReplyEmail] = useState("")
  const [replyContent, setReplyContent] = useState("")

  const [isPending, startTransition] = useTransition()
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    let isMounted = true
    getPostCommentsAction(postId)
      .then((data) => {
        if (isMounted) {
          setComments(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [postId])

  function showNotification(type: "success" | "error", message: string) {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification(null)
    }, 4500)
  }

  function handleMainSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const res = await submitPostCommentAction({
        postId,
        authorName,
        authorEmail,
        content,
      })

      if (res.success && res.comment) {
        setComments((prev) => [...prev, res.comment!])
        setContent("")
        showNotification(
          "success",
          "Your comment has been published successfully."
        )
      } else {
        showNotification(
          "error",
          res.error || "Failed to post comment. Please try again."
        )
      }
    })
  }

  function handleReplySubmit(e: React.FormEvent, parentId: string) {
    e.preventDefault()

    startTransition(async () => {
      const res = await submitPostCommentAction({
        postId,
        authorName: replyName,
        authorEmail: replyEmail,
        content: replyContent,
        parentId,
      })

      if (res.success && res.comment) {
        setComments((prev) => [...prev, res.comment!])
        setReplyContent("")
        setReplyingTo(null)
        showNotification(
          "success",
          "Your reply has been published successfully."
        )
      } else {
        showNotification(
          "error",
          res.error || "Failed to post reply. Please try again."
        )
      }
    })
  }

  const rootComments = comments.filter((c) => !c.parentId)
  const repliesByParent = comments.reduce<Record<string, CommentItem[]>>(
    (acc, comment) => {
      if (comment.parentId) {
        const parentList = acc[comment.parentId] || []
        parentList.push(comment)
        acc[comment.parentId] = parentList
      }
      return acc
    },
    {}
  )

  return (
    <section
      id={`comments-${postSlug}`}
      className="mt-14 border-t border-border/40 pt-10"
    >
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Discussion & Reader Comments
            </h2>
            <p className="text-xs text-muted-foreground">
              Join the technical architectural discourse. Be thoughtful and
              respectful.
            </p>
          </div>
        </div>

        <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {notification && (
        <div
          className={cn(
            "mb-6 flex items-center justify-between rounded-xl p-3.5 text-xs font-medium transition-all animate-in fade-in",
            notification.type === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="opacity-70 hover:opacity-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleMainSubmit}
        className="mb-10 space-y-3.5 rounded-2xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xs sm:p-6"
      >
        <h3 className="text-xs font-bold tracking-wide text-foreground uppercase">
          Leave a Comment
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground">
              Your Name
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              disabled={isPending}
              className="w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-primary focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="sarah@example.com"
              disabled={isPending}
              className="w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-primary focus:outline-hidden disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-foreground">
            Comment
          </label>
          <textarea
            rows={3}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your perspective, question, or technical feedback..."
            disabled={isPending}
            className="w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:ring-1 focus:ring-primary focus:outline-hidden disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-muted-foreground">
            Your email is kept confidential and never shared publicly.
          </span>
          <button
            type="submit"
            disabled={isPending || !content.trim() || !authorName.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            <span>{isPending ? "Posting..." : "Post Comment"}</span>
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-xs text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading comments...
        </div>
      ) : rootComments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-10 text-center">
          <MessageSquare className="size-8 text-muted-foreground/30" />
          <h4 className="mt-2 text-xs font-semibold text-foreground">
            No comments yet
          </h4>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Be the first to share your thoughts on this article.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {rootComments.map((root) => {
            const replies = repliesByParent[root.id] || []
            const isReplyingThis = replyingTo?.id === root.id

            return (
              <div
                key={root.id}
                className="space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-[10px] font-bold text-background shadow-xs">
                    {getInitials(root.authorName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {root.authorName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(root.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs/relaxed whitespace-pre-wrap text-foreground/90">
                      {root.content}
                    </p>
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setReplyingTo(isReplyingThis ? null : root)
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                      >
                        <CornerDownRight className="size-3" />
                        <span>{isReplyingThis ? "Cancel Reply" : "Reply"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {isReplyingThis && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, root.id)}
                    className="mt-3 space-y-3 rounded-xl border border-primary/20 bg-muted/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground">
                        Replying to @{root.authorName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <input
                        type="text"
                        required
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        placeholder="Your Name"
                        disabled={isPending}
                        className="w-full rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                      />
                      <input
                        type="email"
                        required
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        placeholder="Your Email"
                        disabled={isPending}
                        className="w-full rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                      />
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      disabled={isPending}
                      className="w-full rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={
                          isPending ||
                          !replyContent.trim() ||
                          !replyName.trim()
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 disabled:opacity-40"
                      >
                        {isPending ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Send className="size-3" />
                        )}
                        <span>{isPending ? "Replying..." : "Post Reply"}</span>
                      </button>
                    </div>
                  </form>
                )}

                {replies.length > 0 && (
                  <div className="mt-3 space-y-3 border-l-2 border-border/60 pl-4 sm:pl-6">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2.5">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-[9px] font-bold text-foreground">
                          {getInitials(reply.authorName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {reply.authorName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs/relaxed whitespace-pre-wrap text-foreground/90">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
