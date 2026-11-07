"use client"

import { useState } from "react"
import {
  Send,
  CheckCircle2,
  MessageSquarePlus,
  AlertCircle,
} from "lucide-react"
import { submitRoadmapProposalAction } from "../lib/actions"

export function RoadmapFeedback() {
  const [title, setTitle] = useState("")
  const [scope, setScope] = useState("monorepo")
  const [rationale, setRationale] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!title.trim() || !rationale.trim()) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await submitRoadmapProposalAction({
        title,
        scope,
        rationale,
      })

      if (res.success) {
        setIsSubmitted(true)
      } else {
        setErrorMessage(res.error || "Failed to submit proposal. Please retry.")
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setTitle("")
    setScope("monorepo")
    setRationale("")
    setIsSubmitted(false)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 p-6 shadow-xs backdrop-blur-xl transition-colors md:p-10">
      <div className="flex flex-col gap-4 border-b border-foreground/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-xs">
            <MessageSquarePlus className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                [ RFC // OPEN MILESTONES ]
              </span>
            </div>
            <h2 className="font-serif text-lg font-medium tracking-tight text-foreground md:text-xl">
              Propose an Architectural Milestone
            </h2>
          </div>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Suggest a system architecture optimization, core package capability,
          or cross-cutting engineering enhancement for upcoming quarters.
        </p>
      </div>

      {isSubmitted ? (
        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="mt-3 font-serif text-base font-medium text-foreground">
            Proposal Successfully Logged
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
            Thank you for your submission. Your proposal has been indexed in the
            engineering review register for upcoming evaluation cycles.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full border border-foreground/15 bg-background px-5 py-2 text-xs font-medium text-foreground transition-all hover:bg-foreground hover:text-background focus:ring-2 focus:ring-foreground/20 focus:outline-hidden"
          >
            Submit Another Proposal
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="feature-title"
                className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
              >
                Milestone Title
              </label>
              <input
                id="feature-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed WebSocket state synchronization"
                className="w-full rounded-2xl border border-foreground/10 bg-background/50 px-4 py-3 text-xs text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:bg-background focus:ring-2 focus:ring-foreground/10 focus:outline-hidden md:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="feature-scope"
                className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
              >
                Target Scope
              </label>
              <select
                id="feature-scope"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full rounded-2xl border border-foreground/10 bg-background/50 px-4 py-3 text-xs text-foreground transition-colors focus:border-foreground/30 focus:bg-background focus:ring-2 focus:ring-foreground/10 focus:outline-hidden md:text-sm"
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

          <div className="space-y-2">
            <label
              htmlFor="feature-rationale"
              className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
            >
              Architectural Rationale & Trade-offs
            </label>
            <textarea
              id="feature-rationale"
              required
              rows={4}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Describe the motivation, architectural trade-offs, anticipated constraints, and expected engineering ROI..."
              className="w-full resize-none rounded-2xl border border-foreground/10 bg-background/50 p-4 text-xs text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:bg-background focus:ring-2 focus:ring-foreground/10 focus:outline-hidden md:text-sm"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2.5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-foreground/8 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              [ SECURE RECORDING // DIRECT TO LEDGER ]
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs font-medium tracking-wide text-background shadow-xs transition-opacity hover:opacity-90 focus:ring-2 focus:ring-foreground/20 focus:outline-hidden disabled:opacity-50"
            >
              <Send className="size-3.5" />
              <span>
                {isSubmitting ? "Transmitting..." : "Submit Proposal"}
              </span>
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
