import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { USALATINO } from "@/lib/services/usalatino";

/**
 * Puente discreto hacia USA Latino Prime. Se muestra al pie de la Audiencia de
 * Mérito: da el siguiente paso sin restarle protagonismo al video.
 */
export function ServicesFunnel() {
  return (
    <section className="rounded-2xl border border-border bg-surface/70 p-4">
      <div className="flex items-center gap-2 text-gold">
        <ShieldCheck className="size-4" aria-hidden />
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em]">
          El siguiente paso
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        ¿Tu caso necesita más fuerza? El equipo de{" "}
        <strong className="text-foreground">USA Latino Prime</strong> puede
        reforzar tu asilo o llevar tu apelación, paso a paso y en español.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={USALATINO.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle className="size-4" aria-hidden />
          Hablar por WhatsApp
        </a>
        <Link
          href={ROUTES.servicios}
          className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
        >
          Ver todos los servicios →
        </Link>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-faint">
        Contenido educativo. No constituye asesoría legal.
      </p>
    </section>
  );
}
