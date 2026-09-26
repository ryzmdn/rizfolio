import type { Metadata } from "next"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { ProgressiveBlur } from "@workspace/ui/components/progressive-blur"
import { CartProvider } from "../components/cart-provider"
import { CartDrawer } from "../components/cart-drawer"
import { ShopHeader } from "../components/shop-header"
import { ShopFooter } from "../components/shop-footer"
import "@workspace/ui/styles/globals.css"

const baseUrl =
  process.env.NEXT_PUBLIC_SHOP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://shop.rizkyramadhan.dev"

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Digital Tools & Engineering Starter Kits | Rizfolio Store",
    template: "%s | Rizfolio Store",
  },
  description:
    "Production-ready architectures, monorepo starter kits, UI design systems, and specialized senior engineering consultation sessions.",
  keywords: [
    "Next.js 16",
    "React 19",
    "Turborepo Starter Kit",
    "Tailwind CSS v4",
    "Drizzle ORM",
    "Go Microservices",
    "Design System",
    "Full-Stack Consultation",
  ],
  authors: [{ name: "Rizky Ramadhan", url: "https://rizkyramadhan.dev" }],
  creator: "Rizky Ramadhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Rizfolio Store",
    title: "Digital Tools & Engineering Starter Kits | Rizfolio Store",
    description:
      "Production-ready architectures, monorepo starter kits, UI design systems, and specialized senior engineering consultation sessions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Tools & Engineering Starter Kits | Rizfolio Store",
    description:
      "Production-ready architectures, monorepo starter kits, UI design systems, and specialized senior engineering consultation sessions.",
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
            <ProgressiveBlur position="top" height="24px" />
            <ProgressiveBlur height="32px" />
            <ShopFooter />
            <CartDrawer />
          </CartProvider>
        </AppProvider>
      </body>
    </html>
  )
}
