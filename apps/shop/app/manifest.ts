import type { MetadataRoute } from "next"
import { PWA_ICONS } from "@workspace/ui/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizfolio Store | Digital Tools & Starter Kits",
    short_name: "RizShop",
    description:
      "Production-ready architectures, templates, and full-stack consultation services.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: PWA_ICONS,
  }
}
