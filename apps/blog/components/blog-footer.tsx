"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@workspace/ui/components/layouts/footer"
import {
  GitHub,
  LinkedIn,
  Behance,
  Dribbble,
} from "@workspace/ui/constants/icons"
import { ArrowUp, Check, Rss, Send } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const footerLinks = [
  { name: "Architecture", href: "/?category=architecture" },
  { name: "Frontend", href: "/?category=frontend" },
  { name: "Performance", href: "/?category=performance" },
  { name: "Database", href: "/?category=database" },
  { name: "DevOps", href: "/?category=devops-cloud" },
]

const socialLinks = [
  { href: "https://github.com/ryzmdn", label: "GitHub", Icon: GitHub },
  { href: "https://linkedin.com/in/ryzmdn", label: "LinkedIn", Icon: LinkedIn },
  { href: "https://behance.net/ryzmdn", label: "Behance", Icon: Behance },
  { href: "https://dribbble.com/ryzmdn", label: "Dribbble", Icon: Dribbble },
]

export function BlogFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) return
    setSubscribed(true)
    setTimeout(() => setEmail(""), 2500)
  }

  return (
    <Footer
      id="blog-footer"
      className="w-full border-t border-border/50 bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-16">
          <div className="space-y-5 md:col-span-5">
            <div className="flex items-center gap-x-3">
              <div className="relative size-10 overflow-hidden rounded-full ring-1 ring-border/60">
                <Image
                  src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                  alt="Rizky Ramadhan"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Rizky Ramadhan</p>
                <p className="text-xs text-muted-foreground">Multidisciplinary Digital Builder</p>
              </div>
            </div>

            <p className="text-sm/relaxed text-muted-foreground">
              Documenting systems architecture, design token ergonomics, high-throughput database modeling, and lessons from shipping production software.
            </p>

            <div className="flex items-center gap-x-1">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${label} Profile`}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                aria-label="RSS Feed"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <Rss className="size-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-x-3 pt-1">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-foreground underline underline-offset-2 hover:text-muted-foreground"
              >
                Main Portfolio
              </a>
            </div>
          </div>

          <div className="space-y-3 md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Topics
            </p>
            <ul className="space-y-2">
              {footerLinks.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Stay Updated
              </p>
              <p className="mt-2 text-sm/relaxed text-muted-foreground">
                Concise notes when new articles or architectural perspectives are published.
              </p>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-x-2 border border-border/60 bg-muted/40 px-3 py-2.5 text-sm text-foreground">
                <Check className="size-4 shrink-0 text-muted-foreground" />
                <span>Thank you. You are subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-x-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="min-w-0 flex-1 rounded-md border border-border/70 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to updates"
                  className={cn(
                    "inline-flex shrink-0 items-center gap-x-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
                  )}
                >
                  <span>Join</span>
                  <Send className="size-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-y-3 border-t border-border/40 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js, React 19 & Tailwind CSS.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-x-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3" />
          </button>
        </div>
      </div>
    </Footer>
  )
}
