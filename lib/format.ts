/** Utilidades de formato para mostrar al usuario. */

/** "8 min", "" si no hay duración. */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} min`;
}

/** "m:ss" para controles de reproductor. */
export function formatTimecode(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const m = Math.floor(safe / 60);
  const s = Math.floor(safe % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Convierte un texto en slug URL: "Tu Crédito" -> "tu-credito". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
