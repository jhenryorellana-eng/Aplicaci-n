import type { FeedClip } from "@/types/domain";

/** Baraja (Fisher-Yates). */
function shuffle(items: FeedClip[]): FeedClip[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Ordena los clips al azar evitando que dos seguidos sean de la misma serie.
 * `avoidSeriesId` evita además que el PRIMER clip sea de esa serie (útil para
 * encadenar lotes sin repetir el caso en la unión).
 */
export function orderFeedClips(
  items: FeedClip[],
  avoidSeriesId?: string,
): FeedClip[] {
  const pool = shuffle(items);
  const result: FeedClip[] = [];
  let lastSeries = avoidSeriesId ?? null;

  while (pool.length) {
    // Toma el primer candidato de una serie distinta a la anterior.
    let idx = pool.findIndex((c) => c.seriesId !== lastSeries);
    if (idx === -1) idx = 0; // solo queda la misma serie: inevitable
    const [picked] = pool.splice(idx, 1);
    result.push(picked);
    lastSeries = picked.seriesId;
  }

  return result;
}
