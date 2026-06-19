import { Check, X } from "lucide-react";

const TRADITIONAL = [
  "Pagas miles y dependes del abogado.",
  "Eres un expediente más.",
  "No entiendes tu propio caso.",
  "Si pierdes, te quedas sin rumbo.",
];

const OURS = [
  "Tú al mando: la plataforma te guía paso a paso.",
  "Solo das tu información y ella arma el caso.",
  "Todo automático, claro y en español.",
  "¿Te trabas? Hay ayuda humana cuando la pidas.",
];

/** Posicionamiento: el sistema tradicional vs. tu camino aquí. */
export function SystemComparison() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold">
          Por qué esto es distinto
        </p>
        <h2 className="max-w-[22ch] font-display text-2xl font-extrabold leading-[1.1] tracking-tight">
          El sistema te quiere perdido. Nosotros, preparado.
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface/50 p-5">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-faint">
            El camino de siempre
          </h3>
          <ul className="space-y-3.5">
            {TRADITIONAL.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/5">
                  <X className="size-3 text-faint" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gold/[0.06] p-5">
          <div
            className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gold/15 blur-2xl"
            aria-hidden
          />
          <h3 className="relative mb-4 text-xs font-bold uppercase tracking-[0.14em] text-gold">
            Tu camino aquí
          </h3>
          <ul className="relative space-y-3.5">
            {OURS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm font-medium text-foreground"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold/20">
                  <Check className="size-3 text-gold" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mx-auto max-w-[46ch] text-center text-xs leading-relaxed text-faint">
        No estamos en contra de los abogados: queremos que entiendas tu caso
        antes de gastar lo que no tienes.
      </p>
    </section>
  );
}
