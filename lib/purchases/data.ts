import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface StoreProduct {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  kind: "single" | "bundle";
  priceCents: number;
  currency: string;
  seriesIds: string[];
}

/** Ids de series que el usuario actual ya compró (vía RLS). */
export async function getPurchasedSeriesIds(): Promise<Set<string>> {
  const supabase = await createSupabaseServerClient();
  const { data: paid } = await supabase
    .from("purchases")
    .select("product_id")
    .eq("status", "paid");

  const productIds = [...new Set((paid ?? []).map((p) => p.product_id))];
  if (productIds.length === 0) return new Set();

  const { data: links } = await supabase
    .from("product_series")
    .select("series_id")
    .in("product_id", productIds);

  return new Set((links ?? []).map((l) => l.series_id));
}

/** Productos activos con las series que desbloquea cada uno. */
export async function getStoreProducts(): Promise<StoreProduct[]> {
  const supabase = await createSupabaseServerClient();
  const [{ data: products }, { data: links }] = await Promise.all([
    supabase.from("products").select("*").eq("is_active", true).order("position"),
    supabase.from("product_series").select("product_id, series_id"),
  ]);

  const seriesByProduct = new Map<string, string[]>();
  for (const link of links ?? []) {
    const arr = seriesByProduct.get(link.product_id) ?? [];
    arr.push(link.series_id);
    seriesByProduct.set(link.product_id, arr);
  }

  return (products ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    kind: p.kind === "bundle" ? "bundle" : "single",
    priceCents: p.price_cents,
    currency: p.currency,
    seriesIds: seriesByProduct.get(p.id) ?? [],
  }));
}

/** El producto individual que vende una serie concreta. */
export async function getProductForSeries(
  seriesId: string,
): Promise<StoreProduct | null> {
  const products = await getStoreProducts();
  return (
    products.find(
      (p) => p.kind === "single" && p.seriesIds.includes(seriesId),
    ) ?? null
  );
}
