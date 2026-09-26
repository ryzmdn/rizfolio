"use client"

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
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

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
      className="w-full border-t border-border/50 bg-card/30 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-x-3.5">
              <div className="relative size-11 overflow-hidden rounded-full ring-1 ring-border">
                <Image
                  src="https://res.cloudinary.com/dhaonb1vn/image/upload/v1783196888/WhatsApp_Image_2026-07-05_at_03.27.41_hz9vld.jpg"
                  alt="Rizky Ramadhan"
                  fill
                  sizes="44px"
                  className="size-full object-cover"
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

            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Documenting technical repositories, university coursework, and
              algorithmic experiments. Exploring distributed systems in Go,
              low-level memory allocators in C, and design token ergonomics in
              TypeScript.
            </p>

            <div className="flex items-center gap-x-2 pt-1">
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
            </div>
          </div>

          <div className="space-y-3 md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Documentation
            </p>
            <ul className="space-y-2 text-xs">
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

          <div className="space-y-3 md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Ecosystem
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
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
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
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
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>GitHub Repositories</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-y-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Rizky Ramadhan. Built with Next.js
            16, React 19, Shiki & Tailwind CSS.
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
