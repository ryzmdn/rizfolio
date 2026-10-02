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
  const themeRef = React.useRef(theme)
  const isIncomingSyncRef = React.useRef(false)
  const isMountedRef = React.useRef(false)

  React.useEffect(() => {
    themeRef.current = theme
  }, [theme])

  React.useEffect(() => {
    if (isMountedRef.current) return
    isMountedRef.current = true

    const shared = getSharedTheme()
    if (
      shared &&
      (shared === "light" || shared === "dark" || shared === "system") &&
      shared !== themeRef.current
    ) {
      isIncomingSyncRef.current = true
      setTheme(shared)
      const timer = setTimeout(() => {
        isIncomingSyncRef.current = false
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [setTheme])

  React.useEffect(() => {
    if (!theme) return

    setSharedThemeCookie(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error: unknown) {
      console.error(
        "[ThemeSync] Failed to write theme to storage:",
        error instanceof Error ? error.message : String(error)
      )
    }

    if (isIncomingSyncRef.current) {
      isIncomingSyncRef.current = false
      return
    }

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

    const applyIncomingTheme = (nextTheme: string | null | undefined) => {
      if (
        nextTheme &&
        (nextTheme === "light" ||
          nextTheme === "dark" ||
          nextTheme === "system") &&
        nextTheme !== themeRef.current
      ) {
        isIncomingSyncRef.current = true
        setTheme(nextTheme)
        setTimeout(() => {
          isIncomingSyncRef.current = false
        }, 100)
      }
    }

    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel(THEME_BROADCAST_CHANNEL)
        channel.onmessage = (event) => {
          if (event.data?.type === "THEME_CHANGE" && event.data?.theme) {
            applyIncomingTheme(event.data.theme)
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
        applyIncomingTheme(e.newValue)
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      channel?.close()
      window.removeEventListener("storage", handleStorage)
    }
  }, [setTheme])

  return <FaviconSynchronizer />
}

export function applyThemeFavicons(theme: "dark" | "light") {
  if (typeof document === "undefined") return

  const folder = theme === "dark" ? "dark" : "light"
  const currentAttr = document.documentElement.getAttribute("data-theme-favicon")
  if (currentAttr === folder) return

  const iconSpecs = [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: `/logos/${folder}/favicon-32x32.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: `/logos/${folder}/favicon-16x16.png`,
    },
    {
      rel: "icon",
      type: "image/x-icon",
      sizes: "any",
      href: `/logos/${folder}/favicon.ico`,
    },
    {
      rel: "shortcut icon",
      href: `/logos/${folder}/favicon.ico`,
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: `/logos/${folder}/apple-touch-icon.png`,
    },
  ]

  const existingIcons = document.querySelectorAll<HTMLLinkElement>(
    "link[rel*='icon'], link[rel='apple-touch-icon']"
  )
  existingIcons.forEach((el) => el.remove())

  iconSpecs.forEach((spec) => {
    const link = document.createElement("link")
    link.rel = spec.rel
    if (spec.type) link.type = spec.type
    if (spec.sizes) link.setAttribute("sizes", spec.sizes)
    link.href = spec.href
    link.setAttribute("data-theme-favicon", folder)
    document.head.appendChild(link)
  })

  let themeColorMeta =
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!themeColorMeta) {
    themeColorMeta = document.createElement("meta")
    themeColorMeta.name = "theme-color"
    document.head.appendChild(themeColorMeta)
  }
  themeColorMeta.content = folder === "dark" ? "#09090b" : "#ffffff"

  document.documentElement.setAttribute("data-theme-favicon", folder)
}

export function FaviconSynchronizer() {
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    const resolveCurrentTheme = (): "dark" | "light" => {
      if (typeof document === "undefined") return "dark"
      if (document.documentElement.classList.contains("dark")) return "dark"
      if (document.documentElement.classList.contains("light")) return "light"
      if (resolvedTheme === "dark" || resolvedTheme === "light")
        return resolvedTheme
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }

    applyThemeFavicons(resolveCurrentTheme())

    const observer = new MutationObserver(() => {
      applyThemeFavicons(resolveCurrentTheme())
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [resolvedTheme])

  return null
}
