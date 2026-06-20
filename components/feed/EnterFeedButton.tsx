"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useFeedStore } from "@/lib/stores/feedStore";

/**
 * Entra al feed CON sonido. Al ser navegación SPA, el gesto del clic sigue
 * activo al montar el feed, así que el navegador permite reproducir con audio.
 */
export function EnterFeedButton({ className }: { className?: string }) {
  const setMuted = useFeedStore((s) => s.setMuted);
  return (
    <Link href={ROUTES.feed} onClick={() => setMuted(false)} className={className}>
      <Play className="size-5 fill-background" />
      Ver el feed
    </Link>
  );
}
