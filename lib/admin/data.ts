import "server-only";
import { mapEpisode, mapSection, mapSeries } from "@/lib/data/map";
import {
  seedEpisodes,
  seedFeedClips,
  seedSections,
  seedSeries,
} from "@/lib/data/seed";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Episode, FeedClip, Section, Series } from "@/types/domain";

const byPosition = <T extends { position: number }>(a: T, b: T) =>
  a.position - b.position;

/** Clip del feed con su estado de publicación (para administración). */
export interface AdminClip extends FeedClip {
  isPublished: boolean;
}

export async function adminListSections(): Promise<Section[]> {
  if (!isSupabaseConfigured()) return [...seedSections].sort(byPosition);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("sections").select("*").order("position");
  return (data ?? []).map(mapSection);
}

export async function adminListSeries(): Promise<Series[]> {
  if (!isSupabaseConfigured()) return [...seedSeries].sort(byPosition);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("series").select("*").order("position");
  return (data ?? []).map(mapSeries);
}

export async function adminGetSeries(
  id: string,
): Promise<{ series: Series; episodes: Episode[] } | null> {
  if (!isSupabaseConfigured()) {
    const series = seedSeries.find((s) => s.id === id);
    if (!series) return null;
    return {
      series,
      episodes: seedEpisodes
        .filter((e) => e.seriesId === id)
        .sort(byPosition),
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from("series")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!row) return null;

  const { data: eps } = await supabase
    .from("episodes")
    .select("*")
    .eq("series_id", id)
    .order("position");

  return { series: mapSeries(row), episodes: (eps ?? []).map(mapEpisode) };
}

export async function adminListClips(): Promise<AdminClip[]> {
  if (!isSupabaseConfigured()) {
    return seedFeedClips
      .slice()
      .sort(byPosition)
      .map((c) => ({ ...c, isPublished: true }));
  }

  const supabase = await createSupabaseServerClient();
  const { data: clips } = await supabase
    .from("feed_clips")
    .select("*")
    .order("position");
  if (!clips) return [];

  const seriesIds = [...new Set(clips.map((c) => c.series_id))];
  const { data: seriesRows } = await supabase
    .from("series")
    .select("id, slug, title")
    .in("id", seriesIds);
  const seriesById = new Map((seriesRows ?? []).map((s) => [s.id, s]));

  return clips.map((c) => ({
    id: c.id,
    seriesId: c.series_id,
    seriesSlug: seriesById.get(c.series_id)?.slug ?? "",
    seriesTitle: seriesById.get(c.series_id)?.title ?? "—",
    sectionTitle: "",
    playbackId: c.mux_playback_id,
    videoUrl: c.video_url,
    posterUrl: c.poster_url,
    caption: c.caption,
    position: c.position,
    isPublished: c.is_published,
  }));
}
