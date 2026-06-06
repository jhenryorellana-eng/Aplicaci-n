import "server-only";
import type { SessionUser } from "@/lib/auth/session";
import { TIER } from "@/lib/constants";
import type { Series } from "@/types/domain";

/**
 * Control de acceso CENTRALIZADO a una serie. Toda la decisión de
 * reproducción pasa por aquí.
 *
 * v1: cualquier usuario autenticado accede a todo (sin paywall todavía).
 * Para ENCENDER el paywall en v2, basta cambiar la rama "premium" por:
 *     return user.tier === TIER.premium;
 * No se requiere ninguna migración de base de datos.
 */
export function canAccessSeries(
  user: SessionUser | null,
  series: Pick<Series, "requiredTier">,
): boolean {
  if (!user) return false; // se requiere sesión para reproducir series

  if (series.requiredTier === TIER.free) return true;

  // requiredTier === 'premium'
  return true; // v1 permisivo · v2: user.tier === TIER.premium
}
