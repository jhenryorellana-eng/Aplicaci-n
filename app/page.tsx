import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden px-6 pb-10 pt-8">
      {/* Foto de Henry: a la derecha en escritorio, de fondo (póster) en móvil.
          Se funde con el navy mediante degradados para integrarse al diseño. */}
      <div className="pointer-events-none absolute inset-0 z-0 sm:left-auto sm:right-0 sm:w-[56%]">
        <Image
          src="/henry-hero.png"
          alt={`Henry — ${APP_NAME}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 56vw"
          className="object-cover object-top"
        />
        {/* Fundido principal: vertical en móvil, horizontal en escritorio */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent sm:bg-gradient-to-r sm:from-background sm:via-background/55 sm:to-transparent" />
        {/* Velo superior (para que se lea la marca en móvil) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent sm:hidden" />
        {/* Funde el borde inferior en escritorio */}
        <div className="absolute inset-0 hidden sm:block sm:bg-gradient-to-t sm:from-background sm:via-transparent sm:to-transparent" />
      </div>

      {/* Marca */}
      <header
        className="reveal relative z-10 flex items-center gap-2.5"
        style={{ animationDelay: "0ms" }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px_4px_rgba(244,183,64,0.55)]" />
        <span className="font-display text-lg font-extrabold tracking-tight">
          {APP_NAME}
        </span>
      </header>

      {/* Héroe */}
      <section className="relative z-10 flex flex-1 flex-col justify-end sm:justify-center">
        <div className="sm:max-w-[54%]">
          <p
            className="reveal mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gold"
            style={{ animationDelay: "80ms" }}
          >
            El método, paso a paso
          </p>

          <h1
            className="reveal max-w-[14ch] font-display text-[clamp(2.5rem,10vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]"
            style={{ animationDelay: "160ms" }}
          >
            Tu camino al{" "}
            <span className="bg-gradient-to-br from-gold to-gold-deep bg-clip-text text-transparent">
              éxito
            </span>{" "}
            en Estados Unidos.
          </h1>

          <p
            className="reveal mt-6 max-w-[42ch] text-balance text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            Videos cortos que enganchan y series completas que te enseñan a hacer
            las cosas bien: licencia, crédito, impuestos, tu propio negocio y más.
          </p>

          <div
            className="reveal mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "320ms" }}
          >
            <Link
              href={ROUTES.feed}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-bold text-background transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              <Play className="size-5 fill-background" />
              Ver el feed
            </Link>
            <Link
              href={ROUTES.catalog}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-base font-semibold text-foreground backdrop-blur transition-colors duration-200 hover:border-gold/60 hover:text-gold"
            >
              Explorar el catálogo
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="reveal relative z-10 text-sm text-faint"
        style={{ animationDelay: "420ms" }}
      >
        Contenido informativo y educativo. No constituye asesoría legal.
      </footer>
    </main>
  );
}
