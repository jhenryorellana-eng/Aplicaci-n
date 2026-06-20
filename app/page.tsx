import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Car,
  Compass,
  CreditCard,
  FileText,
  HeartHandshake,
  Landmark,
  ListChecks,
  Languages,
  Play,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { EnterFeedButton } from "@/components/feed/EnterFeedButton";
import { APP_NAME, ROUTES } from "@/lib/constants";

const TRUST = [
  { icon: Languages, label: "100% en español" },
  { icon: ListChecks, label: "Paso a paso" },
  { icon: ShieldCheck, label: "Respaldo de USA Latino Prime" },
];

// La propuesta total: todo lo que el inmigrante necesita hacer bien en EE.UU.
const TOPICS = [
  { icon: Compass, label: "Tus primeros 30 días" },
  { icon: FileText, label: "Documentos y estatus" },
  { icon: Car, label: "Licencia de conducir" },
  { icon: CreditCard, label: "Crédito desde cero" },
  { icon: Landmark, label: "Impuestos básicos" },
  { icon: Briefcase, label: "Tu propio negocio (LLC)" },
  { icon: Scale, label: "Preparación de asilo" },
];

const WHY = [
  {
    icon: Languages,
    title: "En español, sin enredos",
    text: "Explicado claro y sencillo, para que de verdad entiendas qué hacer.",
  },
  {
    icon: ListChecks,
    title: "El método, paso a paso",
    text: "En orden, desde que llegas: qué hacer primero y qué evitar.",
  },
  {
    icon: HeartHandshake,
    title: "Nunca solo",
    text: "Hazlo tú mismo con guía, y el respaldo de USA Latino Prime cuando lo necesites.",
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
              Tu guía en Estados Unidos
            </p>

            <h1
              className="reveal font-display text-[clamp(2.3rem,8.5vw,4.4rem)] font-extrabold leading-[0.99] tracking-[-0.02em]"
              style={{ animationDelay: "160ms" }}
            >
              Haz las cosas{" "}
              <span className="bg-gradient-to-br from-gold to-gold-deep bg-clip-text text-transparent">
                bien
              </span>{" "}
              en Estados Unidos.
            </h1>

            <p
              className="reveal mt-5 max-w-[42ch] text-balance text-base leading-relaxed text-muted sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              Licencia, crédito, impuestos, tu propio negocio, tu caso de
              asilo y más. Henry te enseña cómo, en español y paso a paso.
              Empieza{" "}
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
                Ver los temas
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

      {/* ============ TODO EN UN SOLO LUGAR (la propuesta total) ============ */}
      <section className="px-6 pt-14">
        <div className="reveal mx-auto max-w-xl text-center">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-gold">
            Todo en un solo lugar
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.7rem,6vw,2.4rem)] font-extrabold leading-tight tracking-tight">
            Tu vida en Estados Unidos, resuelta paso a paso.
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-muted">
            Desde que llegas hasta que montas tu negocio: aquí aprendes a hacer
            cada cosa legal, bien y sin perderte.
          </p>
        </div>

        <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2.5">
          {TOPICS.map(({ icon: Icon, label }, i) => (
            <li
              key={label}
              className="reveal flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2.5 text-sm font-semibold"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Icon className="size-4 shrink-0 text-gold" aria-hidden />
              {label}
            </li>
          ))}
          <li className="reveal flex items-center gap-2 rounded-full border border-dashed border-gold/40 px-4 py-2.5 text-sm font-semibold text-gold">
            + más cada semana
          </li>
        </ul>
      </section>

      {/* ============ POR QUÉ ============ */}
      <section className="px-6 pt-14">
        <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-3">
          {WHY.map(({ icon: Icon, title, text }, i) => (
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

      {/* ============ DESTACADO DE HOY: EL KIT ============ */}
      <section className="px-6 pt-14">
        <div className="reveal relative mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-gold/35 bg-gradient-to-b from-surface to-navy/40 p-7">
          <div
            className="pointer-events-none absolute -right-12 -top-14 size-48 rounded-full bg-gold/15 blur-3xl"
            aria-hidden
          />
          <div className="relative space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-background">
              <Sparkles className="size-3.5" aria-hidden />
              Disponible ahora
            </span>
            <h2 className="font-display text-[clamp(1.6rem,5.5vw,2.2rem)] font-extrabold leading-tight tracking-tight">
              Kit de preparación para tu audiencia de asilo
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              ¿Tienes una audiencia cerca? Aprende qué esperar y cómo responder
              ante el juez. Cada video por{" "}
              <span className="font-bold text-foreground">$8</span> — o el{" "}
              <span className="font-bold text-gold">kit completo por $17</span>.
              Acceso de por vida.
            </p>
            <Link
              href={ROUTES.catalog}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto"
            >
              Ver el kit
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="reveal px-6 pt-14 text-center">
        <h2 className="mx-auto max-w-[22ch] font-display text-[clamp(1.8rem,6vw,2.6rem)] font-extrabold leading-tight tracking-tight">
          Da el primer paso hacia tu nueva vida.
        </h2>
        <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-relaxed text-muted">
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
