/**
 * Acceso centralizado a variables de entorno y banderas de configuración.
 *
 * Las variables NEXT_PUBLIC_* se referencian de forma literal para que
 * Next.js las inserte en el bundle del cliente. Los secretos (sin prefijo
 * NEXT_PUBLIC_) solo existen en el servidor; en el cliente quedan como
 * `undefined`, por lo que nunca se filtran.
 */

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** ¿Están configuradas las credenciales públicas de Supabase? */
export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}

/** ¿Está configurado Mux para firmar reproducciones? (solo servidor) */
export function isMuxConfigured(): boolean {
  return Boolean(
    process.env.MUX_TOKEN_ID &&
      process.env.MUX_TOKEN_SECRET &&
      process.env.MUX_SIGNING_KEY_ID &&
      process.env.MUX_SIGNING_PRIVATE_KEY,
  );
}

/**
 * Lee una variable de entorno obligatoria del servidor.
 * Lanza si falta. NO usar en código que corra en el cliente.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  return value;
}
