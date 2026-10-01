import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"

import { SEO_CONFIG, getBaseUrl } from "@workspace/ui/lib/seo"

const portfolioUrl = getBaseUrl("portfolio")

export const metadata: Metadata = {
  metadataBase: new URL(portfolioUrl),
  title: {
    default: SEO_CONFIG.sites.portfolio.defaultTitle,
    template: SEO_CONFIG.sites.portfolio.titleTemplate,
  },
  description: SEO_CONFIG.sites.portfolio.description,
  keywords: [...SEO_CONFIG.sites.portfolio.keywords],
  authors: [{ name: SEO_CONFIG.author.name, url: SEO_CONFIG.author.url }],
  creator: SEO_CONFIG.author.name,
  alternates: {
    canonical: portfolioUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: portfolioUrl,
    siteName: SEO_CONFIG.sites.portfolio.name,
    title: SEO_CONFIG.sites.portfolio.defaultTitle,
    description: SEO_CONFIG.sites.portfolio.description,
    images: [
      {
        url: SEO_CONFIG.author.avatar,
        width: 800,
        height: 800,
        alt: SEO_CONFIG.author.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.sites.portfolio.defaultTitle,
    description: SEO_CONFIG.sites.portfolio.description,
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
      <body className={cn(fontVariables)}>
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-primary focus:outline-hidden"
          >
            Skip to main content
          </a>
          <AppHeader />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-4xl bg-transparent outline-none"
          >
            {children}
          </main>
          <ProgressiveBlur position="top" height="32px" />
          <ProgressiveBlur height="40px" />
          <AppFooter />
        </AppProvider>
      </body>
    </html>
  )
}
