import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Crown,
  Film,
  Heart,
  Layers,
  LogOut,
  Play,
  Route,
  ShieldCheck,
} from "lucide-react";
import { SeriesCard } from "@/components/catalog/SeriesCard";
import { signOut } from "@/lib/auth/actions";
import type { SessionUser } from "@/lib/auth/session";
import { ROLE, ROUTES, TIER } from "@/lib/constants";
import { getProfileData, type ProfileData } from "@/lib/profile/data";

const EMPTY: ProfileData = {
  episodesWatched: 0,
  minutesLearned: 0,
  seriesInProgress: 0,
  guided: { done: 0, total: 0 },
  continueWatching: null,
  favorites: [],
};

export async function AccountView({ user }: { user: SessionUser }) {
  const data = user.isDemo ? EMPTY : await getProfileData();
  const isAdmin = user.role === ROLE.admin;
  const isPremium = user.tier === TIER.premium;
  const initial = (user.email?.[0] ?? "T").toUpperCase();
  const pct =
    data.guided.total > 0
      ? Math.round((data.guided.done / data.guided.total) * 100)
      : 0;

  const stats = [
    { icon: Film, value: data.episodesWatched, label: "Episodios vistos" },
    { icon: Clock, value: data.minutesLearned, label: "Minutos" },
    { icon: Layers, value: data.seriesInProgress, label: "Series" },
  ];

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <header className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gold/15 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep font-display text-2xl font-extrabold text-background">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-extrabold tracking-tight">
              ¡Hola!
            </p>
            <p className="truncate text-sm text-muted">
              {user.isDemo ? "Invitado (demo)" : user.email}
            </p>
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
              isPremium ? "bg-gold/20 text-gold" : "border border-border text-muted"
            }`}
          >
            <Crown className="size-4" aria-hidden />
            {isPremium ? "Premium" : "Gratis"}
          </span>
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold">
              <ShieldCheck className="size-4 text-gold" aria-hidden />
              Administrador
            </span>
          )}
        </div>
      </header>

      {/* Estadísticas */}
      <section className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-4 text-center"
          >
            <Icon className="mx-auto mb-1.5 size-5 text-gold" aria-hidden />
            <p className="font-display text-2xl font-extrabold">{value}</p>
            <p className="text-xs leading-tight text-muted">{label}</p>
          </div>
        ))}
      </section>

      {/* Progreso de la Ruta del Éxito */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center gap-2 text-gold">
          <Route className="size-4" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-[0.18em]">
            Tu progreso
          </span>
        </div>
        <div className="mb-2 flex items-end justify-between">
          <h3 className="font-display text-lg font-bold">La Ruta del Éxito</h3>
          <span className="font-display text-lg font-extrabold text-gold">
            {pct}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-deep transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          {data.guided.done} de {data.guided.total} lecciones completadas
        </p>
      </section>

      {/* Continuar viendo */}
      {data.continueWatching && (
        <section className="space-y-3">
          <h3 className="font-display text-lg font-bold">Continuar viendo</h3>
          <Link
            href={ROUTES.watch(data.continueWatching.episode.id)}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-colors hover:border-gold/50"
          >
            <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              {data.continueWatching.episode.thumbnailUrl && (
                <Image
                  src={data.continueWatching.episode.thumbnailUrl}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              )}
              <span className="absolute inset-0 grid place-items-center bg-black/30">
                <Play className="size-8 fill-white text-white" aria-hidden />
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                {data.continueWatching.series.title}
              </p>
              <p className="truncate font-semibold">
                {data.continueWatching.episode.title}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Mis favoritos */}
      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold">
          <Heart className="size-5 text-gold" aria-hidden />
          Mis favoritos
        </h3>
        {data.favorites.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
            Aún no has guardado nada. Toca <strong>“Guardar”</strong> en una
            serie para tenerla aquí.
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {data.favorites.map((series) => (
              <SeriesCard
                key={series.id}
                series={series}
                className="w-[40vw] shrink-0 sm:w-[170px]"
              />
            ))}
          </div>
        )}
      </section>

      {/* Acciones */}
      <section className="space-y-2.5">
        {isAdmin && (
          <Link
            href={ROUTES.admin}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5 font-semibold transition-colors hover:border-gold/50"
          >
            Panel de administración
            <ShieldCheck className="size-5 text-gold" aria-hidden />
          </Link>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3.5 font-semibold text-muted transition-colors hover:border-danger/60 hover:text-danger"
          >
            <LogOut className="size-5" aria-hidden />
            Cerrar sesión
          </button>
        </form>
      </section>
    </div>
  );
}
