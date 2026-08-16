"use client"

import { useTheme } from "next-themes"
import {
  AnimatedThemeToggle,
  type AnimatedThemeToggleProps,
} from "@workspace/ui/components/animated-toggle-theme"

export function ThemeToggle(props: AnimatedThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <AnimatedThemeToggle
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={setTheme}
      {...props}
    />
  )
}
