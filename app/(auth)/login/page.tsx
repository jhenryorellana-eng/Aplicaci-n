import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AccountView } from "@/components/auth/AccountView";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/auth/session";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Cuenta" };

export default async function LoginPage() {
  const user = await getSessionUser();

  return (
    <main className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col px-6 pb-16 pt-6">
      <Link
        href={ROUTES.feed}
        aria-label="Volver"
        className="grid size-10 place-items-center rounded-full border border-border text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-6" aria-hidden />
      </Link>

      <div className="flex flex-1 flex-col justify-center">
        {user ? <AccountView user={user} /> : <LoginForm />}
      </div>
    </main>
  );
}
