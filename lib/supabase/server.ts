import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para Server Components, Route Handlers y Server Actions.
 * Usa las cookies de la petición para mantener la sesión.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component (no puede escribir cookies):
            // el middleware se encarga de refrescar la sesión. Patrón oficial
            // de @supabase/ssr.
          }
        },
      },
    },
  );
}
