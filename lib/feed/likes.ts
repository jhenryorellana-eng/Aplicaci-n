import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface FeedEngagement {
  /** clip_id -> número de likes */
  likeCounts: Record<string, number>;
  /** clips que el usuario actual marcó */
  likedClipIds: string[];
  /** clip_id -> número de comentarios */
  commentCounts: Record<string, number>;
  /** series que el usuario actual guardó (favoritos) */
  savedSeriesIds: string[];
}

const EMPTY: FeedEngagement = {
  likeCounts: {},
  likedClipIds: [],
  commentCounts: {},
  savedSeriesIds: [],
};

export async function getFeedEngagement(
  clipIds: string[],
  seriesIds: string[],
): Promise<FeedEngagement> {
  if (clipIds.length === 0) return EMPTY;

  const supabase = await createSupabaseServerClient();
  const [{ data: likes }, { data: comments }, { data: auth }] =
    await Promise.all([
      supabase.from("feed_likes").select("clip_id, user_id").in("clip_id", clipIds),
      supabase.from("feed_comments").select("clip_id").in("clip_id", clipIds),
      supabase.auth.getUser(),
    ]);

  const userId = auth.user?.id;

  const likeCounts: Record<string, number> = {};
  const likedClipIds: string[] = [];
  for (const row of likes ?? []) {
    likeCounts[row.clip_id] = (likeCounts[row.clip_id] ?? 0) + 1;
    if (userId && row.user_id === userId) likedClipIds.push(row.clip_id);
  }

  const commentCounts: Record<string, number> = {};
  for (const row of comments ?? []) {
    commentCounts[row.clip_id] = (commentCounts[row.clip_id] ?? 0) + 1;
  }

  let savedSeriesIds: string[] = [];
  if (userId && seriesIds.length) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("series_id")
      .in("series_id", seriesIds);
    savedSeriesIds = (favs ?? []).map((f) => f.series_id);
  }

  return { likeCounts, likedClipIds, commentCounts, savedSeriesIds };
}
