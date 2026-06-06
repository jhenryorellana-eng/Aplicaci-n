"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  seriesId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
};

export function FavoriteButton({
  seriesId,
  initialFavorited,
  isLoggedIn,
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = ROUTES.login;
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = ROUTES.login;
      return;
    }

    if (favorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("series_id", seriesId)
        .eq("user_id", user.id);
      setFavorited(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ series_id: seriesId, user_id: user.id });
      setFavorited(true);
    }
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={favorited}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3.5 text-base font-bold transition-colors disabled:opacity-60 ${
        favorited
          ? "border-gold/60 bg-gold/15 text-gold"
          : "border-border text-foreground hover:border-gold/50"
      }`}
    >
      <Heart
        className={`size-5 ${favorited ? "fill-gold" : ""}`}
        aria-hidden
      />
      {favorited ? "Guardado" : "Guardar"}
    </button>
  );
}
