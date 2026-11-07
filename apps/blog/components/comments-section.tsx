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
      className="mt-16 border-t border-foreground/8 pt-12"
    >
      <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              [ DISCOURSE // PEER ARCHIVES ]
            </span>
          </div>
          <h2 className="font-serif text-2xl font-light tracking-tight text-foreground sm:text-3xl">
            Discussion & Commentary
          </h2>
          <p className="text-xs font-light text-muted-foreground">
            Join the architectural discourse. Technical critiques and perspectives are welcomed.
          </p>
        </div>

        <span className="self-start rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 font-mono text-xs uppercase text-muted-foreground sm:self-auto">
          {comments.length} {comments.length === 1 ? "Dispatch" : "Dispatches"}
        </span>
      </div>

      {notification && (
        <div
          className={cn(
            "mb-8 flex items-center justify-between rounded-2xl border p-4 font-mono text-xs transition-all",
            notification.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          )}
        >
          <div className="flex items-center gap-2.5">
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
        className="mb-12 space-y-4 rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6 backdrop-blur-xl sm:p-8"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-foreground">
          Submit Commentary
        </span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Your Name
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              disabled={isPending}
              className="w-full rounded-full border border-foreground/10 bg-foreground/3 px-4 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-hidden disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="sarah@example.com"
              disabled={isPending}
              className="w-full rounded-full border border-foreground/10 bg-foreground/3 px-4 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-hidden disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Commentary
          </label>
          <textarea
            rows={3}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your perspective, question, or technical feedback..."
            disabled={isPending}
            className="w-full rounded-2xl border border-foreground/10 bg-foreground/3 px-4 py-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-hidden disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] text-muted-foreground/60">
            Email addresses are held confidential and never rendered publicly.
          </span>
          <button
            type="submit"
            disabled={isPending || !content.trim() || !authorName.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-background transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            <span>{isPending ? "Transmitting..." : "Dispatch Comment"}</span>
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Synchronizing discussion ledger...
        </div>
      ) : rootComments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-foreground/15 bg-foreground/2 p-12 text-center">
          <MessageSquare className="size-8 text-muted-foreground/30 stroke-[1.25]" />
          <h4 className="mt-3 font-serif text-sm font-light text-foreground">
            No peer commentary registered
          </h4>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            Be the first engineer to initiate this technical thread.
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
                className="space-y-4 rounded-3xl border border-foreground/8 bg-foreground/[0.015] p-6 transition-all hover:border-foreground/20"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-foreground font-mono text-[10px] text-background">
                    {getInitials(root.authorName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-serif text-sm font-light text-foreground">
                        {root.authorName}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {formatDate(root.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/90 sm:text-sm">
                      {root.content}
                    </p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setReplyingTo(isReplyingThis ? null : root)
                        }
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        <CornerDownRight className="size-3" />
                        <span>{isReplyingThis ? "Cancel Response" : "Respond"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {isReplyingThis && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, root.id)}
                    className="mt-4 space-y-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
                        Responding to @{root.authorName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="font-mono text-xs text-muted-foreground hover:text-foreground"
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
                        className="w-full rounded-full border border-foreground/10 bg-background px-3.5 py-1.5 font-mono text-xs text-foreground focus:border-foreground/30 focus:outline-hidden"
                      />
                      <input
                        type="email"
                        required
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        placeholder="Your Email"
                        disabled={isPending}
                        className="w-full rounded-full border border-foreground/10 bg-background px-3.5 py-1.5 font-mono text-xs text-foreground focus:border-foreground/30 focus:outline-hidden"
                      />
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your response..."
                      disabled={isPending}
                      className="w-full rounded-xl border border-foreground/10 bg-background px-3.5 py-2 text-xs leading-relaxed text-foreground focus:border-foreground/30 focus:outline-hidden"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={
                          isPending || !replyContent.trim() || !replyName.trim()
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-background hover:opacity-90 disabled:opacity-40"
                      >
                        {isPending ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Send className="size-3" />
                        )}
                        <span>{isPending ? "Dispatching..." : "Post Response"}</span>
                      </button>
                    </div>
                  </form>
                )}

                {replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-l border-foreground/10 pl-5 sm:pl-7">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 font-mono text-[9px] text-foreground">
                          {getInitials(reply.authorName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-serif text-xs font-light text-foreground">
                              {reply.authorName}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground/60">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-foreground/80">
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
