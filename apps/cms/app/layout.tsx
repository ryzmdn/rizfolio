import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { THEMED_FAVICON_METADATA } from "@workspace/ui/lib/seo"
import { CmsShell } from "../components/cms-shell"

export const metadata: Metadata = {
  icons: THEMED_FAVICON_METADATA,
  title: {
    default: "Rizfolio Mission Control | Executive CMS",
    template: "%s | Rizfolio CMS",
  },
  description:
    "Unified administrative control room and transaction ledger for the Rizfolio monorepo ecosystem.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          fontVariables,
          "min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary"
        )}
      >
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-primary focus:outline-hidden"
          >
            Skip to main content
          </a>
          <CmsShell>{children}</CmsShell>
        </AppProvider>
      </body>
    </html>
  )
}
