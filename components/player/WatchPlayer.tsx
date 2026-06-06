"use client";

import { useEffect, useState } from "react";
import { HlsVideo } from "@/components/player/HlsVideo";
import { ROUTES } from "@/lib/constants";
import type { Episode } from "@/types/domain";

/**
 * Reproductor de la pantalla de ver.
 * - Modo demo: usa la URL HLS pública directa.
 * - Modo real: pide al servidor una URL firmada (Mux) verificando acceso.
 */
export function WatchPlayer({ episode }: { episode: Episode }) {
  const directUrl = episode.demoPlaybackUrl ?? episode.videoUrl ?? null;
  const [src, setSrc] = useState<string | null>(directUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (directUrl) {
      setSrc(directUrl);
      return;
    }
    if (!episode.playbackId) {
      setError("Este video aún no está disponible.");
      return;
    }

    let cancelled = false;
    const url = `${ROUTES.api.playbackSign}?episodeId=${encodeURIComponent(episode.id)}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error("No autorizado");
        const data = (await res.json()) as { url: string };
        if (!cancelled) setSrc(data.url);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el video.");
      });

    return () => {
      cancelled = true;
    };
  }, [episode, directUrl]);

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black px-6 text-center text-sm text-muted">
        {error}
      </div>
    );
  }

  return (
    <HlsVideo
      src={src}
      poster={episode.thumbnailUrl}
      controls
      autoPlay
      className="aspect-video w-full bg-black"
    />
  );
}
