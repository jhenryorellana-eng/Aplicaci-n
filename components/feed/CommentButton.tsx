"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Send, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatCount } from "@/lib/format";
import { addComment } from "@/lib/feed/actions";
import type { FeedCommentItem } from "@/lib/feed/types";
import { toast } from "@/lib/stores/toastStore";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function CommentsSheet({
  clipId,
  isLoggedIn,
  onClose,
  onAdded,
}: {
  clipId: string;
  isLoggedIn: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [comments, setComments] = useState<FeedCommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("feed_comments")
        .select("id, author_name, body, created_at")
        .eq("clip_id", clipId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (!cancelled) {
        setComments(
          (data ?? []).map((c) => ({
            id: c.id,
            authorName: c.author_name,
            body: c.body,
            createdAt: c.created_at,
          })),
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clipId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      window.location.href = `${ROUTES.login}?next=${encodeURIComponent(ROUTES.feed)}`;
      return;
    }
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    const res = await addComment(clipId, body);
    setSending(false);
    if (!res.ok || !res.comment) {
      toast.error("No se pudo publicar el comentario.");
      return;
    }
    setComments((c) => [res.comment as FeedCommentItem, ...c]);
    setText("");
    onAdded();
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end">
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Cerrar comentarios"
      />
      <div className="relative z-10 flex max-h-[78dvh] flex-col rounded-t-3xl border-t border-border bg-surface">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-bold">Comentarios</h2>
          <button onClick={onClose} aria-label="Cerrar">
            <X className="size-6 text-muted" aria-hidden />
          </button>
        </header>

        <div className="min-h-[30dvh] flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-sm text-muted">Cargando…</p>
          ) : comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Sé el primero en comentar.
            </p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="space-y-0.5">
                <p className="text-sm font-bold text-gold">{c.authorName}</p>
                <p className="text-sm leading-relaxed text-foreground">
                  {c.body}
                </p>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-t border-border p-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder={
              isLoggedIn ? "Escribe un comentario…" : "Inicia sesión para comentar"
            }
            className="flex-1 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-sm outline-none focus:border-gold"
          />
          <button
            type="submit"
            disabled={sending}
            aria-label="Enviar comentario"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-gold text-background transition-transform active:scale-95 disabled:opacity-60"
          >
            <Send className="size-5" aria-hidden />
          </button>
        </form>
      </div>
    </div>
  );
}

type Props = {
  clipId: string;
  count: number;
  isLoggedIn: boolean;
};

export function CommentButton({ clipId, count, isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(count);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Comentarios"
        className="flex flex-col items-center gap-1"
      >
        <span className="grid size-12 place-items-center rounded-full bg-black/40 backdrop-blur">
          <MessageCircle className="size-7 text-white" aria-hidden />
        </span>
        <span className="text-xs font-bold text-white drop-shadow">
          {formatCount(total)}
        </span>
      </button>
      {open &&
        createPortal(
          <CommentsSheet
            clipId={clipId}
            isLoggedIn={isLoggedIn}
            onClose={() => setOpen(false)}
            onAdded={() => setTotal((t) => t + 1)}
          />,
          document.body,
        )}
    </>
  );
}
