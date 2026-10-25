"use client"

import { useState, useTransition } from "react"
import { Bell, Check, Loader2, Mail } from "lucide-react"
import { subscribeChangelogAction } from "@/lib/actions"

export function SubscribeCard() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      setErrorMessage("Please enter a valid email address.")
      return
    }

    startTransition(async () => {
      setStatus("idle")
      setErrorMessage("")
      const result = await subscribeChangelogAction(email)
      if (result.success) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
        setErrorMessage(
          result.error || "Subscription failed. Please try again."
        )
      }
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur-xs sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="size-3.5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Subscribe to Release Notes
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Get notified immediately when new features, architectural fixes, and
            versions are deployed.
          </p>
        </div>

        {status === "success" ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-medium text-emerald-500">
            <Check className="size-4 shrink-0" />
            <span>
              Subscribed successfully! You will receive future release alerts.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[340px] sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                disabled={isPending}
                className="h-9 w-full rounded-xl border border-border bg-background/80 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        )}
      </div>

      {status === "error" && errorMessage && (
        <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
