import "server-only";
import { mapEpisode, mapSeries } from "@/lib/data/map";
import { SECTION_KIND } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Episode, Series } from "@/types/domain";

type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];

export interface ProfileData {
  episodesWatched: number;
  minutesLearned: number;
  seriesInProgress: number;
  guided: { done: number; total: number };
  continueWatching: { episode: Episode; series: Series } | null;
  favorites: Series[];
}

const EMPTY: ProfileData = {
  episodesWatched: 0,
  minutesLearned: 0,
  seriesInProgress: 0,
  guided: { done: 0, total: 0 },
  continueWatching: null,
  favorites: [],
};

export async function getProfileData(): Promise<ProfileData> {
  const supabase = await createSupabaseServerClient();

  const [{ data: progress }, { data: favRows }] = await Promise.all([
    supabase
      .from("watch_progress")
      .select("episode_id, position_seconds, completed, updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("favorites")
      .select("series_id, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const progressRows = progress ?? [];
  const favSeriesIds = (favRows ?? []).map((f) => f.series_id);

  if (progressRows.length === 0 && favSeriesIds.length === 0) return EMPTY;

  const episodesWatched = progressRows.length;
  const minutesLearned = Math.round(
    progressRows.reduce((sum, r) => sum + (r.position_seconds ?? 0), 0) / 60,
  );

  // Episodios vistos (para serie en progreso y "continuar viendo").
  const watchedIds = progressRows.map((r) => r.episode_id);
  let watchedEpisodes: EpisodeRow[] = [];
  if (watchedIds.length) {
    const { data } = await supabase
      .from("episodes")
      .select("*")
      .in("id", watchedIds);
    watchedEpisodes = data ?? [];
  }
  const episodeById = new Map(watchedEpisodes.map((e) => [e.id, e]));
  const seriesInProgress = new Set(
    watchedEpisodes.map((e) => e.series_id),
  ).size;

  // Continuar viendo: el más reciente sin terminar.
  let continueWatching: ProfileData["continueWatching"] = null;
  const latest = progressRows.find(
    (r) => !r.completed && episodeById.has(r.episode_id),
  );
  if (latest) {
    const ep = episodeById.get(latest.episode_id);
    if (ep) {
      const { data: sRow } = await supabase
        .from("series")
        .select("*")
        .eq("id", ep.series_id)
        .maybeSingle();
      if (sRow) {
        continueWatching = { episode: mapEpisode(ep), series: mapSeries(sRow) };
      }
    }
  }

  // Favoritos (manteniendo el orden por fecha).
  let favorites: Series[] = [];
  if (favSeriesIds.length) {
    const { data: favSeries } = await supabase
      .from("series")
      .select("*")
      .in("id", favSeriesIds);
    const byId = new Map((favSeries ?? []).map((s) => [s.id, mapSeries(s)]));
    favorites = favSeriesIds
      .map((id) => byId.get(id))
      .filter((s): s is Series => Boolean(s));
  }

  // Progreso de la Ruta del Éxito (episodios completados / total).
  const guided = { done: 0, total: 0 };
  const { data: guidedSection } = await supabase
    .from("sections")
    .select("id")
    .eq("kind", SECTION_KIND.guidedPath)
    .maybeSingle();
  if (guidedSection) {
    const { data: gSeries } = await supabase
      .from("series")
      .select("id")
      .eq("section_id", guidedSection.id)
      .eq("is_published", true);
    const gSeriesIds = (gSeries ?? []).map((s) => s.id);
    if (gSeriesIds.length) {
      const { data: gEps } = await supabase
        .from("episodes")
        .select("id")
        .in("series_id", gSeriesIds)
        .eq("is_published", true);
      const gEpIds = new Set((gEps ?? []).map((e) => e.id));
      guided.total = gEpIds.size;
      guided.done = progressRows.filter(
        (r) => r.completed && gEpIds.has(r.episode_id),
      ).length;
    }
  }

  return {
    episodesWatched,
    minutesLearned,
    seriesInProgress,
    guided,
    continueWatching,
    favorites,
  };
}
