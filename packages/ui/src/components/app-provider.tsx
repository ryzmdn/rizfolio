"use client"

import * as React from "react"
import {
  ThemeProvider,
  SmoothScrollProvider,
  ThemeSynchronizer,
  THEME_STORAGE_KEY,
} from "./providers"
import { CookieConsent } from "./cookie-consent"
const LazyGSAPProvider = React.lazy(() =>
  import("./animations/gsap-provider").then((mod) => ({ default: mod.GSAPProvider }))
)

export interface AppProviderProps {
  children: React.ReactNode
  disableSmoothScroll?: boolean
  disableAnimations?: boolean
  disableCookieConsent?: boolean
}

export function AppProvider({
  children,
  disableSmoothScroll = false,
  disableAnimations = true,
  disableCookieConsent = false,
}: AppProviderProps) {
  const animatedContent = disableAnimations ? (
    children
  ) : (
    <React.Suspense fallback={children}>
      <LazyGSAPProvider>{children}</LazyGSAPProvider>
    </React.Suspense>
  )

  const scrollContent = disableSmoothScroll ? (
    animatedContent
  ) : (
    <SmoothScrollProvider>{animatedContent}</SmoothScrollProvider>
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      <ThemeSynchronizer />
      {scrollContent}
      {!disableCookieConsent && <CookieConsent />}
    </ThemeProvider>
  )
}
