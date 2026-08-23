"use client"

import { useCallback, useEffect, useRef } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { cn } from "@workspace/ui/lib/utils"

export interface AnimatedThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  fromCenter?: boolean
  theme?: "light" | "dark"
  onThemeChange?: (theme: "light" | "dark") => void
}

export type AnimatedThemeTogglerProps = AnimatedThemeToggleProps

function getCircleClipPaths(
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  const toX = `${(cx / viewportWidth) * 100}%`
  const toY = `${(cy / viewportHeight) * 100}%`
  const toRadius = `${(maxRadius / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`

  return [`circle(0% at ${toX} ${toY})`, `circle(${toRadius} at ${toX} ${toY})`]
}

export function AnimatedThemeToggle({
  className,
  duration = 400,
  fromCenter = false,
  theme: controlledTheme,
  onThemeChange,
  ...props
}: AnimatedThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const isControlled = controlledTheme !== undefined
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isTransitioningRef = useRef(false)
  const activeAnimRef = useRef<Animation | null>(null)

  const cancelAnim = useCallback(() => {
    activeAnimRef.current?.cancel()
    activeAnimRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      cancelAnim()
      const root = document.documentElement
      if (root.dataset.magicuiThemeVt !== "active") return
      delete root.dataset.magicuiThemeVt
      root.style.removeProperty("--magicui-theme-toggle-vt-duration")
      root.style.removeProperty("--magicui-theme-vt-clip-from")
    }
  }, [cancelAnim])

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    if (
      !button ||
      isTransitioningRef.current ||
      document.documentElement.dataset.magicuiThemeVt === "active"
    )
      return

    const isCurrentDark = isControlled
      ? controlledTheme === "dark"
      : resolvedTheme === "dark" ||
        document.documentElement.classList.contains("dark")

    const nextThemeString: "light" | "dark" = isCurrentDark ? "light" : "dark"

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = viewportWidth / 2
    let y = viewportHeight / 2

    if (!fromCenter) {
      const { top, left, width, height } = button.getBoundingClientRect()
      x = left + width / 2
      y = top + height / 2
    }

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    const applyTheme = () => {
      document.documentElement.classList.toggle(
        "dark",
        nextThemeString === "dark"
      )
      if (isControlled) {
        onThemeChange?.(nextThemeString)
      } else {
        setTheme(nextThemeString)
        onThemeChange?.(nextThemeString)
      }
    }

    if (typeof document.startViewTransition !== "function") {
      applyTheme()
      return
    }

    const clipPath = getCircleClipPaths(
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight
    )

    const root = document.documentElement
    root.dataset.magicuiThemeVt = "active"
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${duration}ms`
    )
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0])

    const cleanup = () => {
      isTransitioningRef.current = false
      delete root.dataset.magicuiThemeVt
      root.style.removeProperty("--magicui-theme-toggle-vt-duration")
      root.style.removeProperty("--magicui-theme-vt-clip-from")
      cancelAnim()
    }

    isTransitioningRef.current = true
    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    if (typeof transition?.finished?.finally === "function") {
      transition.finished.finally(cleanup).catch(() => {})
    } else {
      cleanup()
    }

    const ready = transition?.ready
    if (ready && typeof ready.then === "function") {
      ready
        .then(() => {
          const anim = document.documentElement.animate(
            { clipPath },
            {
              duration,
              easing: "ease-in-out",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          )
          activeAnimRef.current = anim
        })
        .catch(() => {})
    }
  }, [
    fromCenter,
    duration,
    isControlled,
    controlledTheme,
    resolvedTheme,
    onThemeChange,
    setTheme,
    cancelAnim,
  ])

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="block size-4 dark:hidden" />
    </button>
  )
}

export const AnimatedThemeToggler = AnimatedThemeToggle
export const ThemeToggle = AnimatedThemeToggle
