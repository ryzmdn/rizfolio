import type { Metadata } from "next"
import "@workspace/ui/styles/globals.css"
import { fontVariables } from "@workspace/ui/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"
import { AppProvider } from "@workspace/ui/components/app-provider"
import { SEO_CONFIG, getBaseUrl, createProfilePageJsonLd } from "@workspace/ui/lib/seo"

const linkbioUrl = getBaseUrl("linkbio")

export const metadata: Metadata = {
  metadataBase: new URL(linkbioUrl),
  title: {
    default: SEO_CONFIG.sites.linkbio.defaultTitle,
    template: SEO_CONFIG.sites.linkbio.titleTemplate,
  },
  description: SEO_CONFIG.sites.linkbio.description,
  keywords: [...SEO_CONFIG.sites.linkbio.keywords],
  authors: [{ name: SEO_CONFIG.author.name, url: SEO_CONFIG.author.url }],
  creator: SEO_CONFIG.author.name,
  alternates: {
    canonical: linkbioUrl,
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: linkbioUrl,
    siteName: SEO_CONFIG.sites.linkbio.name,
    title: SEO_CONFIG.sites.linkbio.defaultTitle,
    description: SEO_CONFIG.sites.linkbio.description,
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
    title: SEO_CONFIG.sites.linkbio.defaultTitle,
    description: SEO_CONFIG.sites.linkbio.description,
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
  const profileJsonLd = createProfilePageJsonLd({
    url: linkbioUrl,
    description: SEO_CONFIG.sites.linkbio.description,
  })

  return (
    <html lang="en" className="w-full scroll-smooth" suppressHydrationWarning>
      <body className={cn(fontVariables)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
        />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
