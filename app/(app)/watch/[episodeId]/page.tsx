import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, RotateCw } from "lucide-react";
import { EpisodeRow } from "@/components/catalog/EpisodeRow";
import { WatchPlayer } from "@/components/player/WatchPlayer";
import { WatchProgressTracker } from "@/components/player/WatchProgressTracker";
import { ServicesFunnel } from "@/components/services/ServicesFunnel";
import { canAccessSeries } from "@/lib/access/gating";
import { getSessionUser } from "@/lib/auth/session";
import { ACCESS_TYPE, ROUTES } from "@/lib/constants";
import { getEpisodeWithSeries } from "@/lib/data/catalog";
import { getPurchasedSeriesIds } from "@/lib/purchases/data";

type Params = { params: Promise<{ episodeId: string }> };

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { episodeId } = await params;
  const data = await getEpisodeWithSeries(episodeId);
  return { title: data?.episode.title ?? "Ver" };
}

export default async function WatchPage({ params }: Params) {
  const { episodeId } = await params;
  const data = await getEpisodeWithSeries(episodeId);
  if (!data) notFound();

  const { episode, series } = data;
  const index = series.episodes.findIndex((e) => e.id === episode.id);
  const next = series.episodes[index + 1];

  const isPurchase = series.accessType === ACCESS_TYPE.purchase;
  const user = await getSessionUser();
  const purchasedIds =
    user && !user.isDemo ? await getPurchasedSeriesIds() : new Set<string>();
  const hasAccess = canAccessSeries(user, series, purchasedIds);

  // Video de pago no comprado → pantalla de bloqueo con CTA de compra.
  if (isPurchase && !hasAccess) {
    return (
      <main className="grid min-h-[100dvh] place-items-center px-6 pb-28 text-center">
        <div className="max-w-sm space-y-5">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-gold/15">
            <Lock className="size-8 text-gold" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Este video es de pago
          </h1>
          <p className="text-muted">
            Desbloquéalo y míralo todas las veces que quieras, cuando quieras.
          </p>
          <Link
            href={ROUTES.series(series.slug)}
            className="inline-flex rounded-full bg-gold px-7 py-3.5 font-bold text-background transition-transform hover:scale-[1.03] active:scale-95"
          >
            Ver opciones de compra
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-28">
      <WatchProgressTracker episodeId={episode.id} />
      <div className="relative bg-black">
        <WatchPlayer episode={episode} isProtected={isPurchase} />
        <Link
          href={ROUTES.series(series.slug)}
          aria-label="Volver a la serie"
          className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-black/45 backdrop-blur transition-colors hover:bg-black/65"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </Link>
      </div>

      {/* Sugerencia de rotar el teléfono (solo en móvil vertical). */}
      <p className="flex items-center justify-center gap-2 px-5 pt-3 text-xs text-faint sm:hidden landscape:hidden">
        <RotateCw className="size-3.5 text-gold" aria-hidden />
        Gira tu teléfono para verlo más grande
      </p>

      <div className="space-y-1 px-5 pt-5">
        <Link
          href={ROUTES.series(series.slug)}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-gold"
        >
          {series.title}
        </Link>
        <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
          {episode.title}
        </h1>
      </div>

      {next && (
        <div className="px-5 pt-5">
          <Link
            href={ROUTES.watch(next.id)}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition-colors hover:border-gold/50"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                Siguiente
              </p>
              <p className="truncate font-semibold">{next.title}</p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-gold" aria-hidden />
          </Link>
        </div>
      )}

      <section className="mt-7 space-y-1 px-3">
        <h2 className="px-2 pb-2 font-display text-lg font-bold">
          Más de esta serie
        </h2>
        {series.episodes.map((ep) => (
          <EpisodeRow
            key={ep.id}
            episode={ep}
            active={ep.id === episode.id}
          />
        ))}
      </section>

      {series.slug === "audiencia-de-merito" && (
        <div className="px-5 pt-8">
          <ServicesFunnel />
        </div>
      )}
    </main>
  );
}
