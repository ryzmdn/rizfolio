import type { MetadataRoute } from "next"
import { getBaseUrl } from "@workspace/ui/lib/seo"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl("shop")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/download/", "/checkout", "/order/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
