import type { MetadataRoute } from "next";
import { APP_DESCRIPTION, APP_NAME, ROUTES } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} — El camino al éxito en EE.UU.`,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: ROUTES.feed,
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0a0c",
    theme_color: "#0b0a0c",
    lang: "es",
    dir: "ltr",
    categories: ["education", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
