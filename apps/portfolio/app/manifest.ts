import type { MetadataRoute } from "next"
import { PWA_ICONS } from "@workspace/ui/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizky Ramadhan | Portfolio & Engineering",
    short_name: "Rizfolio",
    description:
      "Full-Stack Software Engineer & Distributed Systems Architect Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: PWA_ICONS,
  }
}
