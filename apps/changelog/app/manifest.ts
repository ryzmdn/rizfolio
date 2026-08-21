import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizfolio Changelog — Release Notes & Dev Log",
    short_name: "RizChangelog",
    description:
      "Continuous timeline of version releases, architecture milestones, and performance tunings.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
