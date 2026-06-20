"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/hero/1.png", position: "object-top" },
  { src: "/hero/2.png", position: "object-center" },
  { src: "/hero/3.png", position: "object-top" },
  { src: "/hero/4.png", position: "object-center" },
];

const INTERVAL_MS = 5000;

/**
 * Carrusel de fondo cinematográfico para el hero: las imágenes de marca rotan
 * con fundido cruzado + efecto Ken Burns (zoom lento), y un degradado navy
 * unifica todo para que el texto del hero se lea siempre.
 */
export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${slide.position} ${
              i === active ? "ken-burns" : ""
            }`}
          />
        </div>
      ))}

      {/* Degradados que unifican y dan legibilidad al texto del hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/35 sm:bg-gradient-to-r sm:from-background sm:via-background/70 sm:to-background/20" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

      {/* Indicadores de avance */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:left-6 sm:translate-x-0">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === active ? "w-7 bg-gold" : "w-2 bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
