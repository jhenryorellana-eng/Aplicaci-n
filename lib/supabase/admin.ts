import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv, requireEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cliente con service_role: ignora RLS. SOLO servidor.
 * Usar exclusivamente para webhooks y operaciones administrativas validadas.
 * El import "server-only" rompe el build si esto llega al cliente.
 */
export function createSupabaseAdminClient() {
  return createClient<Database>(
    publicEnv.supabaseUrl,
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
