import type { Metadata } from "next";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { getSessionUser } from "@/lib/auth/session";
import { getFeedClips } from "@/lib/data/catalog";
import { getFeedEngagement } from "@/lib/feed/likes";
import { orderFeedClips } from "@/lib/feed/order";

export const metadata: Metadata = { title: "Feed" };
export const dynamic = "force-dynamic"; // orden aleatorio + likes por usuario

export default async function FeedPage() {
  // Clips y sesión son independientes → en paralelo (evita una espera en cadena).
  const [clipsRaw, user] = await Promise.all([getFeedClips(), getSessionUser()]);
  // Orden al azar, sin dos clips seguidos de la misma serie.
  const clips = orderFeedClips(clipsRaw);

  if (clips.length === 0) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-6 text-center text-muted">
        Pronto habrá videos por aquí.
      </main>
    );
  }

  const { likeCounts, likedClipIds, commentCounts, savedSeriesIds } =
    await getFeedEngagement(
      clips.map((c) => c.id),
      clips.map((c) => c.seriesId),
    );

  return (
    <FeedContainer
      clips={clips}
      likeCounts={likeCounts}
      likedClipIds={likedClipIds}
      commentCounts={commentCounts}
      savedSeriesIds={savedSeriesIds}
      isLoggedIn={user ? !user.isDemo : false}
    />
  );
}
