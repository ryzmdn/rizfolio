"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@workspace/ui/components/layouts/footer"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  GitHub,
  LinkedIn,
  Behance,
  Dribbble,
} from "@workspace/ui/constants/icons"
import { ArrowUp, Check, Rss, Send } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const footerCategories = [
  { name: "Architecture", href: "/?category=architecture" },
  { name: "Frontend", href: "/?category=frontend" },
  { name: "Performance", href: "/?category=performance" },
  { name: "Database", href: "/?category=database" },
  { name: "DevOps & Cloud", href: "/?category=devops-cloud" },
]

export function BlogFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) return
    setSubscribed(true)
    setTimeout(() => {
      setEmail("")
    }, 2500)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Footer
      id="blog-footer"
      className="w-full border-t border-border/50 bg-card/30 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Top Grid: Bio, Categories & Newsletter */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          {/* Author Card */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-x-3.5">
              <div className="relative size-11 overflow-hidden rounded-full ring-1 ring-border">
                <Image
                  src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                  alt="Rizky Ramadhan"
                  fill
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Rizky Ramadhan</p>
                <p className="text-xs text-muted-foreground">
                  Multidisciplinary Digital Builder
                </p>
              </div>
            </div>

            <p className="text-xs/relaxed text-muted-foreground">
              Documenting systems architecture, design token ergonomics, high-throughput database modeling, and lessons learned shipping production software.
            </p>

            <div className="flex items-center gap-x-2 pt-2">
              <a
                href="https://github.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground hover:text-foreground")}
              >
                <GitHub className="size-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground hover:text-foreground")}
              >
                <LinkedIn className="size-3.5" />
              </a>
              <a
                href="https://behance.net/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance Profile"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground hover:text-foreground")}
              >
                <Behance className="size-3.5" />
              </a>
              <a
                href="https://dribbble.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble Profile"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground hover:text-foreground")}
              >
                <Dribbble className="size-3.5" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                aria-label="RSS Feed"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground hover:text-foreground")}
              >
                <Rss className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3 md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Topics & Domains
            </p>
            <ul className="space-y-2 text-xs">
              {footerCategories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3 md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Stay Informed
            </p>
            <p className="text-xs/relaxed text-muted-foreground">
              Receive concise technical notes whenever new case studies or architectural perspectives are published. No spam.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-x-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500">
                <Check className="size-3.5" />
                <span>Thank you. You are subscribed to updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-x-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className={cn(buttonVariants({ size: "sm" }), "gap-x-1.5 text-xs px-3 shrink-0")}
                >
                  <span>Join</span>
                  <Send className="size-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Colophon, Back to top */}
        <div className="flex flex-col items-start justify-between gap-y-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js 16, React 19 & Tailwind CSS.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
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
