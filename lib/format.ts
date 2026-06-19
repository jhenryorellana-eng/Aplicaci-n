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

/** Abrevia números grandes: 86 -> "86", 1200 -> "1.2K", 1500000 -> "1.5M". */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}K`;
  }
  const m = n / 1_000_000;
  return `${m % 1 === 0 ? m : m.toFixed(1)}M`;
}

/** Formatea centavos a precio: 800 -> "$8", 1750 -> "$17.50". */
export function formatPrice(cents: number, currency = "usd"): string {
  const amount = cents / 100;
  const value = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return currency.toLowerCase() === "usd"
    ? `$${value}`
    : `${value} ${currency.toUpperCase()}`;
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
