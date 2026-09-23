import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { DocsHeader } from "../components/docs-header"
import { DocsFooter } from "../components/docs-footer"
import { CommandSearch } from "../components/command-search"

const baseUrl =
  process.env.NEXT_PUBLIC_DOCS_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://docs.rizkyramadhan.dev"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Documentation & Code Explorer — Rizky Ramadhan",
    template: "%s | Rizfolio Docs",
  },
  description:
    "Interactive technical documentation, open-source repositories, academic coursework archive, and source code explorer.",
  keywords: [
    "Software Architecture",
    "Systems Design",
    "Code Explorer",
    "Algorithms",
    "Open Source",
    "Next.js",
    "React 19",
    "Go",
    "TypeScript",
    "C",
    "Turborepo",
    "Drizzle ORM",
  ],
  authors: [{ name: "Rizky Ramadhan", url: "https://rizkyramadhan.dev" }],
  creator: "Rizky Ramadhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Rizfolio Documentation & Code Explorer",
    title: "Documentation & Code Explorer — Rizky Ramadhan",
    description:
      "Explore technical repositories, systems architectures, coursework codebases, and experiments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation & Code Explorer — Rizky Ramadhan",
    description:
      "Explore technical repositories, systems architectures, coursework codebases, and experiments.",
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
          <DocsHeader />
          <main
            id="main-content"
            className="mx-auto min-h-[calc(100vh-16rem)] w-full max-w-7xl bg-transparent"
          >
            {children}
          </main>
          <ProgressiveBlur position="top" height="24px" />
          <ProgressiveBlur height="32px" />
          <DocsFooter />
          <CommandSearch />
        </AppProvider>
      </body>
    </html>
  )
}
