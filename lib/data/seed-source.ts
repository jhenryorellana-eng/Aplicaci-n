/** Implementación de la capa de datos sobre los datos de ejemplo (modo demo). */
import {
  seedEpisodes,
  seedFeedClips,
  seedSections,
  seedSeries,
} from "@/lib/data/seed";
import type {
  Episode,
  FeedClip,
  SectionWithSeries,
  SeriesWithEpisodes,
} from "@/types/domain";

const byPosition = <T extends { position: number }>(a: T, b: T) =>
  a.position - b.position;

export async function getSectionsWithSeriesSeed(): Promise<
  SectionWithSeries[]
> {
  return seedSections
    .slice()
    .sort(byPosition)
    .map((section) => ({
      ...section,
      series: seedSeries
        .filter((s) => s.sectionId === section.id && s.isPublished)
        .sort(byPosition),
    }));
}

export async function getSeriesBySlugSeed(
  slug: string,
): Promise<SeriesWithEpisodes | null> {
  const series = seedSeries.find((s) => s.slug === slug && s.isPublished);
  if (!series) return null;
  const episodes = seedEpisodes
    .filter((e) => e.seriesId === series.id && e.isPublished)
    .sort(byPosition);
  return { ...series, episodes };
}

export async function getEpisodeWithSeriesSeed(
  episodeId: string,
): Promise<{ episode: Episode; series: SeriesWithEpisodes } | null> {
  const episode = seedEpisodes.find((e) => e.id === episodeId);
  if (!episode) return null;
  const seriesSlug = seedSeries.find((s) => s.id === episode.seriesId)?.slug;
  if (!seriesSlug) return null;
  const series = await getSeriesBySlugSeed(seriesSlug);
  if (!series) return null;
  return { episode, series };
}

export async function getFeedClipsSeed(): Promise<FeedClip[]> {
  return seedFeedClips.slice().sort(byPosition);
}
