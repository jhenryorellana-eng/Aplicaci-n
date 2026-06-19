import type { Metadata } from "next";
import {
  ArrowRight,
  HeartHandshake,
  ListChecks,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SystemComparison } from "@/components/services/SystemComparison";
import { SERVICES, USALATINO } from "@/lib/services/usalatino";

export const metadata: Metadata = { title: "Servicios" };

const TRUST = [
  { icon: ListChecks, label: "Hazlo tú mismo, paso a paso" },
  { icon: Zap, label: "Automático con tu información" },
  { icon: HeartHandshake, label: "Ayuda humana si la necesitas" },
];

export default function ServiciosPage() {
  return (
    <main className="space-y-12 px-5 pb-28 pt-7">
      {/* Hero */}
      <header
        className="reveal relative overflow-hidden rounded-[1.75rem] border border-gold/25 bg-gradient-to-b from-navy/55 via-surface to-surface px-6 pb-7 pt-9"
        style={{ animationDelay: "0s" }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-gold/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-12 size-44 rounded-full bg-navy/50 blur-3xl"
          aria-hidden
        />
        <div className="relative space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1">
            <ShieldCheck className="size-3.5 text-gold" aria-hidden />
            <span className="text-[0.64rem] font-bold uppercase tracking-[0.2em] text-gold">
              USA Latino Prime
            </span>
          </span>
          <h1 className="font-display text-[2rem] font-extrabold leading-[1.06] tracking-tight">
            Hazlo tú mismo.
            <br />
            <span className="text-gold">Pero nunca solo.</span>
          </h1>
          <p className="max-w-[46ch] text-[0.95rem] leading-relaxed text-muted">
            Solo das tu información y la plataforma arma tu caso, paso a paso y
            automático. ¿Te trabas? Hay ayuda humana cuando la pidas.
          </p>
          <ul className="flex flex-col gap-2.5 pt-1">
            {TRUST.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-sm font-semibold text-foreground/85"
              >
                <Icon className="size-4 shrink-0 text-gold" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="reveal" style={{ animationDelay: "0.08s" }}>
        <SystemComparison />
      </div>

      {/* Servicios */}
      <section className="reveal space-y-4" style={{ animationDelay: "0.16s" }}>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            En qué te guía la plataforma
          </h2>
          <span className="shrink-0 text-xs font-semibold text-faint">
            {SERVICES.length} trámites
          </span>
        </div>
        <div className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border bg-surface/40">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="reveal relative overflow-hidden rounded-[1.75rem] border border-gold/35 bg-surface p-7 text-center"
        style={{ animationDelay: "0.24s" }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-gold/15 blur-3xl"
          aria-hidden
        />
        <div className="relative space-y-4">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Da el primer paso, tú mismo
          </h2>
          <p className="mx-auto max-w-[42ch] text-sm leading-relaxed text-muted">
            Entra a la plataforma, da tu información y deja que te guíe. Y si
            necesitas una mano, el equipo está a un clic.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-center">
            <a
              href={USALATINO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-bold text-background shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] active:scale-95"
            >
              Empezar en la plataforma
              <ArrowRight className="size-5" aria-hidden />
            </a>
            <a
              href={USALATINO.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border px-7 py-3.5 font-bold transition-colors hover:border-gold/60"
            >
              <MessageCircle className="size-5 text-gold" aria-hidden />
              Necesito ayuda humana
            </a>
          </div>
          <a
            href={USALATINO.phoneHref}
            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-faint transition-colors hover:text-gold"
          >
            <Phone className="size-4" aria-hidden />o llama al {USALATINO.phone}
          </a>
        </div>
      </section>

      <p className="text-center text-xs leading-relaxed text-faint">
        USA Latino Prime es una plataforma independiente. Contenido informativo,
        no asesoría legal.
      </p>
    </main>
  );
}
