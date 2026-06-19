"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { createAccount } from "@/lib/auth/actions";
import { ROUTES } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signup" | "login";

/** A dónde ir tras iniciar sesión: respeta ?next= si es una ruta interna. */
function destinationAfterAuth(): string {
  if (typeof window === "undefined") return ROUTES.feed;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") ? next : ROUTES.feed;
}

const inputClass =
  "w-full rounded-2xl border-2 border-border bg-surface px-5 py-4 text-lg outline-none transition-colors focus:border-gold";
const buttonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-lg font-bold text-background transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-60";

/** Traduce el error de Supabase a un mensaje claro en español. */
function friendlyError(message: string, mode: Mode): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Correo o contraseña incorrectos. Revísalos e inténtalo de nuevo.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con ese correo. Toca “Entrar” abajo.";
  if (m.includes("password") && m.includes("6"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("email not confirmed"))
    return "Tu cuenta aún no está activada. Escríbenos para ayudarte.";
  if (m.includes("invalid") && m.includes("email"))
    return "Ese correo no parece válido. Revísalo, por favor.";
  return mode === "signup"
    ? "No pudimos crear tu cuenta. Inténtalo de nuevo."
    : "No pudimos entrar. Inténtalo de nuevo.";
}

/** Mensaje claro para los errores de creación de cuenta (servidor). */
function signupError(code?: string): string {
  switch (code) {
    case "exists":
      return "Ya existe una cuenta con ese correo. Toca “Entrar” arriba.";
    case "weak":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "invalid_email":
      return "Ese correo no parece válido. Revísalo, por favor.";
    case "not_configured":
      return "El registro aún no está activo. Inténtalo más tarde.";
    default:
      return "No pudimos crear tu cuenta. Inténtalo de nuevo.";
  }
}

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modo demo (sin backend): entrar directo.
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-7 text-center">
        <Wordmark className="justify-center" />
        <p className="text-lg text-muted">
          Estás en <span className="text-gold">modo demo</span>. Las cuentas se
          activan al conectar el backend.
        </p>
        <Link href={ROUTES.feed} className={buttonClass}>
          Entrar a la app
          <ArrowRight className="size-5" aria-hidden />
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Crear cuenta: el servidor la crea ya confirmada (sin correos).
    if (mode === "signup") {
      const result = await createAccount(email, password);
      if (!result.ok) {
        setError(signupError(result.error));
        setSubmitting(false);
        return;
      }
    }

    // Iniciar sesión (recién creada o existente).
    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setError(friendlyError(authError.message, mode));
      setSubmitting(false);
      return;
    }

    window.location.href = destinationAfterAuth();
  }

  const isSignup = mode === "signup";

  return (
    <div className="space-y-7">
      <div className="space-y-4 text-center">
        <Wordmark className="justify-center" />
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-gold/15">
          <Lock className="size-8 text-gold" aria-hidden />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          {isSignup ? "Crea tu cuenta" : "Entra a tu cuenta"}
        </h1>
      </div>

      {/* Selector Crear cuenta / Entrar */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface p-1">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-xl py-2.5 text-base font-bold transition-colors ${
              mode === m ? "bg-gold text-background" : "text-muted"
            }`}
          >
            {m === "signup" ? "Crear cuenta" : "Entrar"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-base font-semibold">
            Tu correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className={inputClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-base font-semibold">
            Tu contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? "Crea una contraseña" : "Tu contraseña"}
              className={`${inputClass} pr-14`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute inset-y-0 right-0 grid w-14 place-items-center text-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-5" aria-hidden />
              ) : (
                <Eye className="size-5" aria-hidden />
              )}
            </button>
          </div>
          {isSignup && (
            <p className="text-sm text-faint">Usa al menos 6 caracteres.</p>
          )}
        </div>

        {error && (
          <p className="text-base text-danger" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={buttonClass}>
          {submitting
            ? "Un momento…"
            : isSignup
              ? "Crear mi cuenta"
              : "Entrar"}
          {!submitting && <ArrowRight className="size-5" aria-hidden />}
        </button>
      </form>

      <p className="text-center text-base text-muted">
        {isSignup ? "¿Ya tienes cuenta? " : "¿Eres nuevo? "}
        <button
          type="button"
          onClick={() => {
            setMode(isSignup ? "login" : "signup");
            setError(null);
          }}
          className="font-bold text-gold underline-offset-4 hover:underline"
        >
          {isSignup ? "Entra aquí" : "Crea tu cuenta"}
        </button>
      </p>
    </div>
  );
}
