import type { MetadataRoute } from "next"
import { SEO_CONFIG, PWA_ICONS } from "@workspace/ui/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_CONFIG.sites.linkbio.defaultTitle,
    short_name: "Links | Rizky",
    description: SEO_CONFIG.sites.linkbio.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: PWA_ICONS,
  }
}
