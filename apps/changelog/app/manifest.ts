import type { MetadataRoute } from "next"
import { PWA_ICONS } from "@workspace/ui/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizfolio Changelog: Release Notes & Dev Log",
    short_name: "RizChangelog",
    description:
      "Continuous timeline of version releases, architecture milestones, and performance tunings across the Rizfolio ecosystem.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait",
    icons: PWA_ICONS,
  }
}
