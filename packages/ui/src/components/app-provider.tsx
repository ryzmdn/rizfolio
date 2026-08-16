"use client"

import * as React from "react"
import { ThemeProvider, SmoothScrollProvider } from "./providers"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </ThemeProvider>
  )
}
