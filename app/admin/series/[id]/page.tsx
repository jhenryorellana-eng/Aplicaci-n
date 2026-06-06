import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { createEpisode, setEpisodePublished } from "@/lib/admin/actions";
import { adminGetSeries } from "@/lib/admin/data";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Admin · Episodios" };

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-gold";

type Params = { params: Promise<{ id: string }> };

export default async function AdminSeriesEpisodesPage({ params }: Params) {
  const { id } = await params;
  const data = await adminGetSeries(id);
  if (!data) notFound();

  const { series, episodes } = data;

  return (
    <div className="space-y-8">
      <Link
        href={ROUTES.admin}
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Series
      </Link>

      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          {series.title}
        </h1>
        <p className="text-sm text-muted">Episodios de la serie</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Plus className="size-5 text-gold" aria-hidden />
          Nuevo episodio
        </h2>
        <form action={createEpisode} className="grid gap-3">
          <input type="hidden" name="seriesId" value={series.id} />
          <input name="title" required placeholder="Título" className={inputClass} />
          <MediaUpload
            name="videoUrl"
            folder="videos"
            accept="video/*"
            label="Subir video (mp4)"
          />
          <MediaUpload
            name="thumbnailUrl"
            folder="posters"
            accept="image/*"
            label="Subir portada (imagen, opcional)"
          />
          <p className="text-xs text-faint">
            Sube tu video directamente. Se guarda en Supabase Storage y queda
            listo para publicar.
          </p>
          <button
            type="submit"
            className="justify-self-start rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95"
          >
            Añadir episodio
          </button>
        </form>
      </section>

      {episodes.length === 0 ? (
        <p className="text-sm text-faint">Sin episodios todavía.</p>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border">
          {episodes.map((ep) => (
            <li
              key={ep.id}
              className="flex items-center justify-between gap-3 bg-surface/40 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  <span className="mr-2 text-faint">{ep.position}</span>
                  {ep.title}
                </p>
                <p className="text-xs text-faint">Estado: {ep.status}</p>
              </div>
              <PublishToggle
                action={setEpisodePublished}
                id={ep.id}
                isPublished={ep.isPublished}
                extra={[{ name: "seriesId", value: series.id }]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
