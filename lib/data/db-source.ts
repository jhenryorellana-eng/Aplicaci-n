/** Implementación de la capa de datos sobre Supabase (modo real). */
import { mapEpisode, mapSection, mapSeries } from "@/lib/data/map";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Episode,
  FeedClip,
  SectionWithSeries,
  SeriesWithEpisodes,
} from "@/types/domain";

export async function getSectionsWithSeriesDb(): Promise<SectionWithSeries[]> {
  const supabase = await createSupabaseServerClient();
  const [{ data: sections }, { data: series }] = await Promise.all([
    supabase.from("sections").select("*").order("position"),
    supabase
      .from("series")
      .select("*")
      .eq("is_published", true)
      .order("position"),
  ]);

  const mappedSeries = (series ?? []).map(mapSeries);
  return (sections ?? []).map(mapSection).map((section) => ({
    ...section,
    series: mappedSeries.filter((s) => s.sectionId === section.id),
  }));
}

export async function getSeriesBySlugDb(
  slug: string,
): Promise<SeriesWithEpisodes | null> {
  const supabase = await createSupabaseServerClient();
  const { data: seriesRow } = await supabase
    .from("series")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!seriesRow) return null;

  const { data: episodes } = await supabase
    .from("episodes")
    .select("*")
    .eq("series_id", seriesRow.id)
    .eq("is_published", true)
    .order("position");

  return { ...mapSeries(seriesRow), episodes: (episodes ?? []).map(mapEpisode) };
}

export async function getEpisodeWithSeriesDb(
  episodeId: string,
): Promise<{ episode: Episode; series: SeriesWithEpisodes } | null> {
  const supabase = await createSupabaseServerClient();
  const { data: epRow } = await supabase
    .from("episodes")
    .select("*")
    .eq("id", episodeId)
    .eq("is_published", true)
    .maybeSingle();
  if (!epRow) return null;

  const { data: seriesRow } = await supabase
    .from("series")
    .select("slug")
    .eq("id", epRow.series_id)
    .maybeSingle();
  if (!seriesRow) return null;

  const series = await getSeriesBySlugDb(seriesRow.slug);
  if (!series) return null;

  return { episode: mapEpisode(epRow), series };
}

export async function getFeedClipsDb(): Promise<FeedClip[]> {
  const supabase = await createSupabaseServerClient();
  const { data: clips } = await supabase
    .from("feed_clips")
    .select("*")
    .eq("is_published", true)
    .order("position");
  if (!clips || clips.length === 0) return [];

  const seriesIds = [...new Set(clips.map((c) => c.series_id))];
  const { data: seriesRows } = await supabase
    .from("series")
    .select("id, slug, title, is_published, section_id")
    .in("id", seriesIds);

  const seriesById = new Map((seriesRows ?? []).map((s) => [s.id, s]));

  const sectionIds = [...new Set((seriesRows ?? []).map((s) => s.section_id))];
  const { data: sectionRows } = sectionIds.length
    ? await supabase.from("sections").select("id, title").in("id", sectionIds)
    : { data: [] };
  const sectionById = new Map((sectionRows ?? []).map((s) => [s.id, s.title]));

  return clips.flatMap((clip) => {
    const series = seriesById.get(clip.series_id);
    if (!series || !series.is_published) return [];
    return [
      {
        id: clip.id,
        seriesId: clip.series_id,
        seriesSlug: series.slug,
        seriesTitle: series.title,
        sectionTitle: sectionById.get(series.section_id) ?? "",
        playbackId: clip.mux_playback_id,
        videoUrl: clip.video_url,
        posterUrl: clip.poster_url,
        caption: clip.caption,
        position: clip.position,
      },
    ];
  });
}
