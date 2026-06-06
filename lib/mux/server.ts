import "server-only";
import Mux from "@mux/mux-node";
import { PLAYBACK_TOKEN_EXPIRATION } from "@/lib/constants";
import { requireEnv } from "@/lib/env";

let cached: Mux | null = null;

/** Cliente de Mux (solo servidor). Lazy para no exigir env en el arranque. */
export function muxClient(): Mux {
  if (!cached) {
    cached = new Mux({
      tokenId: requireEnv("MUX_TOKEN_ID"),
      tokenSecret: requireEnv("MUX_TOKEN_SECRET"),
      jwtSigningKey: requireEnv("MUX_SIGNING_KEY_ID"),
      jwtPrivateKey: requireEnv("MUX_SIGNING_PRIVATE_KEY"),
      webhookSecret: process.env.MUX_WEBHOOK_SECRET,
    });
  }
  return cached;
}

/** URL HLS firmada (corta vida) para un playback id con política "signed". */
export async function signedPlaybackUrl(playbackId: string): Promise<string> {
  const token = await muxClient().jwt.signPlaybackId(playbackId, {
    type: "video",
    expiration: PLAYBACK_TOKEN_EXPIRATION,
  });
  return `https://stream.mux.com/${playbackId}.m3u8?token=${token}`;
}
