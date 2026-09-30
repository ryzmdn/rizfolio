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
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Rizky Ramadhan
                </p>
                <p className="text-xs text-muted-foreground">
                  Multidisciplinary Digital Builder
                </p>
              </div>
            </div>

            <p className="text-xs/relaxed text-muted-foreground">
              Documenting systems architecture, design token ergonomics,
              high-throughput database modeling, and lessons learned shipping
              production software.
            </p>

            <div className="flex items-center gap-x-2 pt-2">
              <a
                href="https://github.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <GitHub className="size-3.5" />
              </a>
              <a
                href="https://linkedin.com/in/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <LinkedIn className="size-3.5" />
              </a>
              <a
                href="https://behance.net/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance Profile"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <Behance className="size-3.5" />
              </a>
              <a
                href="https://dribbble.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble Profile"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <Dribbble className="size-3.5" />
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noreferrer"
                aria-label="RSS Feed"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
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
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Topics & Domains
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

          {/* Newsletter Box */}
          <div className="space-y-3 md:col-span-4">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Stay Informed
            </p>
            <p className="text-xs/relaxed text-muted-foreground">
              Receive concise technical notes whenever new case studies or
              architectural perspectives are published. No spam.
            </p>

            {feedbackMessage && isSuccess ? (
              <div className="flex items-center gap-x-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-foreground">
                <Check className="size-4 shrink-0 text-emerald-500" />
                <span>{feedbackMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-x-2">
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="min-w-0 flex-1 rounded-md border border-border/70 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:outline-hidden disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe to updates"
                    className={cn(
                      "inline-flex shrink-0 cursor-pointer items-center gap-x-1.5 rounded-md bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50"
                    )}
                  >
                    <span>{isSubmitting ? "Subscribing..." : "Join"}</span>
                    <Send className="size-3" />
                  </button>
                </div>
                {feedbackMessage && !isSuccess && (
                  <p className="text-xs text-destructive">{feedbackMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright, Colophon, Back to top */}
        <div className="flex flex-col items-start justify-between gap-y-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js
            16, React 19 & Tailwind CSS.
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
