import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"

const baseUrl =
  process.env.NEXT_PUBLIC_BLOG_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://rizkyramadhan.dev/blog"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Rizky Ramadhan | Engineering Blog",
    template: "%s | Rizky Ramadhan",
  },
  description:
    "In-depth articles, systems architecture perspectives, and technical notes on full-stack web engineering, monorepos, and design systems.",
  keywords: [
    "Software Architecture",
    "Systems Design",
    "Monorepo",
    "Next.js",
    "React 19",
    "Turborepo",
    "TypeScript",
    "PostgreSQL",
    "Design Systems",
    "Tailwind CSS v4",
  ],
  authors: [{ name: "Rizky Ramadhan", url: "https://rizkyramadhan.dev" }],
  creator: "Rizky Ramadhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Rizky Ramadhan | Engineering Blog",
    title: "Rizky Ramadhan | Engineering Blog",
    description:
      "Articles, architecture, and notes on modern full-stack systems, monorepos, and UI engineering.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizky Ramadhan | Engineering Blog",
    description:
      "Articles, architecture, and notes on modern full-stack systems, monorepos, and UI engineering.",
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
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
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Rizky Ramadhan | Engineering Blog RSS Feed"
          href="/rss.xml"
        />
      </head>
      <body className={cn(fontVariables)}>
        <AppProvider>
          <BlogHeader />
          <main
            id="layout-main"
            className="mx-auto min-h-[calc(100vh-16rem)] w-full max-w-7xl bg-transparent"
          >
            {children}
          </main>
          <ProgressiveBlur position="top" height="24px" />
          <ProgressiveBlur height="32px" />
          <BlogFooter />
        </AppProvider>
      </body>
    </html>
  )
}
