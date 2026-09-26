"use client"

import Link from "next/link"
import { ArrowUp, GitBranch, Rss, ExternalLink, CheckCircle2 } from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"

export function ChangelogFooter() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const ecosystemLinks = [
    { name: "Personal Portfolio", href: "https://rizkyramadhan.dev" },
    { name: "Engineering Blog", href: "https://blog.rizkyramadhan.dev" },
    { name: "Documentation & Code Explorer", href: "https://docs.rizkyramadhan.dev" },
    { name: "Digital Store & Kits", href: "https://shop.rizkyramadhan.dev" },
  ]

  return (
    <footer className="w-full border-t border-border/80 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shadow-xs">
                <GitBranch className="size-3.5" />
              </div>
              <span className="font-bold tracking-tight text-foreground">
                RizChangelog
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              A public engineering timeline documenting architectural iterations,
              version milestones, performance optimizations, and infrastructure
              enhancements across the Rizfolio digital ecosystem.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Semantic Versioning 2.0.0 (MAJOR.MINOR.PATCH)</span>
            </div>
          </div>

          <div className="space-y-3 md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Ecosystem
            </h3>
            <ul className="space-y-2 text-xs">
              {ecosystemLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="size-2.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Feeds & Source
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/rss.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Rss className="size-3 text-amber-500" />
                  <span>RSS 2.0 Feed</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Rss className="size-3 text-blue-500" />
                  <span>Atom Feed</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ryzmdn/rizfolio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GitHub size={12} />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js 16, React 19, and Tailwind CSS v4.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
