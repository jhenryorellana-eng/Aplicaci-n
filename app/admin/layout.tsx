import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { requireAdmin } from "@/lib/admin/guard";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto min-h-[100dvh] max-w-3xl px-4 pb-20">
      <header className="flex items-center justify-between gap-4 py-5">
        <Link
          href={ROUTES.admin}
          className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight"
        >
          <ShieldCheck className="size-5 text-gold" aria-hidden />
          Admin
        </Link>
        <nav className="flex gap-4 text-sm font-semibold text-muted">
          <Link href={ROUTES.admin} className="hover:text-foreground">
            Series
          </Link>
          <Link href={`${ROUTES.admin}/clips`} className="hover:text-foreground">
            Feed
          </Link>
          <Link href={ROUTES.feed} className="hover:text-foreground">
            Ver app
          </Link>
        </nav>
      </header>

      {!configured && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          <strong>Modo demo.</strong> Estás viendo datos de ejemplo. Conecta
          Supabase para crear y guardar contenido real.
        </div>
      )}

      {children}
    </div>
  );
}
