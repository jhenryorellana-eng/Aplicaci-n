import { Route } from "lucide-react";
import { SeriesCard } from "@/components/catalog/SeriesCard";
import type { SectionWithSeries } from "@/types/domain";

type Props = {
  section: SectionWithSeries;
};

/** La ruta guiada: el método de Henry, en orden, con pasos numerados. */
export function GuidedPath({ section }: Props) {
  if (section.series.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="px-5">
        <div className="flex items-center gap-2 text-gold">
          <Route className="size-4" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-[0.22em]">
            Sigue la ruta
          </span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-muted">
            {section.description}
          </p>
        )}
      </header>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {section.series.map((series, i) => (
          <SeriesCard
            key={series.id}
            series={series}
            step={i + 1}
            className="w-[58vw] shrink-0 snap-start sm:w-[240px]"
          />
        ))}
      </div>
    </section>
  );
}
