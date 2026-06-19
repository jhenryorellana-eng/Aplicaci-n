/** Mapea filas de la base de datos a los modelos de dominio. */
import type {
  AccessType,
  EpisodeStatus,
  SectionKind,
  Tier,
} from "@/lib/constants";
import { muxThumbnailUrl } from "@/lib/mux/playback";
import type { Database } from "@/types/database";
import type { Episode, Section, Series } from "@/types/domain";

type SectionRow = Database["public"]["Tables"]["sections"]["Row"];
type SeriesRow = Database["public"]["Tables"]["series"]["Row"];
type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];

export function mapSection(r: SectionRow): Section {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    kind: r.kind as SectionKind,
    position: r.position,
  };
}

export function mapSeries(r: SeriesRow): Series {
  return {
    id: r.id,
    sectionId: r.section_id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    coverUrl: r.cover_url,
    position: r.position,
    requiredTier: r.required_tier as Tier,
    accessType: r.access_type as AccessType,
    comingSoon: r.coming_soon,
    isPublished: r.is_published,
  };
}

export function mapEpisode(r: EpisodeRow): Episode {
  const thumbnail =
    r.thumbnail_url ??
    (r.mux_playback_id
      ? muxThumbnailUrl(r.mux_playback_id, { width: 640 })
      : null);

  return {
    id: r.id,
    seriesId: r.series_id,
    title: r.title,
    description: r.description,
    position: r.position,
    playbackId: r.mux_playback_id,
    videoUrl: r.video_url,
    durationSeconds: r.duration_seconds,
    thumbnailUrl: thumbnail,
    status: r.status as EpisodeStatus,
    isPublished: r.is_published,
  };
}
