import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { CmsShell } from "../components/cms-shell"

export const metadata: Metadata = {
  title: {
    default: "Rizfolio Mission Control | Executive CMS",
    template: "%s | Rizfolio CMS",
  },
  description:
    "Unified administrative control room and transaction ledger for the Rizfolio monorepo ecosystem.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body className={cn(fontVariables, "min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary")}>
        <AppProvider>
          <CmsShell>{children}</CmsShell>
        </AppProvider>
      </body>
    </html>
  )
}
