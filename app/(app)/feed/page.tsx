import type { Metadata } from "next";
import { FeedContainer } from "@/components/feed/FeedContainer";
import { getFeedClips } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Feed" };

export default async function FeedPage() {
  const clips = await getFeedClips();

  if (clips.length === 0) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-6 text-center text-muted">
        Pronto habrá videos por aquí.
      </main>
    );
  }

  return <FeedContainer clips={clips} />;
}
