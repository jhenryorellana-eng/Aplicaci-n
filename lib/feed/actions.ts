"use server";

import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AddCommentResult } from "@/lib/feed/types";

export async function addComment(
  clipId: string,
  body: string,
): Promise<AddCommentResult> {
  const user = await getSessionUser();
  if (!user || user.isDemo) return { ok: false, error: "auth" };

  const text = body.trim();
  if (!text) return { ok: false, error: "empty" };
  if (text.length > 500) return { ok: false, error: "long" };

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const authorName =
    profile?.display_name ||
    (user.email ? user.email.split("@")[0] : "Usuario");

  const { data, error } = await supabase
    .from("feed_comments")
    .insert({
      clip_id: clipId,
      user_id: user.id,
      author_name: authorName,
      body: text,
    })
    .select("id, author_name, body, created_at")
    .single();

  if (error || !data) return { ok: false, error: "db" };

  return {
    ok: true,
    comment: {
      id: data.id,
      authorName: data.author_name,
      body: data.body,
      createdAt: data.created_at,
    },
  };
}
