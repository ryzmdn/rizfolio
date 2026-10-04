import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { ChangelogHeader, ChangelogFooter, CommandSearch } from "../components"
import {
  SEO_CONFIG,
  getBaseUrl,
  THEMED_FAVICON_METADATA,
} from "@workspace/ui/lib/seo"

const baseUrl = getBaseUrl("changelog")

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  icons: THEMED_FAVICON_METADATA,
  title: {
    default: SEO_CONFIG.sites.changelog.defaultTitle,
    template: SEO_CONFIG.sites.changelog.titleTemplate,
  },
  description: SEO_CONFIG.sites.changelog.description,
  keywords: [...SEO_CONFIG.sites.changelog.keywords],
  authors: [{ name: SEO_CONFIG.author.name, url: SEO_CONFIG.author.url }],
  creator: SEO_CONFIG.author.name,
  alternates: {
    canonical: baseUrl,
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: SEO_CONFIG.sites.changelog.name,
    title: SEO_CONFIG.sites.changelog.defaultTitle,
    description: SEO_CONFIG.sites.changelog.description,
    images: [
      {
        url: SEO_CONFIG.author.avatar,
        width: 800,
        height: 800,
        alt: SEO_CONFIG.sites.changelog.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.sites.changelog.defaultTitle,
    description: SEO_CONFIG.sites.changelog.description,
    images: [SEO_CONFIG.author.avatar],
    creator: "@ryzmdn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={cn(
          fontVariables,
          "min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary"
        )}
      >
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-primary focus:outline-hidden"
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
