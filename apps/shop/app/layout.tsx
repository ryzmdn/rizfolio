import type { Metadata } from "next"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { CurrencyProvider } from "../components/currency-context"
import { CartProvider } from "../components/cart-provider"
import { CartDrawer } from "../components/cart-drawer"
import { ShopHeader } from "../components/shop-header"
import { ShopFooter } from "../components/shop-footer"
import "@workspace/ui/styles/globals.css"

import { SEO_CONFIG, getBaseUrl, THEMED_FAVICON_METADATA } from "@workspace/ui/lib/seo"

const baseUrl = getBaseUrl("shop")

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  icons: THEMED_FAVICON_METADATA,
  title: {
    default: SEO_CONFIG.sites.shop.defaultTitle,
    template: SEO_CONFIG.sites.shop.titleTemplate,
  },
  description: SEO_CONFIG.sites.shop.description,
  keywords: [...SEO_CONFIG.sites.shop.keywords],
  authors: [{ name: SEO_CONFIG.author.name, url: SEO_CONFIG.author.url }],
  creator: SEO_CONFIG.author.name,
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: SEO_CONFIG.sites.shop.name,
    title: SEO_CONFIG.sites.shop.defaultTitle,
    description: SEO_CONFIG.sites.shop.description,
    images: [
      {
        url: SEO_CONFIG.author.avatar,
        width: 800,
        height: 800,
        alt: SEO_CONFIG.sites.shop.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.sites.shop.defaultTitle,
    description: SEO_CONFIG.sites.shop.description,
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
          <CurrencyProvider>
            <CartProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-primary focus:outline-hidden"
              >
                Skip to content
              </a>
              <ShopHeader />
              <main
                id="main-content"
                className="mx-auto min-h-[calc(100vh-16rem)] w-full max-w-7xl bg-transparent"
              >
                {children}
              </main>
              <ShopFooter />
              <CartDrawer />
            </CartProvider>
          </CurrencyProvider>
        </AppProvider>
      </body>
    </html>
  )
}
