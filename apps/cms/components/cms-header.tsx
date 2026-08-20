"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { ThemeToggle } from "@workspace/ui/components/theme-toggle"
import { buttonVariants } from "@workspace/ui/components/button"

export function CmsHeader() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/80 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Link href="/" className="hover:text-foreground transition-colors">
          cms
        </Link>
        {pathSegments.map((segment, index) => (
          <span key={segment} className="flex items-center gap-2">
            <span>/</span>
            <span
              className={
                index === pathSegments.length - 1
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              {segment}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <span className="text-xs">Live Site</span>
          <ExternalLink className="size-3.5 ml-1" />
        </a>

        <ThemeToggle
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        />
      </div>
    </header>
  )
}
