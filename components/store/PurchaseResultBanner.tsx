"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "@/lib/stores/toastStore";

/** Muestra confirmación al volver del pago (lee ?compra=ok|cancel). */
export function PurchaseResultBanner() {
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compra = params.get("compra");
    if (!compra) return;

    if (compra === "ok") {
      setPurchased(true);
      toast.success("¡Listo! Ya tienes acceso a este video.");
    } else if (compra === "cancel") {
      toast.info("Compra cancelada. Puedes intentarlo cuando quieras.");
    }

    // Limpia el parámetro de la URL sin recargar.
    const url = new URL(window.location.href);
    url.searchParams.delete("compra");
    window.history.replaceState({}, "", url.toString());
  }, []);

  if (!purchased) return null;

  return (
    <div className="mx-5 mt-5 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3">
      <CheckCircle2 className="size-5 shrink-0 text-gold" aria-hidden />
      <p className="text-sm font-semibold">
        ¡Compra exitosa! Toca “Empezar” para ver el video cuando quieras.
      </p>
    </div>
  );
}
