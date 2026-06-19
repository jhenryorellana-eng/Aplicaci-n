import "server-only";
import type { SessionUser } from "@/lib/auth/session";
import { ACCESS_TYPE, TIER } from "@/lib/constants";
import type { Series } from "@/types/domain";

/**
 * Control de acceso CENTRALIZADO a una serie según su tipo de acceso.
 * - free          → abierto (v1 abierto a todos).
 * - subscription  → requiere suscripción premium.
 * - purchase      → requiere haber comprado la serie (o un paquete que la incluya).
 *
 * `purchasedSeriesIds` se calcula con getPurchasedSeriesIds() (lib/purchases/data).
 */
export function canAccessSeries(
  user: SessionUser | null,
  series: Pick<Series, "id" | "accessType">,
  purchasedSeriesIds: ReadonlySet<string> = new Set(),
): boolean {
  switch (series.accessType) {
    case ACCESS_TYPE.subscription:
      return user?.tier === TIER.premium;
    case ACCESS_TYPE.purchase:
      return purchasedSeriesIds.has(series.id);
    default:
      return true;
  }
}
