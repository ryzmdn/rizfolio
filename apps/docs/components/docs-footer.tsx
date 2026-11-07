"use client"

import Link from "next/link"
import Image from "next/image"
import { Footer } from "@workspace/ui/components/layouts/footer"
import {
  GitHub,
  LinkedIn,
  Behance,
  Dribbble,
} from "@workspace/ui/constants/icons"
import { ArrowUp, ArrowUpRight } from "lucide-react"

const DOMAIN_LINKS = [
  { name: "All Repositories", href: "/" },
  { name: "Tugas Kuliah (Coursework)", href: "/?category=ASSIGNMENT" },
  { name: "Eksperimen (Laboratory)", href: "/?category=EXPERIMENT" },
  { name: "Open Source Libraries", href: "/?category=OPEN_SOURCE" },
  { name: "Curriculum Taxonomy", href: "/categories" },
]

export function DocsFooter() {
  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://rizkyramadhan.dev"
  const blogUrl =
    process.env.NEXT_PUBLIC_BLOG_URL || "https://rizkyramadhan.dev/blog"

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Footer
      id="docs-footer"
      className="w-full border-t border-foreground/8 bg-card/20 px-6 py-20 sm:px-8 lg:px-12 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 lg:gap-16">
          <div className="space-y-5 md:col-span-6">
            <div className="flex items-center gap-x-4">
              <div className="relative size-12 overflow-hidden rounded-full ring-1 ring-foreground/15">
                <Image
                  src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                  alt="Rizky Ramadhan"
                  fill
                  sizes="48px"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-lg font-light tracking-tight text-foreground">
                  Rizky Ramadhan
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  Architectural Blueprint & Archive Lead
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm font-light leading-relaxed text-muted-foreground">
              Documenting technical repositories, university coursework, and
              algorithmic experiments. Exploring distributed systems in Go,
              low-level memory allocators in C, and design token ergonomics in
              TypeScript.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://github.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
              >
                <GitHub className="size-4" />
              </a>
              <a
                href="https://linkedin.com/in/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
              >
                <LinkedIn className="size-4" />
              </a>
              <a
                href="https://behance.net/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance Profile"
                className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
              >
                <Behance className="size-4" />
              </a>
              <a
                href="https://dribbble.com/ryzmdn"
                target="_blank"
                rel="noreferrer"
                aria-label="Dribbble Profile"
                className="flex size-9 items-center justify-center rounded-full border border-foreground/10 bg-background/60 text-muted-foreground transition-all hover:border-foreground/30 hover:bg-foreground hover:text-background"
              >
                <Dribbble className="size-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4 md:col-span-3">
            <p className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
              Documentation
            </p>
            <ul className="space-y-2.5 font-mono text-xs">
              {DOMAIN_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 md:col-span-3">
            <p className="font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
              Ecosystem
            </p>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Main Portfolio</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>Engineering Blog</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ryzmdn"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>GitHub Repositories</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-y-4 border-t border-foreground/8 pt-8 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js 16, React 19, Shiki & Tailwind CSS.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3.5 py-1 text-xs text-muted-foreground transition-all hover:bg-foreground hover:text-background"
          >
            <span>Back to top</span>
            <ArrowUp className="size-3" />
          </button>
        </div>
      </div>
    </Footer>
  )
}
