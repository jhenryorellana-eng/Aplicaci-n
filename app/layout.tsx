import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { publicEnv } from "@/lib/env";

// Plus Jakarta Sans: la fuente que USA Latino Prime eligió por su parecido a
// SF Pro de Apple. Limpia, geométrica, premium. Una sola familia para todo.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: `${APP_NAME} — El camino al éxito en EE.UU.`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-180.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#060d1c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="min-h-[100dvh] bg-background font-body text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
