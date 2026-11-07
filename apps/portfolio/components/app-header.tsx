"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Header } from "@workspace/ui/components/layouts"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { NavLink } from "./nav-link"
import {
  Behance,
  Dribbble,
  GitHub,
  LinkedIn,
} from "@workspace/ui/constants/icons"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"

const navItems = [
  { href: "/#case-studies", label: "Works" },
  { href: "/#manifesto", label: "Manifesto" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#archive", label: "Archive" },
  { href: "/#testimonials", label: "Endorsements" },
  { href: "/#call-to-action", label: "Inquiry" },
]

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [timeData, setTimeData] = useState<{
    time: string
    ampm: string
  } | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Header
      id="header"
      className="fixed top-0 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4 transition-all duration-500 ease-luxury sm:px-6 lg:px-8"
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between transition-all duration-500 ease-luxury",
          isScrolled
            ? "mt-3 h-14 rounded-full border border-foreground/10 bg-background/80 px-6 shadow-xl backdrop-blur-xl"
            : "mt-0 h-20 border-transparent bg-transparent px-2"
        )}
      >
        <div className="flex items-center gap-x-2.5 text-sm">
          <div
            className="flex min-w-[5.5rem] items-center font-medium text-foreground tabular-nums"
            suppressHydrationWarning
          >
            <span>{timeData?.time ?? "--:--:--"}</span>
            <span className="ml-1 inline-block min-w-[1.25rem] uppercase">
              {timeData?.ampm ?? "--"}
            </span>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Jakarta (GMT+7)
          </span>
        </div>

        <nav className="hidden items-center justify-center gap-x-5 text-sm md:flex lg:gap-x-8">
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
              href="https://github.com/ryzmdn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Profile"
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <GitHub className="size-4" />
            </a>
            <a
              href="https://linkedin.com/in/ryzmdn"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn Profile"
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <LinkedIn className="size-4" />
            </a>
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
        <div className="relative z-50 mt-2 w-full animate-in rounded-3xl border border-foreground/10 bg-card/95 p-6 shadow-2xl backdrop-blur-2xl duration-300 zoom-in-95 md:hidden">
          <nav className="flex flex-col space-y-3.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setTimeout(() => setIsMobileMenuOpen(false), 50)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-colors-luxury hover:bg-foreground/[0.04]"
              >
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground/60">&rarr;</span>
              </Link>
            ))}
          </nav>

          <div className="mt-5 flex items-center justify-between border-t border-foreground/8 pt-4">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Social Channels
            </span>
            <div className="flex items-center gap-x-2">
              <a
                href="https://github.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={buttonVariants({
                  variant: "outline",
                  size: "icon-sm",
                })}
              >
                <GitHub className="size-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className={buttonVariants({
                  variant: "outline",
                  size: "icon-sm",
                })}
              >
                <LinkedIn className="size-3.5" />
              </a>
              <a
                href="https://behance.net/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance"
                className={buttonVariants({
                  variant: "outline",
                  size: "icon-sm",
                })}
              >
                <Behance className="size-3.5" />
              </a>
              <a
                href="https://dribbble.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble"
                className={buttonVariants({
                  variant: "outline",
                  size: "icon-sm",
                })}
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
