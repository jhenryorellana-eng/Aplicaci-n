/**
 * Modelos de dominio de la app (independientes de la base de datos).
 * Los tipos generados de Supabase (Fase 3) se mapean a estos.
 */
import type { EpisodeStatus, SectionKind, Tier } from "@/lib/constants";

export interface Section {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  kind: SectionKind;
  position: number;
}

export interface Series {
  id: string;
  sectionId: string;
  slug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  position: number;
  requiredTier: Tier;
  isPublished: boolean;
}

export interface Episode {
  id: string;
  seriesId: string;
  title: string;
  description: string | null;
  position: number;
  playbackId: string | null;
  /** URL de video directa (Supabase Storage o cualquier URL .mp4/.m3u8). */
  videoUrl: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  status: EpisodeStatus;
  isPublished: boolean;
  /** Solo modo demo (sin Supabase/Mux): URL HLS pública directa. */
  demoPlaybackUrl?: string;
}

/** Teaser corto del feed vertical; al tocarlo abre su serie. */
export interface FeedClip {
  id: string;
  seriesId: string;
  seriesSlug: string;
  seriesTitle: string;
  playbackId: string | null;
  /** URL de video directa (Supabase Storage o cualquier URL). */
  videoUrl: string | null;
  posterUrl: string | null;
  caption: string | null;
  position: number;
  demoPlaybackUrl?: string;
}

export interface SeriesWithEpisodes extends Series {
  episodes: Episode[];
}

export interface SectionWithSeries extends Section {
  series: Series[];
}
