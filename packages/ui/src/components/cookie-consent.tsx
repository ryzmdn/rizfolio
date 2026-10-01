"use client"

import * as React from "react"
import { Cookie, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@workspace/ui/lib/utils"

export const COOKIE_CONSENT_KEY = "rizfolio_cookie_consent"
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 // 180 days (6 months)

function getCookieDomainAttribute(): string {
  if (typeof window === "undefined") return ""
  const hostname = window.location.hostname

  if (hostname !== "localhost" && !/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    const parts = hostname.split(".")
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join(".")
      return `; domain=.${rootDomain}`
    }
  }
  return ""
}

export function saveCookieConsent(status: "accepted" | "dismissed") {
  if (typeof document === "undefined") return
  try {
    const domainPart = getCookieDomainAttribute()
    document.cookie = `${COOKIE_CONSENT_KEY}=${status}; path=/${domainPart}; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`
    localStorage.setItem(COOKIE_CONSENT_KEY, status)
  } catch (error: unknown) {
    console.error(
      "[CookieConsent] Failed to save cookie consent:",
      error instanceof Error ? error.message : String(error)
    )
  }
}

export function getCookieConsent(): "accepted" | "dismissed" | null {
  if (typeof document === "undefined") return null
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_CONSENT_KEY}=([^;]+)`)
    )
    if (match?.[1] === "accepted" || match?.[1] === "dismissed") {
      return match[1]
    }
    const local = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (local === "accepted" || local === "dismissed") {
      return local
    }
  } catch (error: unknown) {
    console.error(
      "[CookieConsent] Failed to read cookie consent:",
      error instanceof Error ? error.message : String(error)
    )
  }
  return null
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  React.useEffect(() => {
    const consent = getCookieConsent()
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAction = (status: "accepted" | "dismissed") => {
    setIsClosing(true)
    saveCookieConsent(status)
    setTimeout(() => {
      setIsVisible(false)
    }, 250)
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="Cookie consent banner"
      role="region"
      className={cn(
        "fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:w-[380px]",
        "rounded-2xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5",
        "text-foreground transition-all duration-300 ease-out",
        isClosing
          ? "pointer-events-none translate-y-4 opacity-0"
          : "animate-in duration-300 slide-in-from-bottom-5 fade-in"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Cookie className="size-4.5" />
          </div>
          <h3 className="text-xs font-semibold tracking-tight text-foreground">
            Preferensi Cookie
          </h3>
        </div>

        <button
          type="button"
          onClick={() => handleAction("dismissed")}
          aria-label="Tutup notifikasi cookie"
          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Website ini menggunakan cookie esensial untuk menyimpan preferensi tema
        dan menjaga keamanan sesi penjelajahan Anda secara optimal.
      </p>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleAction("dismissed")}
          className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Nanti Saja
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => handleAction("accepted")}
          className="h-8 px-3.5 text-xs font-medium"
        >
          Terima
        </Button>
      </div>
    </aside>
  )
}
