"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { CmsSidebar } from "./cms-sidebar"
import { CmsHeader } from "./cms-header"

export function CmsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return <main className="min-h-screen bg-background">{children}</main>
  }

  return (
    <div className="min-h-screen bg-background">
      <CmsSidebar />
      <div className="flex flex-col md:pl-64">
        <CmsHeader />
        <main className="flex-1 pb-16">{children}</main>
      </div>
    </div>
  )
}
