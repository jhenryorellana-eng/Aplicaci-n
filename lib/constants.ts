/**
 * Constantes de la aplicación. Centralizamos aquí strings y números
 * "mágicos" para no repetirlos por el código.
 */

// Nombre placeholder — pendiente de definir la marca con el cliente.
export const APP_NAME = "Ruta USA";
export const APP_DESCRIPTION =
  "El camino al éxito en Estados Unidos, paso a paso y en video.";

export const ROUTES = {
  home: "/",
  login: "/login",
  feed: "/feed",
  catalog: "/catalog",
  series: (slug: string) => `/series/${slug}`,
  watch: (episodeId: string) => `/watch/${episodeId}`,
  admin: "/admin",
  api: {
    playbackSign: "/api/playback/sign",
    muxWebhook: "/api/mux/webhook",
  },
} as const;

export const TIER = {
  free: "free",
  premium: "premium",
} as const;
export type Tier = (typeof TIER)[keyof typeof TIER];

export const ROLE = {
  admin: "admin",
  user: "user",
} as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];

export const SECTION_KIND = {
  guidedPath: "guided_path",
  topic: "topic",
} as const;
export type SectionKind = (typeof SECTION_KIND)[keyof typeof SECTION_KIND];

export const EPISODE_STATUS = {
  processing: "processing",
  ready: "ready",
  errored: "errored",
} as const;
export type EpisodeStatus =
  (typeof EPISODE_STATUS)[keyof typeof EPISODE_STATUS];

/** Configuración de rendimiento del feed vertical. */
export const FEED = {
  /** Cuántos videos precargar por delante del activo. */
  preloadAhead: 2,
  /** Cuántos videos mantener cargados por detrás del activo. */
  preloadBehind: 1,
  /** Proporción visible para considerar un slide como "activo". */
  intersectionThreshold: 0.6,
  /** Buffer máximo del video del feed (segundos), para no quemar datos. */
  feedMaxBufferSeconds: 15,
} as const;

/** Duración de las URLs firmadas de reproducción de Mux (formato Mux). */
export const PLAYBACK_TOKEN_EXPIRATION = "1h";
