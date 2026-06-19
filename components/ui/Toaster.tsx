"use client";

import { useEffect } from "react";
import { Check, Info, X } from "lucide-react";
import { useToastStore, type Toast } from "@/lib/stores/toastStore";

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), 3200);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  const Icon =
    toast.variant === "success" ? Check : toast.variant === "error" ? X : Info;
  const badge =
    toast.variant === "success"
      ? "bg-gold text-background"
      : toast.variant === "error"
        ? "bg-danger text-white"
        : "bg-surface-2 text-foreground";

  return (
    <div className="toast-enter pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground shadow-2xl">
      <span className={`grid size-6 shrink-0 place-items-center rounded-full ${badge}`}>
        <Icon className="size-4" aria-hidden />
      </span>
      {toast.message}
    </div>
  );
}

/** Contenedor global de avisos. Se monta una vez en el layout. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
