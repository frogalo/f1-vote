import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "F1 2025 Vote",
    short_name: "F1 Vote",
    description: "Vote for your favorite 2025 F1 winner",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any", // Supports any size
        type: "image/svg+xml",
      },
    ],
  };
}
