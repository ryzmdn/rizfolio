"use client"

import { useActionState } from "react"
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react"
import { loginAdmin } from "../../lib/auth-actions"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-muted/50 text-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Personal CMS
          </h1>
          <p className="text-xs text-muted-foreground">
            Masuk dengan kredensial Owner untuk mengelola ekosistem website.
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs">
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="owner@example.com"
                  className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[11px] text-muted-foreground/60">
          Rizfolio Admin Portal • Protected Area
        </p>
      </div>
    </div>
  )
}
