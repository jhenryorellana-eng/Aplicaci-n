import type { Metadata } from "next";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { FeaturedHero } from "@/components/catalog/FeaturedHero";
import { GuidedPath } from "@/components/catalog/GuidedPath";
import { SectionRow } from "@/components/catalog/SectionRow";
import { ROUTES, SECTION_KIND } from "@/lib/constants";
import { getSectionsWithSeries } from "@/lib/data/catalog";

export const metadata: Metadata = { title: "Catálogo" };

export default async function CatalogPage() {
  const sections = await getSectionsWithSeries();
  const guided = sections.filter((s) => s.kind === SECTION_KIND.guidedPath);
  const topics = sections.filter((s) => s.kind === SECTION_KIND.topic);
  const featured = guided[0]?.series[0] ?? topics[0]?.series[0] ?? null;

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

      {featured && <FeaturedHero series={featured} />}

      {guided.map((section) => (
        <GuidedPath key={section.id} section={section} />
      ))}

      {topics.map((section) => (
        <SectionRow key={section.id} section={section} />
      ))}
    </main>
  );
}
