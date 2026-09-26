"use client"

import { useState } from "react"
import { Send, CheckCircle2, MessageSquarePlus } from "lucide-react"

export function RoadmapFeedback() {
  const [title, setTitle] = useState("")
  const [scope, setScope] = useState("monorepo")
  const [rationale, setRationale] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !rationale.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  function handleReset() {
    setTitle("")
    setScope("monorepo")
    setRationale("")
    setIsSubmitted(false)
  }

  return (
    <section className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs backdrop-blur-xs sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background shadow-xs">
          <MessageSquarePlus className="size-4" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Propose a Feature or Architecture Milestone
          </h2>
          <p className="text-xs text-muted-foreground">
            Have an enhancement idea or architectural improvement in mind? Submit your proposal directly.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
          <CheckCircle2 className="mx-auto size-7 text-emerald-500" />
          <h3 className="mt-2 text-sm font-bold text-foreground">
            Suggestion Received
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Thank you for your proposal. It has been recorded for review in future engineering cycles.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          >
            Submit Another Suggestion
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="feature-title"
                className="text-xs font-semibold text-foreground"
              >
                Feature or Milestone Title
              </label>
              <input
                id="feature-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed WebSocket state synchronization"
                className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="feature-scope"
                className="text-xs font-semibold text-foreground"
              >
                Target Scope
              </label>
              <select
                id="feature-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-background/80 px-3.5 py-2.5 text-xs text-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
              >
                <option value="monorepo">All Monorepo</option>
                <option value="apps/shop">apps/shop</option>
                <option value="apps/docs">apps/docs</option>
                <option value="apps/blog">apps/blog</option>
                <option value="apps/portfolio">apps/portfolio</option>
                <option value="apps/cms">apps/cms</option>
                <option value="packages/ui">packages/ui</option>
                <option value="packages/db">packages/db</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="feature-rationale"
              className="text-xs font-semibold text-foreground"
            >
              Use Case & Technical Rationale
            </label>
            <textarea
              id="feature-rationale"
              required
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Describe the motivation, architectural trade-offs, and expected benefits..."
              className="w-full rounded-xl border border-border/70 bg-background/80 p-3.5 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/30 focus:outline-hidden focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-hidden focus:ring-2 focus:ring-primary/30"
            >
              <Send className="size-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Proposal"}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
