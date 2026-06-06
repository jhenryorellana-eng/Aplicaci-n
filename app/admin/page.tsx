import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { createSeries, setSeriesPublished } from "@/lib/admin/actions";
import { adminListSections, adminListSeries } from "@/lib/admin/data";
import { ROUTES, TIER } from "@/lib/constants";

export const metadata: Metadata = { title: "Admin · Series" };

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-gold";

export default async function AdminSeriesPage() {
  const [sections, series] = await Promise.all([
    adminListSections(),
    adminListSeries(),
  ]);

  return (
    <div className="space-y-10">
      {/* Nueva serie */}
      <section className="rounded-2xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Plus className="size-5 text-gold" aria-hidden />
          Nueva serie
        </h2>
        <form action={createSeries} className="grid gap-3 sm:grid-cols-2">
          <input name="title" required placeholder="Título" className={inputClass} />
          <select name="sectionId" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Sección…
            </option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <input
            name="coverUrl"
            placeholder="URL de portada (opcional)"
            className={inputClass}
          />
          <select name="requiredTier" className={inputClass} defaultValue={TIER.free}>
            <option value={TIER.free}>Gratis</option>
            <option value={TIER.premium}>Premium</option>
          </select>
          <textarea
            name="description"
            placeholder="Descripción (opcional)"
            rows={2}
            className={`${inputClass} sm:col-span-2`}
          />
          <button
            type="submit"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 sm:col-span-2 sm:justify-self-start"
          >
            Crear serie
          </button>
        </form>
      </section>

      {/* Listado por sección */}
      {sections.map((section) => {
        const items = series.filter((s) => s.sectionId === section.id);
        return (
          <section key={section.id} className="space-y-2">
            <h3 className="font-display text-base font-bold text-muted">
              {section.title}
            </h3>
            {items.length === 0 ? (
              <p className="text-sm text-faint">Sin series todavía.</p>
            ) : (
              <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border">
                {items.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 bg-surface/40 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{s.title}</p>
                      <p className="text-xs text-faint">
                        {s.requiredTier === TIER.premium ? "Premium" : "Gratis"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <PublishToggle
                        action={setSeriesPublished}
                        id={s.id}
                        isPublished={s.isPublished}
                      />
                      <Link
                        href={`${ROUTES.admin}/series/${s.id}`}
                        className="flex items-center gap-1 text-sm font-semibold text-gold"
                      >
                        Episodios
                        <ChevronRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
