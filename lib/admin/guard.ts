import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";
import { ROLE, ROUTES } from "@/lib/constants";

/** Exige sesión de admin; si no, redirige al login. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== ROLE.admin) {
    redirect(ROUTES.login);
  }
  return user;
}
