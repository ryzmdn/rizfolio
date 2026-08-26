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

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      <ThemeSynchronizer />
      <SmoothScrollProvider>
        <GSAPProvider>{children}</GSAPProvider>
      </SmoothScrollProvider>
      <CookieConsent />
    </ThemeProvider>
  )
}
