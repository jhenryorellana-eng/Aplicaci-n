"use client";

import Link from "next/link";
import { ChevronRight, ChevronUp, Pause, Volume2, VolumeX } from "lucide-react";
import { CommentButton } from "@/components/feed/CommentButton";
import { LikeButton } from "@/components/feed/LikeButton";
import { SaveButton } from "@/components/feed/SaveButton";
import { ShareButton } from "@/components/feed/ShareButton";
import { HlsVideo } from "@/components/player/HlsVideo";
import { Wordmark } from "@/components/brand/Wordmark";
import { FEED, ROUTES } from "@/lib/constants";
import { muxPublicHlsUrl } from "@/lib/mux/playback";
import { useFeedStore } from "@/lib/stores/feedStore";
import type { FeedClip } from "@/types/domain";

type Props = {
  clip: FeedClip;
  index: number;
  active: boolean;
  /** Si está dentro de la ventana de precarga, se carga el video. */
  inWindow: boolean;
  likeCount: number;
  initialLiked: boolean;
  commentCount: number;
  initialSaved: boolean;
  isLoggedIn: boolean;
};

function resolveSrc(clip: FeedClip): string | null {
  if (clip.demoPlaybackUrl) return clip.demoPlaybackUrl;
  if (clip.videoUrl) return clip.videoUrl;
  if (clip.playbackId) return muxPublicHlsUrl(clip.playbackId);
  return null;
}

export function FeedSlide({
  clip,
  index,
  active,
  inWindow,
  likeCount,
  initialLiked,
  commentCount,
  initialSaved,
  isLoggedIn,
}: Props) {
  const muted = useFeedStore((s) => s.muted);
  const toggleMuted = useFeedStore((s) => s.toggleMuted);
  const setMuted = useFeedStore((s) => s.setMuted);

  const src = inWindow ? resolveSrc(clip) : null;

  return (
    <section
      data-feed-slide
      data-index={index}
      className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black"
    >
      <HlsVideo
        src={src}
        poster={clip.posterUrl}
        muted={muted}
        loop
        playing={active}
        maxBufferLength={FEED.feedMaxBufferSeconds}
        onAutoplayBlocked={() => setMuted(true)}
        className="absolute inset-0 size-full object-cover"
      />

      {/* Marca + categoría (arriba-izquierda) */}
      <div
        className="absolute left-4 z-20 flex flex-col items-start gap-2"
        style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <div className="flex items-center rounded-full bg-black/35 px-3 py-1.5 backdrop-blur">
          <Wordmark className="h-5" />
        </div>
        {clip.sectionTitle && (
          <span className="rounded-full bg-gold/90 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-background">
            {clip.sectionTitle}
          </span>
        )}
      </div>

      {/* Botón de silencio */}
      <button
        type="button"
        onClick={toggleMuted}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        className="absolute right-4 z-20 grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur transition-colors hover:bg-black/60"
        style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        {muted ? (
          <VolumeX className="size-5" aria-hidden />
        ) : (
          <Volume2 className="size-5" aria-hidden />
        )}
      </button>

      {!active && (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-black/35 backdrop-blur">
            <Pause className="size-7 fill-white text-white" aria-hidden />
          </span>
        </div>
      )}

      {/* Barra de acciones (me gusta · comentarios · guardar · compartir) */}
      <div className="absolute bottom-44 right-3 z-20 flex flex-col items-center gap-4">
        <LikeButton
          clipId={clip.id}
          initialLiked={initialLiked}
          initialCount={likeCount}
          isLoggedIn={isLoggedIn}
        />
        <CommentButton
          clipId={clip.id}
          count={commentCount}
          isLoggedIn={isLoggedIn}
        />
        <SaveButton
          seriesId={clip.seriesId}
          initialSaved={initialSaved}
          isLoggedIn={isLoggedIn}
        />
        <ShareButton
          title={clip.seriesTitle}
          path={ROUTES.series(clip.seriesSlug)}
        />
      </div>

      {/* Pista de scroll en el primer slide */}
      {index === 0 && active && (
        <div className="pointer-events-none absolute inset-x-0 bottom-48 z-10 flex flex-col items-center gap-1 text-white/75">
          <ChevronUp className="size-6 animate-bounce" aria-hidden />
          <span className="text-xs font-semibold tracking-wide">Desliza</span>
        </div>
      )}

      {/* Información + CTA a la serie */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-5 pb-28 pt-20">
        {clip.caption && (
          <p className="mb-3 max-w-[30ch] text-base font-semibold leading-snug text-white">
            {clip.caption}
          </p>
        )}
        <Link
          href={ROUTES.series(clip.seriesSlug)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold/95 px-4 py-2 text-sm font-bold text-background transition-transform duration-200 active:scale-95"
        >
          Ver la serie: {clip.seriesTitle}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
