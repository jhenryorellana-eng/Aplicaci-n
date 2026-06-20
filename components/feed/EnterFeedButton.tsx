"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useFeedStore } from "@/lib/stores/feedStore";

/**
 * Entra al feed CON sonido. Al ser navegación SPA, el gesto del clic sigue
 * activo al montar el feed, así que el navegador permite reproducir con audio.
 */
export function EnterFeedButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const setMuted = useFeedStore((s) => s.setMuted);
  return (
    <Link href={ROUTES.feed} onClick={() => setMuted(false)} className={className}>
      {children}
    </Link>
  );
}
