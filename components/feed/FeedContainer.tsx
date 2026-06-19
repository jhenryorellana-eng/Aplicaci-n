"use client";

import { useEffect, useRef, useState } from "react";
import { FeedProgress } from "@/components/feed/FeedProgress";
import { FeedSlide } from "@/components/feed/FeedSlide";
import { FEED } from "@/lib/constants";
import { useFeedStore } from "@/lib/stores/feedStore";
import type { FeedClip } from "@/types/domain";

type Props = {
  clips: FeedClip[];
  likeCounts: Record<string, number>;
  likedClipIds: string[];
  commentCounts: Record<string, number>;
  savedSeriesIds: string[];
  isLoggedIn: boolean;
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FeedContainer({
  clips,
  likeCounts,
  likedClipIds,
  commentCounts,
  savedSeriesIds,
  isLoggedIn,
}: Props) {
  const activeIndex = useFeedStore((s) => s.activeIndex);
  const setActiveIndex = useFeedStore((s) => s.setActiveIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const likedSet = new Set(likedClipIds);
  const savedSet = new Set(savedSeriesIds);

  const baseCount = clips.length;
  // Lista que crece: arranca con el orden (ya barajado por el servidor).
  const [slides, setSlides] = useState<FeedClip[]>(clips);

  // El feed arranca siempre desde el primer slide.
  useEffect(() => {
    setActiveIndex(0);
  }, [setActiveIndex]);

  // Feed infinito: al acercarse al final agrega un lote re-barajado,
  // evitando que el mismo clip salga dos veces seguidas (en la unión).
  useEffect(() => {
    if (baseCount < 1 || activeIndex < slides.length - 3) return;
    setSlides((prev) => {
      const batch = shuffle(clips);
      const lastId = prev[prev.length - 1]?.id;
      if (batch.length > 1 && batch[0].id === lastId) {
        [batch[0], batch[1]] = [batch[1], batch[0]];
      }
      return [...prev, ...batch];
    });
  }, [activeIndex, slides.length, baseCount, clips]);

  // Detecta el slide visible y lo marca como activo. Se re-suscribe cuando
  // crece la lista para observar los nuevos slides.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const els = Array.from(
      root.querySelectorAll<HTMLElement>("[data-feed-slide]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= FEED.intersectionThreshold
          ) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.index ?? 0,
            );
            setActiveIndex(idx);
          }
        }
      },
      { root, threshold: [FEED.intersectionThreshold] },
    );

    els.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [setActiveIndex, slides.length]);

  // Pausa todo cuando la pestaña/app pasa a segundo plano (batería).
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === "hidden") {
        containerRef.current
          ?.querySelectorAll("video")
          .forEach((v) => v.pause());
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, []);

  return (
    <div className="relative h-[100dvh]">
      <FeedProgress
        count={baseCount}
        activeIndex={baseCount > 0 ? activeIndex % baseCount : 0}
      />
      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((clip, i) => {
          const inWindow =
            i >= activeIndex - FEED.preloadBehind &&
            i <= activeIndex + FEED.preloadAhead;
          return (
            <FeedSlide
              key={`${clip.id}-${i}`}
              clip={clip}
              index={i}
              active={i === activeIndex}
              inWindow={inWindow}
              likeCount={likeCounts[clip.id] ?? 0}
              initialLiked={likedSet.has(clip.id)}
              commentCount={commentCounts[clip.id] ?? 0}
              initialSaved={savedSet.has(clip.seriesId)}
              isLoggedIn={isLoggedIn}
            />
          );
        })}
      </div>
    </div>
  );
}
