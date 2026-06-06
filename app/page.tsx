import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden px-6 pb-10 pt-8">
      {/* Marca */}
      <header className="reveal flex items-center gap-2.5" style={{ animationDelay: "0ms" }}>
        <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_18px_4px_rgba(244,183,64,0.55)]" />
        <span className="font-display text-lg font-extrabold tracking-tight">
          {APP_NAME}
        </span>
      </header>

      {/* Héroe */}
      <section className="flex flex-1 flex-col justify-center">
        <p
          className="reveal mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-gold"
          style={{ animationDelay: "80ms" }}
        >
          El método, paso a paso
        </p>

        <h1
          className="reveal max-w-[14ch] font-display text-[clamp(2.6rem,11vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.02em]"
          style={{ animationDelay: "160ms" }}
        >
          Tu camino al{" "}
          <span className="bg-gradient-to-br from-gold to-gold-deep bg-clip-text text-transparent">
            éxito
          </span>{" "}
          en Estados Unidos.
        </h1>

        <p
          className="reveal mt-6 max-w-[46ch] text-balance text-base leading-relaxed text-muted sm:text-lg"
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
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-base font-semibold text-foreground transition-colors duration-200 hover:border-gold/60 hover:text-gold"
          >
            Explorar el catálogo
            <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <footer
        className="reveal text-sm text-faint"
        style={{ animationDelay: "420ms" }}
      >
        Contenido informativo y educativo. No constituye asesoría legal.
      </footer>
    </main>
  );
}
