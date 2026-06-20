import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SeriesCard } from "@/components/catalog/SeriesCard";
import { ROUTES } from "@/lib/constants";
import type { SectionWithSeries } from "@/types/domain";

/**
 * Bloque destacado del Kit de audiencias: es el contenido real y prioritario
 * del catálogo. Billboard + las 3 audiencias en fila.
 */
export function KitShowcase({ section }: { section: SectionWithSeries }) {
  const first = section.series[0];
  if (!first) return null;
  const cover = section.coverUrl ?? first.coverUrl;

  return (
    <section className="reveal space-y-4">
      <div className="px-4">
        <Link
          href={ROUTES.series(first.slug)}
          className="group relative block overflow-hidden rounded-3xl border border-gold/40"
        >
          <div className="relative aspect-[4/5] w-full sm:aspect-[16/8]">
            {cover && (
              <Image
                src={cover}
                alt={section.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 700px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/65 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-background">
              <ShieldCheck className="size-3.5" aria-hidden />
              Kit de preparación
            </span>
            <h2 className="max-w-[20ch] font-display text-2xl font-extrabold leading-[1.05] tracking-tight sm:text-3xl">
              {section.title}
            </h2>
            {section.description && (
              <p className="line-clamp-2 max-w-[48ch] text-sm leading-relaxed text-muted">
                {section.description}
              </p>
            )}
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-red/30 transition-transform duration-200 group-hover:scale-[1.03]">
              Ver el Kit
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {section.series.map((series) => (
          <SeriesCard
            key={series.id}
            series={series}
            className="w-[44vw] shrink-0 snap-start sm:w-[200px]"
          />
        ))}
      </div>
    </section>
  );
}
