import type { MetadataRoute } from "next"
import { getBaseUrl } from "@workspace/ui/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl("portfolio")

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ]
}
