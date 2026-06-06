import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { createClip, setClipPublished } from "@/lib/admin/actions";
import { adminListClips, adminListSeries } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Admin · Feed" };

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-gold";

export default async function AdminClipsPage() {
  const [clips, series] = await Promise.all([
    adminListClips(),
    adminListSeries(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Feed
        </h1>
        <p className="text-sm text-muted">
          Resúmenes verticales que aparecen en el scroll.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface/50 p-5">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Plus className="size-5 text-gold" aria-hidden />
          Nuevo resumen
        </h2>
        <form action={createClip} className="grid gap-3">
          <select name="seriesId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Serie que abre al tocar…
            </option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <input
            name="caption"
            placeholder="Texto del resumen"
            className={inputClass}
          />
          <MediaUpload
            name="videoUrl"
            folder="videos"
            accept="video/*"
            label="Subir video vertical (mp4)"
          />
          <MediaUpload
            name="posterUrl"
            folder="posters"
            accept="image/*"
            label="Subir portada (imagen, opcional)"
          />
          <button
            type="submit"
            className="justify-self-start rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95"
          >
            Añadir al feed
          </button>
        </form>
      </section>

      {clips.length === 0 ? (
        <p className="text-sm text-faint">Sin resúmenes todavía.</p>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border">
          {clips.map((clip) => (
            <li
              key={clip.id}
              className="flex items-center justify-between gap-3 bg-surface/40 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {clip.caption ?? "(sin texto)"}
                </p>
                <p className="text-xs text-faint">→ {clip.seriesTitle}</p>
              </div>
              <PublishToggle
                action={setClipPublished}
                id={clip.id}
                isPublished={clip.isPublished}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
