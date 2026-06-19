"use client";

import { Share2 } from "lucide-react";
import { toast } from "@/lib/stores/toastStore";

export function ShareButton({ title, path }: { title: string; path: string }) {
  async function share() {
    const url = `${window.location.origin}${path}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // El usuario canceló el diálogo de compartir; sin acción.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Compartir"
      className="flex flex-col items-center gap-1"
    >
      <span className="grid size-12 place-items-center rounded-full bg-black/40 backdrop-blur">
        <Share2 className="size-6 text-white" aria-hidden />
      </span>
      <span className="text-xs font-semibold text-white drop-shadow">
        Compartir
      </span>
    </button>
  );
}
