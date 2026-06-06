import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Lock, Play } from "lucide-react";
import { EpisodeRow } from "@/components/catalog/EpisodeRow";
import { FavoriteButton } from "@/components/series/FavoriteButton";
import { getSessionUser } from "@/lib/auth/session";
import { ROUTES, TIER } from "@/lib/constants";
import { getSeriesBySlug } from "@/lib/data/catalog";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  return { title: series?.title ?? "Serie" };
}

export default async function SeriesPage({ params }: Params) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  if (!series) notFound();

  const firstEpisode = series.episodes[0];
  const isPremium = series.requiredTier === TIER.premium;

  const user = await getSessionUser();
  let favorited = false;
  if (user && !user.isDemo) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("favorites")
      .select("series_id")
      .eq("series_id", series.id)
      .maybeSingle();
    favorited = Boolean(data);
  }

  return (
    <main className="pb-28">
      {/* Héroe */}
      <header className="relative">
        <div className="relative aspect-[3/4] max-h-[62vh] w-full overflow-hidden sm:aspect-[16/9]">
          {series.coverUrl && (
            <Image
              src={series.coverUrl}
              alt={series.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        </div>

        <Link
          href={ROUTES.catalog}
          aria-label="Volver al catálogo"
          className="absolute left-4 top-5 grid size-10 place-items-center rounded-full bg-black/40 backdrop-blur transition-colors hover:bg-black/60"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </Link>

        <div className="absolute inset-x-0 bottom-0 space-y-3 px-5 pb-2">
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-wide text-gold">
              <Lock className="size-3" aria-hidden />
              Premium
            </span>
          )}
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
            {series.title}
          </h1>
          {series.description && (
            <p className="max-w-[58ch] text-sm leading-relaxed text-muted">
              {series.description}
            </p>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row">
        {firstEpisode && (
          <Link
            href={ROUTES.watch(firstEpisode.id)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-background transition-transform duration-200 hover:scale-[1.02] active:scale-95 sm:flex-none"
          >
            <Play className="size-5 fill-background" aria-hidden />
            Empezar
          </Link>
        )}
        <FavoriteButton
          seriesId={series.id}
          initialFavorited={favorited}
          isLoggedIn={Boolean(user)}
        />
      </div>

      <section className="mt-7 space-y-1 px-3">
        <h2 className="px-2 pb-2 font-display text-lg font-bold">Episodios</h2>
        {series.episodes.map((episode) => (
          <EpisodeRow key={episode.id} episode={episode} />
        ))}
      </section>
    </main>
  );
}
