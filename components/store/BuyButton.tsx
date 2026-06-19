"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";

type Props = {
  productSlug: string;
  label: string;
  returnTo: string;
  variant?: "primary" | "outline";
  className?: string;
};

export function BuyButton({
  productSlug,
  label,
  returnTo,
  variant = "primary",
  className = "",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function buy() {
    setBusy(true);
    setMessage(null);
    const res = await fetch(ROUTES.api.checkout, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug, returnTo }),
    });

    if (res.status === 401) {
      window.location.href = `${ROUTES.login}?next=${encodeURIComponent(returnTo)}`;
      return;
    }
    if (res.status === 503) {
      setMessage("El pago se activará muy pronto. ¡Vuelve en unos días!");
      setBusy(false);
      return;
    }
    const data = (await res.json().catch(() => ({}))) as { url?: string };
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setMessage("No se pudo iniciar el pago. Inténtalo de nuevo.");
    setBusy(false);
  }

  const base =
    variant === "primary"
      ? "bg-gold text-background hover:scale-[1.02]"
      : "border-2 border-border text-foreground hover:border-gold/60";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={buy}
        disabled={busy}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold transition-all duration-200 active:scale-95 disabled:opacity-60 ${base}`}
      >
        {busy && <Loader2 className="size-5 animate-spin" aria-hidden />}
        {label}
      </button>
      {message && (
        <p className="mt-2 text-center text-sm text-gold" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
