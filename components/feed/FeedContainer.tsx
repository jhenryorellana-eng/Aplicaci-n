"use client";

import { useEffect, useRef } from "react";
import { FeedProgress } from "@/components/feed/FeedProgress";
import { FeedSlide } from "@/components/feed/FeedSlide";
import { FEED } from "@/lib/constants";
import { useFeedStore } from "@/lib/stores/feedStore";
import type { FeedClip } from "@/types/domain";

export function FeedContainer({ clips }: { clips: FeedClip[] }) {
  const activeIndex = useFeedStore((s) => s.activeIndex);
  const setActiveIndex = useFeedStore((s) => s.setActiveIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detecta el slide visible y lo marca como activo.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const slides = Array.from(
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

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [setActiveIndex, clips.length]);

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
      <FeedProgress count={clips.length} activeIndex={activeIndex} />
      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {clips.map((clip, i) => {
          const inWindow =
            i >= activeIndex - FEED.preloadBehind &&
            i <= activeIndex + FEED.preloadAhead;
          return (
            <FeedSlide
              key={clip.id}
              clip={clip}
              index={i}
              active={i === activeIndex}
              inWindow={inWindow}
            />
          );
        })}
      </div>
    </div>
  );
}
