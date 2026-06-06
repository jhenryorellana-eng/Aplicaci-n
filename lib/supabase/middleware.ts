import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, publicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/** Refresca la sesión de Supabase en cada petición (cookies). */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // En modo demo (sin Supabase) no hay sesión que refrescar.
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: getUser() revalida el token y refresca cookies si hace falta.
  await supabase.auth.getUser();

  return response;
}
