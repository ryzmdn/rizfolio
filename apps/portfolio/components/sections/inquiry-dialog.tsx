"use client"

import { useState, useTransition, useEffect, useRef } from "react"
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [projectScope, setProjectScope] = useState("Engineering Contract")
  const [budgetRange, setBudgetRange] = useState("$5K - $15K")
  const [message, setMessage] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousActiveElement = document.activeElement as HTMLElement | null
    document.body.style.overflow = "hidden"

    const dialogEl = dialogRef.current
    if (dialogEl) {
      const focusable = dialogEl.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length > 0) {
        focusable[0]?.focus()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === "Tab") {
        if (!dialogEl) return
        const focusable = dialogEl.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      previousActiveElement?.focus()
    }
  }, [isOpen])

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
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4 font-mono text-xs tracking-widest text-background uppercase shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <MessageSquareCode className="size-3.5" aria-hidden="true" />
        <span>Initiate Proposal Submission</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </button>

      {isOpen && (
        <div
          role="presentation"
          onClick={handleClose}
          className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/75 p-4 backdrop-blur-md duration-200 fade-in"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-dialog-title"
            aria-describedby="inquiry-dialog-desc"
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-foreground/15 bg-background p-6 text-left shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-foreground/8 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-foreground/15 bg-foreground/5 text-foreground">
                  <Sparkles className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <h3
                    id="inquiry-dialog-title"
                    className="text-base font-medium tracking-tight text-foreground"
                  >
                    Direct Architectural Proposal
                  </h3>
                  <p
                    id="inquiry-dialog-desc"
                    className="font-mono text-[11px] text-muted-foreground"
                  >
                    Direct inquiry channel for enterprise advisory & system contracts.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close inquiry dialog"
                className="rounded-full border border-foreground/10 p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {successMessage ? (
              <div className="space-y-4 py-10 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </div>
                <h4 className="text-base font-medium text-foreground">
                  Inquiry Dispatched Successfully
                </h4>
                <p className="mx-auto max-w-md text-xs font-light leading-relaxed text-muted-foreground">
                  {successMessage}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full bg-foreground px-6 py-2.5 font-mono text-xs tracking-wider text-background uppercase hover:opacity-90"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="inquiry-name"
                      className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                    >
                      Full Name <span className="text-foreground/40">*</span>
                    </label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-xl border border-foreground/15 bg-foreground/[0.02] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="inquiry-email"
                      className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                    >
                      Email Address <span className="text-foreground/40">*</span>
                    </label>
                    <input
                      id="inquiry-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full rounded-xl border border-foreground/15 bg-foreground/[0.02] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="inquiry-scope"
                      className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                    >
                      Engagement Scope
                    </label>
                    <select
                      id="inquiry-scope"
                      value={projectScope}
                      onChange={(e) => setProjectScope(e.target.value)}
                      className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-foreground/40 focus:outline-hidden"
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
                    <label
                      htmlFor="inquiry-budget"
                      className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                    >
                      Budget Allocation
                    </label>
                    <select
                      id="inquiry-budget"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-foreground/40 focus:outline-hidden"
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
                  <label
                    htmlFor="inquiry-subject"
                    className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                  >
                    System Subject
                  </label>
                  <input
                    id="inquiry-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Next.js Monorepo Migration & Cloud Architecture"
                    className="w-full rounded-xl border border-foreground/15 bg-foreground/[0.02] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="inquiry-message"
                    className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase"
                  >
                    Architectural Requirements & Goals{" "}
                    <span className="text-foreground/40">*</span>
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Outline your timeline, current stack, core technical challenges, and what you aim to achieve..."
                    className="w-full rounded-xl border border-foreground/15 bg-foreground/[0.02] p-3.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:outline-hidden"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-400">
                    <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-foreground/8 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full px-5 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-2.5 font-mono text-xs tracking-wider text-background uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isPending ? (
                      <span>Transmitting...</span>
                    ) : (
                      <>
                        <Send className="size-3.5" aria-hidden="true" />
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
