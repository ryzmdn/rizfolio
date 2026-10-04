import type { MetadataRoute } from "next"
import { PWA_ICONS } from "@workspace/ui/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizfolio Documentation | Open Source & Code Explorer",
    short_name: "RizDocs",
    description:
      "Interactive technical documentation, open-source repositories, academic coursework archive, and source code explorer.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: PWA_ICONS,
  }
}
