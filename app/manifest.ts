import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "F1 Typy 2026",
    short_name: "F1 Typy",
    description: "Typuj wyniki sezonu F1 2026 i rywalizuj ze znajomymi",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#0D0D0D",
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
