import { SeriesCard } from "@/components/catalog/SeriesCard";
import type { SectionWithSeries } from "@/types/domain";

type Props = {
  section: SectionWithSeries;
};

/** Fila horizontal de series (estilo Netflix) para secciones de temas. */
export function SectionRow({ section }: Props) {
  if (section.series.length === 0) return null;

  return (
    <section className="space-y-3">
      <header className="px-5">
        <h2 className="font-display text-xl font-extrabold tracking-tight">
          {section.title}
        </h2>
        {section.description && (
          <p className="mt-0.5 text-sm text-muted">{section.description}</p>
        )}
      </header>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
