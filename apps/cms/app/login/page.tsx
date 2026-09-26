"use client"

import { useActionState, useEffect } from "react"
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react"
import { loginAdmin } from "../../lib/auth-actions"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/"
    }
  }, [state?.success])

  const isSuccess = Boolean(state?.success)

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Portal Branding */}
        <div className="space-y-2 text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-border/80 bg-foreground text-background shadow-xs">
            <ShieldCheck className="size-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Rizfolio CMS
            </h1>
            <p className="text-xs text-muted-foreground">
              Restricted Area: Owner Credentials Required
            </p>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-10 animate-pulse text-emerald-500" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Autentikasi Berhasil
                </p>
                <p className="text-xs text-muted-foreground">
                  Mengarahkan ke Dashboard Overview...
                </p>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                  <span className="leading-relaxed">{state.error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-foreground"
                >
                  Email Kredensial
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
                    className="w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/40 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground"
                >
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-border/80 bg-background/80 py-2.5 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-foreground/40 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-xs font-bold text-background shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-hidden focus:ring-2 focus:ring-primary/30"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Memverifikasi Sesi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security Notice */}
        <div className="space-y-1 text-center font-mono text-[11px] text-muted-foreground/70">
          <p>Rizfolio Defense-in-Depth Security Protocol</p>
          <p>Rate limiting and session audit trail active.</p>
        </div>
      </div>
    </div>
  )
}
