import {
  ArrowUpRight,
  BadgeCheck,
  FileCheck,
  Gavel,
  HeartHandshake,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { USALATINO, type Service } from "@/lib/services/usalatino";

const ICONS: Record<string, LucideIcon> = {
  "reforzar-asilo": ShieldCheck,
  "apelacion-bia": Scale,
  "mociones-corte": Gavel,
  "asilo-politico": FileCheck,
  "ajuste-estatus": BadgeCheck,
  "visa-juvenil": HeartHandshake,
};

/**
 * Fila de servicio (vive dentro de un panel con divisores). Icono + nombre +
 * una línea; enlaza con un clic al sitio de USA Latino Prime.
 */
export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.slug] ?? ShieldCheck;
  return (
    <a
      href={USALATINO.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 px-4 py-4 transition-colors hover:bg-gold/[0.06]"
    >
      {/* Acento dorado lateral: fijo en destacados, al pasar en el resto */}
      <span
        className={`absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2 rounded-r-full bg-gold transition-opacity duration-300 ${
          service.highlight ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        aria-hidden
      />
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold ring-1 ring-inset ring-gold/20 transition-colors group-hover:bg-gold/15">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="font-display text-[0.97rem] font-bold leading-snug">
            {service.name}
          </h3>
          {service.highlight && (
            <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide text-gold">
              Más solicitado
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[0.83rem] leading-relaxed text-muted">
          {service.description}
        </p>
      </div>
      <ArrowUpRight
        className="size-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
        aria-hidden
      />
    </a>
  );
}
