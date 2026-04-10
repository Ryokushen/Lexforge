import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Memory & Vocabulary",
    short_name: "M&V",
    description: "Gamified RPG vocabulary trainer powered by spaced repetition",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1625",
    theme_color: "#1a1625",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
