import { APP_NAME } from "@/lib/constants";

/** Marca: barras ascendentes doradas + nombre. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="size-6" aria-hidden>
        <rect x="4" y="22" width="9" height="14" rx="2.5" fill="#e9ae4e" />
        <rect x="15.5" y="13" width="9" height="23" rx="2.5" fill="#f2bc5a" />
        <rect x="27" y="5" width="9" height="31" rx="2.5" fill="#ffd98a" />
      </svg>
      <span className="font-display text-lg font-extrabold tracking-tight">
        {APP_NAME}
      </span>
    </span>
  );
}
