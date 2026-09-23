import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rizfolio Documentation — Architecture & Code Explorer",
    short_name: "RizDocs",
    description:
      "Interactive technical documentation, open-source repositories, academic coursework archive, and source code explorer.",
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
