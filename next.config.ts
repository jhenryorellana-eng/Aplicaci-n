import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Thumbnails reales de Mux.
      { protocol: "https", hostname: "image.mux.com" },
      // Posters de ejemplo (modo demo).
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Desactivado en desarrollo para evitar cacheo molesto al iterar.
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
