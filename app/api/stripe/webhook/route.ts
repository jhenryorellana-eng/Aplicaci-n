import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { isStripeConfigured, requireEnv } from "@/lib/env";
import { stripeClient } from "@/lib/stripe/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripeClient().webhooks.constructEvent(
      body,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const productId = session.metadata?.product_id;

    if (userId && productId) {
      const supabase = createSupabaseAdminClient();
      await supabase.from("purchases").insert({
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
  }

  return NextResponse.json({ received: true });
}
