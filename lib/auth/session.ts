import "server-only";
import { redirect } from "next/navigation";
import { ROLE, ROUTES, TIER, type Role, type Tier } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string | null;
  role: Role;
  tier: Tier;
  /** true cuando no hay Supabase configurado (acceso de vista previa). */
  isDemo: boolean;
}

/**
 * Usuario de la sesión actual, o null si no hay sesión.
 * En modo demo (sin Supabase) devuelve un usuario de vista previa con acceso
 * total, para poder navegar toda la app antes de conectar el backend.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) {
    return {
      id: "demo",
      email: null,
      role: ROLE.admin,
      tier: TIER.premium,
      isDemo: true,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: roleRow }, { data: entRow }] = await Promise.all([
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("entitlements")
      .select("tier")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  return {
    id: user.id,
    email: user.email ?? null,
    role: (roleRow?.role as Role | undefined) ?? ROLE.user,
    tier: (entRow?.tier as Tier | undefined) ?? TIER.free,
    isDemo: false,
  };
}

/** ¿Es admin la sesión actual? */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === ROLE.admin;
}

/**
 * Exige sesión para ver contenido (catálogo/series/reproducción).
 * En modo demo siempre hay usuario, así que no redirige. En modo real,
 * envía al login si no hay sesión. El feed queda público (no usa esto).
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);
  return user;
}
