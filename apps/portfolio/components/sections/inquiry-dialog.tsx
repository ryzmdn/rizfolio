"use client"

import { useState, useTransition } from "react"
import {
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  MessageSquareCode,
  Sparkles,
} from "lucide-react"
import { submitInquiryAction } from "@/lib/actions"

export function InquiryDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [projectScope, setProjectScope] = useState("Engineering Contract")
  const [budgetRange, setBudgetRange] = useState("$5K - $15K")
  const [message, setMessage] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || name.trim().length < 2) {
      setError("Please provide your name (at least 2 characters).")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address for correspondence.")
      return
    }

    if (!message.trim() || message.trim().length < 10) {
      setError(
        "Please describe your project or requirements (at least 10 characters)."
      )
      return
    }

    startTransition(async () => {
      const res = await submitInquiryAction({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || `Inquiry from ${name.trim()}`,
        projectScope,
        budgetRange,
        message: message.trim(),
      })

      if (res.success) {
        setSuccessMessage(
          res.message ||
            "Your project inquiry has been delivered! I will review your requirements and follow up promptly."
        )
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else {
        setError(res.error || "Failed to submit project inquiry.")
      }
    })
  }

  function handleClose() {
    setIsOpen(false)
    setError(null)
    setSuccessMessage(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-background/90 active:scale-[0.98]"
      >
        <MessageSquareCode className="size-4" />
        <span>Submit Project Inquiry</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200 fade-in"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border/80 bg-card p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Project Collaboration Inquiry
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Direct proposal channel to architect and build your next
                    system.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {successMessage ? (
              <div className="space-y-4 py-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  Inquiry Dispatched Successfully
                </h4>
                <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">
                  {successMessage}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Collaboration Scope
                    </label>
                    <select
                      value={projectScope}
                      onChange={(e) => setProjectScope(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
                    >
                      <option value="Full-Time Architecture">
                        Full-Time Architecture
                      </option>
                      <option value="Engineering Contract">
                        Engineering Contract
                      </option>
                      <option value="System Audit & Optimization">
                        System Audit & Optimization
                      </option>
                      <option value="Technical Advisory">
                        Technical Advisory
                      </option>
                      <option value="Web App Development">
                        Web App Development
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Budget Range
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary/50 focus:outline-hidden"
                    >
                      <option value="< $5K">&lt; $5,000</option>
                      <option value="$5K - $15K">$5,000 - $15,000</option>
                      <option value="$15K - $30K">$15,000 - $30,000</option>
                      <option value="> $30K">&gt; $30,000</option>
                      <option value="Flexible / To Discuss">
                        Flexible / To Discuss
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Subject / Project Headline
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Next.js Monorepo Migration & Cloud Architecture"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Project Details & Goals{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline your timeline, current stack, core technical challenges, and what you aim to achieve..."
                    className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-hidden"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-500">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-border/60 pt-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isPending ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        <span>Send Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
