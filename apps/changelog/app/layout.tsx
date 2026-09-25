import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { ChangelogHeader, ChangelogFooter, CommandSearch } from "../components"

const baseUrl =
  process.env.NEXT_PUBLIC_CHANGELOG_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://changelog.rizkyramadhan.dev"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Changelog & Dev Log — Rizky Ramadhan",
    template: "%s | Rizfolio Changelog",
  },
  description:
    "Continuous timeline of architectural milestones, feature additions, performance tunings, and version releases across the Rizfolio monorepo ecosystem.",
  keywords: [
    "Changelog",
    "Release Notes",
    "Dev Log",
    "Software Architecture",
    "Next.js 16",
    "React 19",
    "Turborepo",
    "Drizzle ORM",
    "Tailwind CSS v4",
    "Rizky Ramadhan",
  ],
  authors: [{ name: "Rizky Ramadhan", url: "https://rizkyramadhan.dev" }],
  creator: "Rizky Ramadhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Rizfolio Changelog",
    title: "Changelog & Dev Log — Rizky Ramadhan",
    description:
      "Continuous timeline of architectural milestones, feature additions, and version releases across the Rizfolio monorepo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog & Dev Log — Rizky Ramadhan",
    description:
      "Continuous timeline of architectural milestones, feature additions, and version releases across the Rizfolio monorepo.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body className={cn(fontVariables)}>
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-primary focus:outline-hidden"
          >
            Skip to content
          </a>
          <ChangelogHeader />
          <main
            id="main-content"
            className="mx-auto min-h-[calc(100vh-16rem)] w-full max-w-7xl bg-transparent"
          >
            {children}
          </main>
          <ProgressiveBlur position="top" height="24px" />
          <ProgressiveBlur height="32px" />
          <ChangelogFooter />
          <CommandSearch />
        </AppProvider>
      </body>
    </html>
  )
}
