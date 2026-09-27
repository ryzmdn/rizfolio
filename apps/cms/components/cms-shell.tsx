"use client"

import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { CmsSidebar } from "./cms-sidebar"
import { CmsHeader } from "./cms-header"
import { CmsCommandPalette } from "./cms-command-palette"

export function CmsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (isLoginPage) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-background outline-none"
      >
        {children}
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <CmsSidebar />

      <CmsSidebar
        isMobile
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col md:pl-64">
        <CmsHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 pb-16 outline-none"
        >
          {children}
        </main>
      </div>

      <CmsCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}
