"use client"

import * as React from "react"
import {
  ThemeProvider,
  SmoothScrollProvider,
  ThemeSynchronizer,
  THEME_STORAGE_KEY,
} from "./providers"
import { CookieConsent } from "./cookie-consent"
import { GSAPProvider } from "./animations/gsap-provider"

export interface AppProviderProps {
  children: React.ReactNode
  disableSmoothScroll?: boolean
  disableAnimations?: boolean
  disableCookieConsent?: boolean
}

export function AppProvider({
  children,
  disableSmoothScroll = false,
  disableAnimations = false,
  disableCookieConsent = false,
}: AppProviderProps) {
  const animatedContent = disableAnimations ? (
    children
  ) : (
    <GSAPProvider>{children}</GSAPProvider>
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
