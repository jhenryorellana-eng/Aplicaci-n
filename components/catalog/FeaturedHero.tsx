import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { Series } from "@/types/domain";

/** "Billboard" destacado estilo Netflix para la serie principal. */
export function FeaturedHero({ series }: { series: Series }) {
  return (
    <section className="reveal relative px-4">
      <Link
        href={ROUTES.series(series.slug)}
        className="group relative block overflow-hidden rounded-3xl border border-border/60"
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
          {series.coverUrl && (
            <Image
              src={series.coverUrl}
              alt={series.title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/55 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-gold">
            Destacado
          </span>
          <h2 className="max-w-[18ch] font-display text-3xl font-extrabold leading-[1.02] tracking-tight">
            {series.title}
          </h2>
          {series.description && (
            <p className="line-clamp-2 max-w-[44ch] text-sm leading-relaxed text-muted">
              {series.description}
            </p>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-background transition-transform duration-200 group-hover:scale-[1.03]">
            <Play className="size-4 fill-background" aria-hidden />
            Empezar ahora
          </span>
        </div>
      </Link>
    </section>
  );
}
