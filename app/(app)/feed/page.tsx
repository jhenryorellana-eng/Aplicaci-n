import type { Metadata } from "next";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { getSessionUser } from "@/lib/auth/session";
import { getFeedClips } from "@/lib/data/catalog";
import { getFeedEngagement } from "@/lib/feed/likes";

export const metadata: Metadata = { title: "Feed" };
export const dynamic = "force-dynamic"; // orden aleatorio + likes por usuario

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default async function FeedPage() {
  // Clips y sesión son independientes → en paralelo (evita una espera en cadena).
  const [clipsRaw, user] = await Promise.all([getFeedClips(), getSessionUser()]);
  const clips = shuffle(clipsRaw);

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
