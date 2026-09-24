"use client"

import { ReactNode, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { CmsSidebar } from "./cms-sidebar"
import { CmsHeader } from "./cms-header"
import { CmsCommandPalette } from "./cms-command-palette"

interface CmsShellProps {
  children: ReactNode
  userEmail?: string
}

export function CmsShell({ children, userEmail }: CmsShellProps) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [prevPathname, setPrevPathname] = useState(pathname)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMobileMenuOpen(false)
  }

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
    return <main className="min-h-screen bg-background">{children}</main>
  }

  return (
    <div className="min-h-screen bg-background">
      <CmsSidebar
        userEmail={userEmail}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col md:pl-64">
        <CmsHeader
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenCommand={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1 pb-16">{children}</main>
      </div>

      <CmsCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  )
}
