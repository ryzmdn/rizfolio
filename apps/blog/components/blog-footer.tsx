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
import { buttonVariants } from "@workspace/ui/components/button"

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

import { subscribeNewsletterAction } from "@/lib/actions"

export function BlogFooter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"

  const handleSubscribe = async (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) return

    setIsSubmitting(true)
    setFeedbackMessage(null)

    try {
      const result = await subscribeNewsletterAction(email)
      setIsSuccess(result.success)
      setFeedbackMessage(result.message)
      if (result.success) {
        setEmail("")
      }
    } catch {
      setIsSuccess(false)
      setFeedbackMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Footer
      id="blog-footer"
      className="w-full border-t border-foreground/8 bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">
          <div className="space-y-5 md:col-span-5">
            <div className="flex items-center gap-3.5">
              <div className="relative size-11 overflow-hidden rounded-full border border-foreground/15 bg-foreground/5">
                <Image
                  src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                  alt="Rizky Ramadhan"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  [ THE MONOGRAPH // ARCHIVES ]
                </span>
                <p className="font-serif text-base font-light text-foreground">
                  Rizky Ramadhan
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Multidisciplinary Digital Builder
                </p>
              </div>
            </div>

            <p className="max-w-sm text-xs font-light leading-relaxed text-muted-foreground">
              Documenting systems architecture, design token ergonomics, high-throughput database modeling, and lessons learned shipping production software.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
              >
                <GitHub className="size-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
              >
                <LinkedIn className="size-3.5" />
              </a>
              <a
                href="https://behance.net/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance Profile"
                className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
              >
                <Behance className="size-3.5" />
              </a>
              <a
                href="https://dribbble.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble Profile"
                className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
              >
                <Dribbble className="size-3.5" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                aria-label="RSS Feed"
                className="flex size-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground"
              >
                <Rss className="size-3.5" />
              </a>
            </div>

            <div className="pt-1 font-mono text-xs">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Return to Portfolio Ecosystem [ -&gt; ]
              </a>
            </div>
          </div>

          <div className="space-y-4 md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground">
              Topics & Domains
            </p>
            <ul className="space-y-2.5 font-mono text-xs">
              {footerLinks.map((cat) => (
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

          <div className="space-y-4 md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground">
              Monograph Dispatch
            </p>
            <p className="text-xs font-light leading-relaxed text-muted-foreground">
              Receive concise technical notes whenever new case studies or architectural perspectives are published. No marketing spam.
            </p>

            {feedbackMessage && isSuccess ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 font-mono text-xs text-foreground">
                <Check className="size-4 shrink-0 text-emerald-500" />
                <span>{feedbackMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="NAME@DOMAIN.COM"
                    className="min-w-0 flex-1 rounded-full border border-foreground/10 bg-foreground/3 px-4 py-2 font-mono text-xs uppercase text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-hidden disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe to updates"
                    className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2 font-mono text-xs uppercase tracking-wider text-background transition-opacity hover:opacity-85 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "..." : "Join"}</span>
                    <Send className="size-3" />
                  </button>
                </div>
                {feedbackMessage && !isSuccess && (
                  <p className="font-mono text-xs text-destructive">{feedbackMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-foreground/8 pt-8 font-mono text-[11px] text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Rizky Ramadhan. The Monograph Series. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-4 py-1.5 uppercase tracking-wider transition-all duration-200 hover:border-foreground/30 hover:bg-foreground hover:text-background"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3" />
          </button>
        </div>
      </div>
    </Footer>
  )
}
