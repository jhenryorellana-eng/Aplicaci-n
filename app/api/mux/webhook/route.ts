import type Mux from "@mux/mux-node";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { EPISODE_STATUS } from "@/lib/constants";
import { muxClient } from "@/lib/mux/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type MuxWebhookEvent = Awaited<ReturnType<Mux["webhooks"]["unwrap"]>>;

/**
 * Webhook de Mux: marca episodios/clips como listos cuando el asset termina
 * de procesarse. Verifica la firma antes de escribir (con service_role).
 */
export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  let event: MuxWebhookEvent;
  try {
    event = await muxClient().webhooks.unwrap(body, headersList);
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  if (event.type === "video.asset.ready") {
    const asset = event.data;
    const playbackId = asset.playback_ids?.[0]?.id ?? null;
    const duration = asset.duration ? Math.round(asset.duration) : null;

    await Promise.all([
      supabase
        .from("episodes")
        .update({
          mux_playback_id: playbackId,
          duration_seconds: duration,
          status: EPISODE_STATUS.ready,
        })
        .eq("mux_asset_id", asset.id),
      supabase
        .from("feed_clips")
        .update({
          mux_playback_id: playbackId,
          status: EPISODE_STATUS.ready,
        })
        .eq("mux_asset_id", asset.id),
    ]);
  } else if (event.type === "video.asset.errored") {
    const assetId = event.data.id;
    await Promise.all([
      supabase
        .from("episodes")
        .update({ status: EPISODE_STATUS.errored })
        .eq("mux_asset_id", assetId),
      supabase
        .from("feed_clips")
        .update({ status: EPISODE_STATUS.errored })
        .eq("mux_asset_id", assetId),
    ]);
  }

  return NextResponse.json({ received: true });
}
