"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export const THEME_STORAGE_KEY = "rizfolio-theme"
export const THEME_BROADCAST_CHANNEL = "rizfolio_theme_sync_channel"

export function setSharedThemeCookie(theme: string) {
  if (typeof document === "undefined") return
  try {
    const hostname = window.location.hostname
    let domainAttribute = ""

    if (hostname !== "localhost" && !/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      const parts = hostname.split(".")
      if (parts.length >= 2) {
        const rootDomain = parts.slice(-2).join(".")
        domainAttribute = `; domain=.${rootDomain}`
      }
    }

    const cookieOptions = `; path=/; max-age=31536000; SameSite=Lax${domainAttribute}`
    document.cookie = `${THEME_STORAGE_KEY}=${encodeURIComponent(theme)}${cookieOptions}`
    document.cookie = `theme=${encodeURIComponent(theme)}${cookieOptions}`
  } catch (error: unknown) {
    console.error(
      "[ThemeSync] Failed to set shared theme cookie:",
      error instanceof Error ? error.message : String(error)
    )
  }
}

export function getSharedTheme(): string | null {
  if (typeof document === "undefined") return null
  try {
    const cookieMatch = document.cookie.match(
      new RegExp(`(?:^|;\\s*)(?:${THEME_STORAGE_KEY}|theme)=([^;]+)`)
    )
    if (cookieMatch?.[1]) {
      return decodeURIComponent(cookieMatch[1])
    }

    const local =
      localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("theme")
    if (local) return local
  } catch (error: unknown) {
    console.error(
      "[ThemeSync] Failed to read shared theme:",
      error instanceof Error ? error.message : String(error)
    )
  }
  return null
}

export function ThemeSynchronizer() {
  const { theme, setTheme } = useTheme()
  const isSyncingRef = React.useRef(false)

  React.useEffect(() => {
    const shared = getSharedTheme()
    if (
      shared &&
      shared !== theme &&
      (shared === "light" || shared === "dark" || shared === "system")
    ) {
      isSyncingRef.current = true
      setTheme(shared)
      setTimeout(() => {
        isSyncingRef.current = false
      }, 50)
    }
  }, [theme, setTheme])

  React.useEffect(() => {
    if (!theme) return
    setSharedThemeCookie(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      localStorage.setItem("theme", theme)
    } catch (error: unknown) {
      console.error(
        "[ThemeSync] Failed to write theme to storage:",
        error instanceof Error ? error.message : String(error)
      )
    }

    if (isSyncingRef.current) return

    if (typeof BroadcastChannel !== "undefined") {
      try {
        const channel = new BroadcastChannel(THEME_BROADCAST_CHANNEL)
        channel.postMessage({ type: "THEME_CHANGE", theme })
        channel.close()
      } catch (error: unknown) {
        console.error(
          "[ThemeSync] Failed to broadcast theme change:",
          error instanceof Error ? error.message : String(error)
        )
      }
    }
  }, [theme])

  React.useEffect(() => {
    let channel: BroadcastChannel | null = null

    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel(THEME_BROADCAST_CHANNEL)
        channel.onmessage = (event) => {
          if (event.data?.type === "THEME_CHANGE" && event.data?.theme) {
            const nextTheme = event.data.theme
            if (
              nextTheme !== theme &&
              (nextTheme === "light" ||
                nextTheme === "dark" ||
                nextTheme === "system")
            ) {
              isSyncingRef.current = true
              setTheme(nextTheme)
              setTimeout(() => {
                isSyncingRef.current = false
              }, 50)
            }
          }
        }
      } catch (error: unknown) {
        console.error(
          "[ThemeSync] Failed to initialize broadcast channel listener:",
          error instanceof Error ? error.message : String(error)
        )
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY || e.key === "theme") {
        const nextTheme = e.newValue
        if (
          nextTheme &&
          nextTheme !== theme &&
          (nextTheme === "light" ||
            nextTheme === "dark" ||
            nextTheme === "system")
        ) {
          isSyncingRef.current = true
          setTheme(nextTheme)
          setTimeout(() => {
            isSyncingRef.current = false
          }, 50)
        }
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      channel?.close()
      window.removeEventListener("storage", handleStorage)
    }
  }, [theme, setTheme])

  return null
}
