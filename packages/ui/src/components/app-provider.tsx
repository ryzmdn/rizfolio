"use client"

import * as React from "react"
import {
  ThemeProvider,
  SmoothScrollProvider,
  ThemeSynchronizer,
  THEME_STORAGE_KEY,
} from "./providers"

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
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </ThemeProvider>
  )
}
