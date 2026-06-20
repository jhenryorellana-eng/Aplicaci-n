import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { Wordmark } from "@/components/brand/Wordmark";
import { EnterFeedButton } from "@/components/feed/EnterFeedButton";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden px-6 pt-7">
      <HeroCarousel />

      {/* Marca */}
      <header
        className="reveal relative z-10"
        style={{ animationDelay: "0ms" }}
      >
        <Wordmark className="h-9" />
      </header>

      {/* Contenido del héroe */}
      <section className="relative z-10 flex flex-1 flex-col justify-end pb-12 sm:justify-center sm:pb-10">
        <div className="sm:max-w-[58%]">
          <p
            className="reveal mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-gold"
            style={{ animationDelay: "120ms" }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            Henry Orellana · Fundador
          </p>

          <h1
            className="reveal font-display text-[clamp(2.3rem,8.5vw,4.4rem)] font-extrabold leading-[0.99] tracking-[-0.02em]"
            style={{ animationDelay: "220ms" }}
          >
            Quien ya vivió el proceso, hoy te{" "}
            <span className="bg-gradient-to-br from-gold to-gold-deep bg-clip-text text-transparent">
              guía
            </span>
            .
          </h1>

          <p
            className="reveal mt-5 max-w-[46ch] text-balance text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: "320ms" }}
          >
            Henry vivió cada etapa en carne propia. Hoy deja toda su experiencia
            aquí: qué hacer, qué evitar y cómo avanzar con más{" "}
            <span className="font-semibold text-foreground">
              probabilidad de éxito
            </span>
            .
          </p>

          <div
            className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "420ms" }}
          >
            <EnterFeedButton className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-base font-bold text-background shadow-lg shadow-gold/25 transition-transform duration-200 hover:scale-[1.03] active:scale-95">
              <Play className="size-5 fill-background" aria-hidden />
              Ver videos gratis
            </EnterFeedButton>
            <Link
              href={ROUTES.catalog}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-4 text-base font-semibold text-foreground backdrop-blur transition-colors duration-200 hover:border-gold/60 hover:text-gold"
            >
              Ver los temas
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <p
            className="reveal mt-4 text-xs text-faint"
            style={{ animationDelay: "520ms" }}
          >
            Gratis para empezar · Sin tarjeta · En español
          </p>
        </div>
      </section>
    </main>
  );
}
