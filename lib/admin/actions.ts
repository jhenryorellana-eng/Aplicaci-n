"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth/session";
import { EPISODE_STATUS, ROLE, ROUTES, TIER } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { slugify } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== ROLE.admin) {
    throw new Error("No autorizado");
  }
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const orNull = (value: string) => (value.length > 0 ? value : null);

function revalidateContent() {
  revalidatePath(ROUTES.admin);
  revalidatePath(ROUTES.catalog);
  revalidatePath(ROUTES.feed);
}

export async function createSeries(formData: FormData) {
  await ensureAdmin();
  if (!isSupabaseConfigured()) return;

  const title = str(formData, "title");
  const sectionId = str(formData, "sectionId");
  if (!title || !sectionId) return;

  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("series")
    .select("id", { count: "exact", head: true })
    .eq("section_id", sectionId);

  await supabase.from("series").insert({
    section_id: sectionId,
    slug: slugify(title),
    title,
    description: orNull(str(formData, "description")),
    cover_url: orNull(str(formData, "coverUrl")),
    required_tier:
      str(formData, "requiredTier") === TIER.premium ? TIER.premium : TIER.free,
    position: (count ?? 0) + 1,
    is_published: false,
  });

  revalidateContent();
}

export async function setSeriesPublished(formData: FormData) {
  await ensureAdmin();
  if (!isSupabaseConfigured()) return;
  const id = str(formData, "id");
  const publish = str(formData, "publish") === "true";
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("series").update({ is_published: publish }).eq("id", id);
  revalidateContent();
}

export async function createEpisode(formData: FormData) {
  await ensureAdmin();
  if (!isSupabaseConfigured()) return;

  const seriesId = str(formData, "seriesId");
  const title = str(formData, "title");
  if (!seriesId || !title) return;

  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("episodes")
    .select("id", { count: "exact", head: true })
    .eq("series_id", seriesId);

  const videoUrl = orNull(str(formData, "videoUrl"));
  await supabase.from("episodes").insert({
    series_id: seriesId,
    title,
    description: orNull(str(formData, "description")),
    video_url: videoUrl,
    thumbnail_url: orNull(str(formData, "thumbnailUrl")),
    mux_asset_id: orNull(str(formData, "muxAssetId")),
    status: videoUrl ? EPISODE_STATUS.ready : EPISODE_STATUS.processing,
    position: (count ?? 0) + 1,
    is_published: false,
  });

  revalidatePath(`${ROUTES.admin}/series/${seriesId}`);
  revalidateContent();
}

export async function setEpisodePublished(formData: FormData) {
  await ensureAdmin();
  if (!isSupabaseConfigured()) return;
  const id = str(formData, "id");
  const seriesId = str(formData, "seriesId");
  const publish = str(formData, "publish") === "true";
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("episodes").update({ is_published: publish }).eq("id", id);
  revalidatePath(`${ROUTES.admin}/series/${seriesId}`);
  revalidateContent();
}

export async function createClip(formData: FormData) {
  await ensureAdmin();
  if (!isSupabaseConfigured()) return;

  const seriesId = str(formData, "seriesId");
  if (!seriesId) return;

  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("feed_clips")
    .select("id", { count: "exact", head: true });

  const videoUrl = orNull(str(formData, "videoUrl"));
  await supabase.from("feed_clips").insert({
    series_id: seriesId,
    caption: orNull(str(formData, "caption")),
    video_url: videoUrl,
    poster_url: orNull(str(formData, "posterUrl")),
    status: videoUrl ? EPISODE_STATUS.ready : EPISODE_STATUS.processing,
    position: (count ?? 0) + 1,
    is_published: false,
  });

  revalidatePath(`${ROUTES.admin}/clips`);
  revalidateContent();
}

export async function setClipPublished(formData: FormData) {
  await ensureAdmin();
  if (!isSupabaseConfigured()) return;
  const id = str(formData, "id");
  const publish = str(formData, "publish") === "true";
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("feed_clips")
    .update({ is_published: publish })
    .eq("id", id);
  revalidatePath(`${ROUTES.admin}/clips`);
  revalidateContent();
}
