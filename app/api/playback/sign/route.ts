import { NextResponse } from "next/server";
import { canAccessSeries } from "@/lib/access/gating";
import { getSessionUser } from "@/lib/auth/session";
import { ACCESS_TYPE } from "@/lib/constants";
import { getEpisodeWithSeries } from "@/lib/data/catalog";
import { isMuxConfigured } from "@/lib/env";
import { signedPlaybackUrl } from "@/lib/mux/server";
import { getPurchasedSeriesIds } from "@/lib/purchases/data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Choke point de seguridad: verifica sesión + acceso (compra/suscripción)
 * ANTES de entregar el video. Devuelve una URL firmada de corta vida.
 */
export async function GET(request: Request) {
  const episodeId = new URL(request.url).searchParams.get("episodeId");
  if (!episodeId) {
    return NextResponse.json({ error: "Falta episodeId" }, { status: 400 });
  }

  const data = await getEpisodeWithSeries(episodeId);
  if (!data) {
    return NextResponse.json(
      { error: "Episodio no disponible" },
      { status: 404 },
    );
  }

  const user = await getSessionUser();
  const purchasedIds =
    user && !user.isDemo ? await getPurchasedSeriesIds() : new Set<string>();
  if (!canAccessSeries(user, data.series, purchasedIds)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Contenido de pago → URL firmada del bucket privado de Supabase Storage.
  if (data.series.accessType === ACCESS_TYPE.purchase) {
    if (!data.episode.videoUrl) {
      return NextResponse.json(
        { error: "Video no disponible aún" },
        { status: 404 },
      );
    }
    const admin = createSupabaseAdminClient();
    const { data: signed, error } = await admin.storage
      .from("protected")
      .createSignedUrl(data.episode.videoUrl, 60 * 60);
    if (error || !signed) {
      return NextResponse.json({ error: "No se pudo cargar" }, { status: 500 });
    }
    return NextResponse.json({ url: signed.signedUrl });
  }

  // Contenido Mux (firma JWT).
  if (!data.episode.playbackId) {
    return NextResponse.json(
      { error: "Episodio no disponible" },
      { status: 404 },
    );
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
