import { NextResponse } from "next/server";
import { canAccessSeries } from "@/lib/access/gating";
import { getSessionUser } from "@/lib/auth/session";
import { getEpisodeWithSeries } from "@/lib/data/catalog";
import { isMuxConfigured } from "@/lib/env";
import { signedPlaybackUrl } from "@/lib/mux/server";

export const runtime = "nodejs";

/**
 * Choke point de seguridad: verifica sesión + acceso ANTES de firmar la
 * reproducción. Devuelve una URL HLS firmada de corta vida.
 */
export async function GET(request: Request) {
  const episodeId = new URL(request.url).searchParams.get("episodeId");
  if (!episodeId) {
    return NextResponse.json({ error: "Falta episodeId" }, { status: 400 });
  }

  const data = await getEpisodeWithSeries(episodeId);
  if (!data || !data.episode.playbackId) {
    return NextResponse.json(
      { error: "Episodio no disponible" },
      { status: 404 },
    );
  }

  const user = await getSessionUser();
  if (!canAccessSeries(user, data.series)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  if (!isMuxConfigured()) {
    return NextResponse.json(
      { error: "Reproducción no configurada" },
      { status: 503 },
    );
  }

  const url = await signedPlaybackUrl(data.episode.playbackId);
  return NextResponse.json({ url });
}
