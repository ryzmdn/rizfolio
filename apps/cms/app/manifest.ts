import type { MetadataRoute } from "next"
import { PWA_ICONS } from "@workspace/ui/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizfolio CMS: Admin Dashboard",
    short_name: "RizCMS",
    description:
      "Internal content management portal and administration workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: PWA_ICONS,
  }
}
