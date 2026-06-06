/**
 * Helpers de URLs públicas de Mux (seguros para el cliente).
 * Las URLs FIRMADAS de contenido protegido se generan en el servidor
 * (ver app/api/playback/sign), nunca aquí.
 */

const MUX_STREAM = "https://stream.mux.com";
const MUX_IMAGE = "https://image.mux.com";

/** Manifiesto HLS para un playback id con política "public". */
export function muxPublicHlsUrl(playbackId: string): string {
  return `${MUX_STREAM}/${playbackId}.m3u8`;
}

/** Thumbnail/poster para un playback id "public". */
export function muxThumbnailUrl(
  playbackId: string,
  opts?: { time?: number; width?: number },
): string {
  const params = new URLSearchParams();
  if (opts?.time != null) params.set("time", String(opts.time));
  if (opts?.width != null) params.set("width", String(opts.width));
  const qs = params.toString();
  return `${MUX_IMAGE}/${playbackId}/thumbnail.webp${qs ? `?${qs}` : ""}`;
}
