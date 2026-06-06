"use client";

import Hls from "hls.js";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type Props = {
  /** URL del manifiesto HLS. Si es null, no se carga nada (solo poster). */
  src: string | null;
  poster?: string | null;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  /**
   * Si se pasa, controla la reproducción: true → play, false → pause.
   * Si se omite, el video se comporta de forma nativa (autoPlay/controls).
   */
  playing?: boolean;
  autoPlay?: boolean;
  /** Limita el buffer (segundos). Útil en el feed para no quemar datos. */
  maxBufferLength?: number;
  className?: string;
  onEnded?: () => void;
};

export type HlsVideoHandle = {
  el: () => HTMLVideoElement | null;
};

/** Reproductor HLS: usa HLS nativo (Safari/iOS) o hls.js en el resto. */
export const HlsVideo = forwardRef<HlsVideoHandle, Props>(function HlsVideo(
  {
    src,
    poster,
    muted = false,
    loop = false,
    controls = false,
    playing,
    autoPlay = false,
    maxBufferLength,
    className = "",
    onEnded,
  },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(ref, () => ({ el: () => videoRef.current }), []);

  // Cargar / cambiar la fuente (HLS .m3u8 o archivo directo .mp4/.webm).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const isHls = /\.m3u8(\?|$)/i.test(src);
    const canPlayNativeHls = video.canPlayType(
      "application/vnd.apple.mpegurl",
    );

    // Archivo directo o HLS nativo (Safari/iOS): asignar src directamente.
    if (!isHls || canPlayNativeHls) {
      video.src = src;
      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    // HLS en el resto de navegadores: hls.js.
    if (Hls.isSupported()) {
      const hls = new Hls({
        ...(maxBufferLength ? { maxBufferLength } : {}),
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
  }, [src, maxBufferLength]);

  // Control externo de play/pausa.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || playing === undefined) return;

    if (playing) {
      const p = video.play();
      if (p) p.catch(() => {});
    } else {
      video.pause();
    }
  }, [playing, src]);

  // iOS: al volver desde el caché de páginas (bfcache), reanuda el video
  // que debería estar reproduciéndose (suele quedar "pegado").
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      const video = videoRef.current;
      if (!video || !event.persisted || !playing) return;
      const p = video.play();
      if (p) p.catch(() => {});
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [playing]);

  return (
    <video
      ref={videoRef}
      poster={poster ?? undefined}
      muted={muted}
      loop={loop}
      controls={controls}
      autoPlay={autoPlay}
      playsInline
      preload="metadata"
      onEnded={onEnded}
      className={className}
    />
  );
});
