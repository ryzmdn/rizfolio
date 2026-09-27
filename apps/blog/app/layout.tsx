import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { SEO_CONFIG, getBaseUrl } from "@workspace/ui/lib/seo"

const baseUrl = getBaseUrl("blog")

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SEO_CONFIG.sites.blog.defaultTitle,
    template: SEO_CONFIG.sites.blog.titleTemplate,
  },
  description: SEO_CONFIG.sites.blog.description,
  keywords: [...SEO_CONFIG.sites.blog.keywords],
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
    siteName: SEO_CONFIG.sites.blog.name,
    title: SEO_CONFIG.sites.blog.defaultTitle,
    description: SEO_CONFIG.sites.blog.description,
    images: [
      {
        url: SEO_CONFIG.author.avatar,
        width: 800,
        height: 800,
        alt: SEO_CONFIG.sites.blog.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.sites.blog.defaultTitle,
    description: SEO_CONFIG.sites.blog.description,
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
