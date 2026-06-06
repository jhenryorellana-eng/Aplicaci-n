"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect(ROUTES.login);
}

export type CreateAccountResult = { ok: boolean; error?: string };

/**
 * Crea una cuenta YA confirmada (sin enviar correo) usando service_role.
 * El cliente luego inicia sesión con la contraseña. Todo dentro de la app.
 */
export async function createAccount(
  email: string,
  password: string,
): Promise<CreateAccountResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) return { ok: false, error: "missing" };
  if (password.length < 6) return { ok: false, error: "weak" };
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: "not_configured" };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
  });

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("already") || m.includes("registered") || m.includes("exists")) {
      return { ok: false, error: "exists" };
    }
    if (m.includes("password")) return { ok: false, error: "weak" };
    if (m.includes("email")) return { ok: false, error: "invalid_email" };
    return { ok: false, error: "unknown" };
  }

  return { ok: true };
}
