"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Header } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { NavLink } from "./nav-link"
import { Behance, Dribbble, GitHub, LinkedIn } from "@workspace/ui/constants/icons"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/#journey", label: "Journey" },
  { href: "/#case-studies", label: "Case Studies" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#solutions", label: "Solutions" },
]

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [timeData, setTimeData] = useState<{
    time: string
    ampm: string
  } | null>(null)

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })

    const updateClock = () => {
      const now = new Date()
      const formattedTime = formatter.format(now)
      const [timeString, ampmString] = formattedTime.split(" ") as [
        string,
        string,
      ]
      setTimeData({ time: timeString, ampm: ampmString })
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Header className="absolute top-0 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4 sm:px-6">
      <div className="flex h-16 sm:h-20 items-center justify-between">
        <div className="flex items-center gap-x-2.5 text-xs sm:text-sm">
          <div className="flex items-center text-foreground">
            <span className="tabular-nums">
              {timeData?.time ?? "--:--:--"}
            </span>
            <span className="ml-1 uppercase">
              {timeData?.ampm}
            </span>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Jakarta (GMT+7)
          </span>
        </div>

        <nav className="hidden items-center justify-center gap-x-5 lg:gap-x-8 text-sm md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              first={item.label}
              last={item.label}
            />
          ))}
        </nav>

        <div className="flex items-center gap-x-1.5 sm:gap-x-2">
          <div className="hidden items-center gap-x-2.5 sm:flex">
            <a
              href="https://behance.net/ryzmdn"
              target="_blank"
              rel="noreferrer"
              aria-label="Behance Profile"
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <Behance className="size-4" />
            </a>
            <a
              href="https://dribbble.com/ryzmdn"
              target="_blank"
              rel="noreferrer"
              aria-label="Dribbble Profile"
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <Dribbble className="size-4" />
            </a>
          </div>

          <ThemeToggle
            className={buttonVariants({
              variant: "secondary",
              size: "icon-sm",
            })}
          />

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "md:hidden"
            )}
          >
            {isMobileMenuOpen ? (
              <X className="size-4.5" />
            ) : (
              <Menu className="size-4.5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="relative z-50 mt-2 w-full rounded-2xl border border-border/70 bg-background/95 p-5 shadow-2xl backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-3.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground/60">&rarr;</span>
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Social Links
            </span>
            <div className="flex items-center gap-x-2">
              <a
                href="https://github.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={buttonVariants({ variant: "outline", size: "icon-sm" })}
              >
                <GitHub className="size-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={buttonVariants({ variant: "outline", size: "icon-sm" })}
              >
                <LinkedIn className="size-3.5" />
              </a>
              <a
                href="https://behance.net/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance"
                className={buttonVariants({ variant: "outline", size: "icon-sm" })}
              >
                <Behance className="size-3.5" />
              </a>
              <a
                href="https://dribbble.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble"
                className={buttonVariants({ variant: "outline", size: "icon-sm" })}
              >
                <Dribbble className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </Header>
  )
}
