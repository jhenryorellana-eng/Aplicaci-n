/**
 * Capa de acceso a datos del catálogo.
 *
 * Despacha a Supabase (modo real) o a los datos de ejemplo (modo demo).
 * Mientras la base real esté VACÍA (sin contenido publicado), cae al contenido
 * de ejemplo para que la app se vea viva. En cuanto se publica contenido real,
 * este reemplaza al demo automáticamente.
 */
import {
  getEpisodeWithSeriesDb,
  getFeedClipsDb,
  getSectionsWithSeriesDb,
  getSeriesBySlugDb,
} from "@/lib/data/db-source";
import {
  getEpisodeWithSeriesSeed,
  getFeedClipsSeed,
  getSectionsWithSeriesSeed,
  getSeriesBySlugSeed,
} from "@/lib/data/seed-source";
import { isSupabaseConfigured } from "@/lib/env";
import { SECTION_KIND } from "@/lib/constants";
import type {
  Episode,
  FeedClip,
  SectionWithSeries,
  SeriesWithEpisodes,
} from "@/types/domain";

export async function getSectionsWithSeries(): Promise<SectionWithSeries[]> {
  if (!isSupabaseConfigured()) return getSectionsWithSeriesSeed();
  const real = await getSectionsWithSeriesDb();
  const hasSeries = real.some((section) => section.series.length > 0);
  return hasSeries ? real : getSectionsWithSeriesSeed();
}

export async function getGuidedPath(): Promise<SectionWithSeries | null> {
  const sections = await getSectionsWithSeries();
  return sections.find((s) => s.kind === SECTION_KIND.guidedPath) ?? null;
}

export async function getSeriesBySlug(
  slug: string,
): Promise<SeriesWithEpisodes | null> {
  if (!isSupabaseConfigured()) return getSeriesBySlugSeed(slug);
  return (await getSeriesBySlugDb(slug)) ?? getSeriesBySlugSeed(slug);
}

export async function getEpisodeWithSeries(
  episodeId: string,
): Promise<{ episode: Episode; series: SeriesWithEpisodes } | null> {
  if (!isSupabaseConfigured()) return getEpisodeWithSeriesSeed(episodeId);
  return (
    (await getEpisodeWithSeriesDb(episodeId)) ??
    getEpisodeWithSeriesSeed(episodeId)
  );
}

export async function getFeedClips(): Promise<FeedClip[]> {
  if (!isSupabaseConfigured()) return getFeedClipsSeed();
  const real = await getFeedClipsDb();
  return real.length > 0 ? real : getFeedClipsSeed();
}
