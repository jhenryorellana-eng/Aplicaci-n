import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-6 text-center">
      <div className="space-y-5">
        <p className="font-display text-7xl font-extrabold text-gold">404</p>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          No encontramos esta página
        </h1>
        <p className="text-muted">
          Puede que el contenido se haya movido o ya no exista.
        </p>
        <Link
          href={ROUTES.feed}
          className="inline-flex rounded-full bg-gold px-7 py-3 font-bold text-background transition-transform hover:scale-[1.03] active:scale-95"
        >
          Ir al feed
        </Link>
      </div>
    </main>
  );
}
