import Link from "next/link";
import { ChevronRight, Route } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { SectionWithSeries } from "@/types/domain";

type Props = {
  section: SectionWithSeries;
  progress: { done: number; total: number };
};

/** La Ruta del Éxito: pasos numerados, en orden, con barra de progreso. */
export function GuidedPath({ section, progress }: Props) {
  if (section.series.length === 0) return null;

  const pct =
    progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <section className="space-y-4">
      <header className="space-y-3 px-5">
        <div className="flex items-center gap-2 text-gold">
          <Route className="size-4" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-[0.22em]">
            Sigue la ruta
          </span>
        </div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">
          {section.title}
        </h2>
        {section.description && (
          <p className="max-w-[52ch] text-sm leading-relaxed text-muted">
            {section.description}
          </p>
        )}

        {progress.total > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold text-muted">Tu progreso</span>
              <span className="font-display font-extrabold text-gold">
                {pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-deep transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-faint">
              {progress.done} de {progress.total} lecciones completadas
            </p>
          </div>
        )}
      </header>

      <ol className="space-y-2.5 px-5">
        {section.series.map((series, i) => (
          <li key={series.id}>
            <Link
              href={ROUTES.series(series.slug)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-gold/50"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold font-display text-base font-extrabold text-background">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">
                  {series.title}
                </p>
                {series.description && (
                  <p className="truncate text-xs text-muted">
                    {series.description}
                  </p>
                )}
              </div>
              <ChevronRight
                className="size-5 shrink-0 text-gold"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
