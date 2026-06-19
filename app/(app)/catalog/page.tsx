import type { Metadata } from "next";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { KitShowcase } from "@/components/catalog/KitShowcase";
import { SectionRow } from "@/components/catalog/SectionRow";
import { ACCESS_TYPE, ROUTES } from "@/lib/constants";
import { getSectionsWithSeries } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Catálogo" };

export default async function CatalogPage() {
  const sections = await getSectionsWithSeries();

  // El Kit (videos de pago) es el contenido real y prioritario.
  const kitSection =
    sections.find((s) =>
      s.series.some((se) => se.accessType === ACCESS_TYPE.purchase),
    ) ?? null;
  const otherSections = sections.filter((s) => s !== kitSection);

  return (
    <main className="space-y-9 pb-28 pt-5">
      <header className="flex items-center justify-between px-4">
        <Wordmark />
        <Link
          href={ROUTES.login}
          aria-label="Cuenta"
          className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          <UserRound className="size-5" aria-hidden />
        </Link>
      </header>

      {kitSection && <KitShowcase section={kitSection} />}

      {otherSections.length > 0 && (
        <div className="space-y-9">
          <div className="px-5">
            <h2 className="font-display text-lg font-bold text-muted">
              Próximamente
            </h2>
            <p className="mt-0.5 text-sm text-faint">
              Más contenido en camino. Te avisaremos cuando esté disponible.
            </p>
          </div>
          {otherSections.map((section) => (
            <SectionRow key={section.id} section={section} />
          ))}
        </div>
      )}
    </main>
  );
}
