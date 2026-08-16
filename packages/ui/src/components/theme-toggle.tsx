"use client"

import { useTheme } from "next-themes"
import {
  AnimatedThemeToggle,
  type AnimatedThemeToggleProps,
} from "@workspace/ui/components/animated-toggle-theme"

export function ThemeToggle(props: AnimatedThemeToggleProps) {
  const { setTheme } = useTheme()

  return <AnimatedThemeToggle onThemeChange={setTheme} {...props} />
}
