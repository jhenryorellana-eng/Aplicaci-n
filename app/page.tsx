import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Languages,
  Play,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { EnterFeedButton } from "@/components/feed/EnterFeedButton";
import { APP_NAME, ROUTES } from "@/lib/constants";

const TRUST = [
  { icon: Languages, label: "100% en español" },
  { icon: ScrollText, label: "Basado en audiencias reales" },
  { icon: ShieldCheck, label: "Respaldo de USA Latino Prime" },
];

const BENEFITS = [
  {
    icon: ScrollText,
    title: "Entiende tu audiencia",
    text: "Qué pasa en cada etapa: audiencia preliminar, reprogramada y de mérito. Sin sorpresas.",
  },
  {
    icon: BadgeCheck,
    title: "Responde con seguridad",
    text: "Qué te preguntará el juez y cómo contestar con claridad, sin miedo y sin contradecirte.",
  },
  {
    icon: ShieldCheck,
    title: "Nunca estás solo",
    text: "Y si tu caso necesita más fuerza, el equipo de USA Latino Prime te acompaña paso a paso.",
  },
];

export default function HomePage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-x-hidden pb-24">
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[100dvh] flex-col px-6 pt-7">
        {/* Foto de Henry: fondo póster en móvil, lado derecho en escritorio */}
        <div className="pointer-events-none absolute inset-0 z-0 sm:left-auto sm:right-0 sm:w-[58%]">
          <Image
            src="/henry-hero.png"
            alt={`Henry — ${APP_NAME}`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 58vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30 sm:bg-gradient-to-r sm:from-background sm:via-background/60 sm:to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent sm:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Marca */}
        <header
          className="reveal relative z-10 flex items-center gap-2.5"
          style={{ animationDelay: "0ms" }}
        >
          <span className="grid size-7 place-items-center rounded-md bg-navy">
            <svg viewBox="0 0 40 40" className="size-4" aria-hidden>
              <rect x="4" y="22" width="9" height="14" rx="2.5" fill="#e9ae4e" />
              <rect x="15.5" y="13" width="9" height="23" rx="2.5" fill="#f2bc5a" />
              <rect x="27" y="5" width="9" height="31" rx="2.5" fill="#ffd98a" />
            </svg>
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            {APP_NAME}
          </span>
        </header>

        {/* Contenido del héroe */}
        <div className="relative z-10 flex flex-1 flex-col justify-end pb-8 sm:justify-center sm:pb-0">
          <div className="sm:max-w-[56%]">
            <p
              className="reveal mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-gold"
              style={{ animationDelay: "80ms" }}
            >
              <Sparkles className="size-3.5" aria-hidden />
              Preparación para tu asilo
            </p>

            <h1
              className="reveal font-display text-[clamp(2.4rem,9vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em]"
              style={{ animationDelay: "160ms" }}
            >
              Llega{" "}
              <span className="bg-gradient-to-br from-gold to-gold-deep bg-clip-text text-transparent">
                preparado
              </span>{" "}
              a tu audiencia.
            </h1>

            <p
              className="reveal mt-5 max-w-[40ch] text-balance text-base leading-relaxed text-muted sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              Henry te explica, paso a paso y en español, qué esperar y cómo
              responder ante el juez. Empieza viendo videos{" "}
              <span className="font-semibold text-foreground">gratis</span>.
            </p>

            <div
              className="reveal mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "320ms" }}
            >
              <EnterFeedButton className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-base font-bold text-background shadow-lg shadow-gold/25 transition-transform duration-200 hover:scale-[1.03] active:scale-95">
                <Play className="size-5 fill-background" aria-hidden />
                Ver videos gratis
              </EnterFeedButton>
              <Link
                href={ROUTES.catalog}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-4 text-base font-semibold text-foreground backdrop-blur transition-colors duration-200 hover:border-gold/60 hover:text-gold"
              >
                Conocer el kit
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <p
              className="reveal mt-4 text-xs text-faint"
              style={{ animationDelay: "400ms" }}
            >
              Gratis para empezar · Sin tarjeta · En español
            </p>
          </div>
        </div>
      </section>

      {/* ============ FRANJA DE CONFIANZA ============ */}
      <section className="reveal border-y border-border/60 bg-surface/40 px-6 py-5">
        <ul className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {TRUST.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 text-sm font-semibold text-foreground/85"
            >
              <Icon className="size-4 shrink-0 text-gold" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* ============ QUÉ VAS A LOGRAR ============ */}
      <section className="px-6 pt-14">
        <div className="reveal mx-auto max-w-xl text-center">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-gold">
            Por qué esta plataforma
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.7rem,6vw,2.4rem)] font-extrabold leading-tight tracking-tight">
            Tu audiencia decide tu futuro. No la enfrentes a ciegas.
          </h2>
        </div>

        <div className="mx-auto mt-9 grid max-w-xl gap-4 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="reveal rounded-3xl border border-border bg-surface/50 p-5"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="grid size-11 place-items-center rounded-xl bg-gold/12 text-gold ring-1 ring-inset ring-gold/20">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-base font-bold leading-snug">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ EL KIT (PRODUCTO) ============ */}
      <section className="px-6 pt-14">
        <div className="reveal relative mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-gold/35 bg-gradient-to-b from-surface to-navy/40 p-7">
          <div
            className="pointer-events-none absolute -right-12 -top-14 size-48 rounded-full bg-gold/15 blur-3xl"
            aria-hidden
          />
          <div className="relative space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-background">
              <ShieldCheck className="size-3.5" aria-hidden />
              Kit de preparación
            </span>
            <h2 className="font-display text-[clamp(1.6rem,5.5vw,2.2rem)] font-extrabold leading-tight tracking-tight">
              Todo lo que necesitas para tu audiencia, en un solo lugar.
            </h2>
            <ul className="space-y-2.5">
              {[
                "Audiencia Preliminar",
                "Audiencia Preliminar Reprogramada",
                "Audiencia de Mérito",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                >
                  <BadgeCheck className="size-4 shrink-0 text-gold" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-muted">
              Llévate cada video por{" "}
              <span className="font-bold text-foreground">$8</span> — o el{" "}
              <span className="font-bold text-gold">kit completo por $17</span> y
              ahorra. Acceso de por vida.
            </p>
            <Link
              href={ROUTES.catalog}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              Ver el kit completo
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="reveal px-6 pt-14 text-center">
        <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(1.8rem,6vw,2.6rem)] font-extrabold leading-tight tracking-tight">
          Tu mejor preparación empieza hoy.
        </h2>
        <p className="mx-auto mt-3 max-w-[38ch] text-sm leading-relaxed text-muted">
          Mira los primeros videos gratis. Sin compromiso.
        </p>
        <EnterFeedButton className="group mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-background shadow-lg shadow-gold/25 transition-transform duration-200 hover:scale-[1.03] active:scale-95">
          <Play className="size-5 fill-background" aria-hidden />
          Empezar gratis ahora
        </EnterFeedButton>
        <p className="mx-auto mt-10 max-w-[44ch] text-xs leading-relaxed text-faint">
          Contenido informativo y educativo. No constituye asesoría legal. Cada
          caso es distinto.
        </p>
      </section>
    </main>
  );
}
