"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { toast } from "@/lib/stores/toastStore";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  seriesId: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
};

export function SaveButton({ seriesId, initialSaved, isLoggedIn }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!isLoggedIn) {
      window.location.href = `${ROUTES.login}?next=${encodeURIComponent(ROUTES.feed)}`;
      return;
    }
    if (busy) return;

    const next = !saved;
    setSaved(next);
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
          .from("favorites")
          .insert({ series_id: seriesId, user_id: user.id })
      : await supabase
          .from("favorites")
          .delete()
          .eq("series_id", seriesId)
          .eq("user_id", user.id);

    setBusy(false);
    if (error) {
      setSaved(!next);
      toast.error("No se pudo guardar.");
      return;
    }
    toast.success(next ? "Guardado en favoritos" : "Quitado de favoritos");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label="Guardar"
      className="flex flex-col items-center gap-1"
    >
      <span
        className={`grid size-12 place-items-center rounded-full backdrop-blur transition-colors ${
          saved ? "bg-gold/25" : "bg-black/40"
        }`}
      >
        <Bookmark
          className={`size-7 ${saved ? "fill-gold text-gold" : "text-white"}`}
          aria-hidden
        />
      </span>
      <span className="text-xs font-semibold text-white drop-shadow">
        Guardar
      </span>
    </button>
  );
}
