import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import { ROUTES, TIER } from "@/lib/constants";
import type { Series } from "@/types/domain";

type Props = {
  series: Series;
  /** Número de paso (solo en la ruta guiada). */
  step?: number;
  className?: string;
};

export function SeriesCard({ series, step, className = "" }: Props) {
  const isPremium = series.requiredTier === TIER.premium;

  return (
    <Link
      href={ROUTES.series(series.slug)}
      className={`group relative block ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-surface">
        {series.coverUrl && (
          <Image
            src={series.coverUrl}
            alt={series.title}
            fill
            sizes="(max-width: 640px) 45vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {step !== undefined && (
          <span className="absolute left-3 top-3 flex size-8 items-center justify-center rounded-full bg-gold font-display text-sm font-extrabold text-background shadow-lg">
            {step}
          </span>
        )}

        {isPremium && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wide text-gold backdrop-blur">
            <Lock className="size-3" aria-hidden />
            Premium
          </span>
        )}

        <h3 className="absolute inset-x-0 bottom-0 p-3 font-display text-sm font-bold leading-tight text-white">
          {series.title}
        </h3>
      </div>
    </Link>
  );
}
