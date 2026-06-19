import { NextResponse } from "next/server";
import { ROUTES } from "@/lib/constants";
import { isStripeConfigured } from "@/lib/env";
import { stripeClient } from "@/lib/stripe/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function safeNext(next: string | null): string {
  return next && next.startsWith("/") ? next : ROUTES.catalog;
}

/**
 * Stripe redirige aquí tras el pago (success_url con {CHECKOUT_SESSION_ID}).
 * Verificamos la sesión contra Stripe (llamada saliente, sin necesidad de
 * webhook) y, si está pagada, concedemos el acceso insertando la compra.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const next = safeNext(url.searchParams.get("next"));
  const fail = NextResponse.redirect(
    new URL(`${next}?compra=cancel`, request.url),
  );

  if (!isStripeConfigured() || !sessionId) return fail;

  try {
    const session = await stripeClient().checkout.sessions.retrieve(sessionId);
    const userId = session.metadata?.user_id;
    const productId = session.metadata?.product_id;

    if (session.payment_status !== "paid" || !userId || !productId) return fail;

    const admin = createSupabaseAdminClient();
    const { data: existing } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .eq("status", "paid")
      .maybeSingle();

    if (!existing) {
      await admin.from("purchases").insert({
        user_id: userId,
        product_id: productId,
        status: "paid",
        amount_cents: session.amount_total,
        currency: session.currency,
        stripe_session_id: session.id,
        stripe_payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      });
    }

    return NextResponse.redirect(new URL(`${next}?compra=ok`, request.url));
  } catch {
    return fail;
  }
}
