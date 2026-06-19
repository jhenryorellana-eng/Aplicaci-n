"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatCount } from "@/lib/format";
import { toast } from "@/lib/stores/toastStore";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  clipId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
};

export function LikeButton({
  clipId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    // "Me gusta" requiere registro previo.
    if (!isLoggedIn) {
      window.location.href = `${ROUTES.login}?next=${encodeURIComponent(ROUTES.feed)}`;
      return;
    }
    if (busy) return;

    const next = !liked;
    setLiked(next);
    setCount((c) => Math.max(0, c + (next ? 1 : -1)));
    setBusy(true);

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = ROUTES.login;
      return;
    }

    const { error } = next
      ? await supabase
          .from("feed_likes")
          .insert({ clip_id: clipId, user_id: user.id })
      : await supabase
          .from("feed_likes")
          .delete()
          .eq("clip_id", clipId)
          .eq("user_id", user.id);

    setBusy(false);
    if (error) {
      setLiked(!next);
      setCount((c) => Math.max(0, c + (next ? -1 : 1)));
      toast.error("No se pudo. Inténtalo de nuevo.");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label="Me gusta"
      className="flex flex-col items-center gap-1"
    >
      <span
        className={`grid size-12 place-items-center rounded-full backdrop-blur transition-colors ${
          liked ? "bg-gold/25" : "bg-black/40"
        }`}
      >
        <Heart
          className={`size-7 transition-transform ${
            liked ? "scale-110 fill-gold text-gold" : "text-white"
          }`}
          aria-hidden
        />
      </span>
      <span className="text-xs font-bold text-white drop-shadow">
        {formatCount(count)}
      </span>
    </button>
  );
}
