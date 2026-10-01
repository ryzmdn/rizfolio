import type { MetadataRoute } from "next"
import { getBaseUrl } from "@workspace/ui/lib/seo"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl("linkbio")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
