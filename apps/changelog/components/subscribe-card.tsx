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
    <div className="relative overflow-hidden rounded-3xl border border-foreground/8 bg-card/40 p-6 sm:p-7 backdrop-blur-xl shadow-xs">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.03] text-foreground">
              <Bell className="size-4" />
            </div>
            <h3 className="font-serif text-base font-light tracking-tight text-foreground">
              Subscribe to Release Notes
            </h3>
          </div>
          <p className="font-sans text-xs font-light text-muted-foreground">
            Dapatkan notifikasi instan saat fitur baru, optimasi arsitektur, dan
            versi rilis diterbitkan ke production.
          </p>
        </div>

        {status === "success" ? (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="size-4 shrink-0 text-emerald-500" />
            <span>
              Berlangganan sukses! Anda akan menerima update rilis berikutnya.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-2.5 sm:w-auto sm:min-w-[360px] sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                disabled={isPending}
                className="h-10 w-full rounded-full border border-foreground/10 bg-background/60 pr-4 pl-10 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-hidden disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-foreground bg-foreground px-5 font-mono text-xs font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
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
        <p className="mt-3 font-mono text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  )
}
