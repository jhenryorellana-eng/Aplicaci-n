"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Guarda el progreso de visionado del episodio en watch_progress.
 * Solo actúa si hay sesión. No renderiza nada.
 */
export function WatchProgressTracker({ episodeId }: { episodeId: string }) {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let userId: string | null = null;
    let interval: ReturnType<typeof setInterval> | undefined;
    let video: HTMLVideoElement | null = null;

    const save = async (completed: boolean) => {
      if (!userId || !video) return;
      await supabase.from("watch_progress").upsert(
        {
          user_id: userId,
          episode_id: episodeId,
          position_seconds: Math.floor(video.currentTime || 0),
          completed,
        },
        { onConflict: "user_id,episode_id" },
      );
    };

    const onEnded = () => void save(true);

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;
      video = document.querySelector("video");
      video?.addEventListener("ended", onEnded);
      interval = setInterval(() => void save(false), 5000);
    })();

    return () => {
      if (interval) clearInterval(interval);
      video?.removeEventListener("ended", onEnded);
      void save(false);
    };
  }, [episodeId]);

  return null;
}
