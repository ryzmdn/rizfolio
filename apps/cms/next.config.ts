import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const cmsCspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://*.supabase.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim()

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@workspace/ui"],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  experimental: {
    lockDistDir: false,
    optimizePackageImports: ["lucide-react", "@workspace/ui"],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/:path*",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "/:path*",
        permanent: false,
      },
      {
        source: "/overview",
        destination: "/",
        permanent: false,
      },
      {
        source: "/changelogs",
        destination: "/changelog",
        permanent: false,
      },
      {
        source: "/blogs",
        destination: "/blog",
        permanent: false,
      },
      {
        source: "/posts",
        destination: "/blog",
        permanent: false,
      },
      {
        source: "/articles",
        destination: "/blog",
        permanent: false,
      },
      {
        source: "/products",
        destination: "/shop",
        permanent: false,
      },
      {
        source: "/orders",
        destination: "/shop",
        permanent: false,
      },
      {
        source: "/store",
        destination: "/shop",
        permanent: false,
      },
      {
        source: "/repos",
        destination: "/docs",
        permanent: false,
      },
      {
        source: "/repositories",
        destination: "/docs",
        permanent: false,
      },
      {
        source: "/documentation",
        destination: "/docs",
        permanent: false,
      },
      {
        source: "/inquiries",
        destination: "/inbox",
        permanent: false,
      },
      {
        source: "/messages",
        destination: "/inbox",
        permanent: false,
      },
      {
        source: "/links",
        destination: "/linkbio",
        permanent: false,
      },
      {
        source: "/bio",
        destination: "/linkbio",
        permanent: false,
      },
      {
        source: "/ledger",
        destination: "/transactions",
        permanent: false,
      },
      {
        source: "/system",
        destination: "/settings",
        permanent: false,
      },
      {
        source: "/health",
        destination: "/settings",
        permanent: false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cmsCspHeader,
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ]
  },
}

const withMDX = createMDX()

export default withMDX(
  nextConfig as Parameters<typeof withMDX>[0]
) as unknown as NextConfig
