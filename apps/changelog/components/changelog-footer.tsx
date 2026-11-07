"use client"

import Link from "next/link"
import {
  ArrowUp,
  GitBranch,
  Rss,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import { GitHub } from "@workspace/ui/constants/icons"

export function ChangelogFooter() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const ecosystemLinks = [
    { name: "Personal Portfolio", href: "https://rizkyramadhan.dev" },
    { name: "Engineering Blog", href: "https://blog.rizkyramadhan.dev" },
    {
      name: "Documentation & Code Explorer",
      href: "https://docs.rizkyramadhan.dev",
    },
    { name: "Digital Store & Kits", href: "https://shop.rizkyramadhan.dev" },
  ]

  return (
    <footer className="w-full border-t border-foreground/8 bg-card/20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-xl bg-foreground text-background shadow-xs">
                <GitBranch className="size-3.5" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                [ CHANGELOG // SYSTEM JOURNAL ]
              </span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              A public architectural journal and release ledger tracking engineering milestones, performance optimizations, and infrastructure evolutions across the Rizfolio monorepo.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span>Semantic Versioning 2.0.0 (MAJOR.MINOR.PATCH)</span>
            </div>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-foreground">
              Ecosystem
            </h3>
            <ul className="space-y-2.5 text-xs">
              {ecosystemLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="size-2.5 opacity-40 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-foreground">
              Syndication & Source
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/rss.xml"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Rss className="size-3.5 text-foreground/60" />
                  <span>RSS 2.0 Feed</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Rss className="size-3.5 text-foreground/60" />
                  <span>Atom Syndication</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ryzmdn/rizfolio"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GitHub size={13} />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-foreground/8 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js 15, React 19, and Tailwind CSS v4.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-foreground/10 bg-card/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background focus:ring-2 focus:ring-foreground/20 focus:outline-hidden"
          >
            <span>Top</span>
            <ArrowUp className="size-3 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
