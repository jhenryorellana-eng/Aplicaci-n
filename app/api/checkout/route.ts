import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { ROUTES } from "@/lib/constants";
import { isStripeConfigured, publicEnv } from "@/lib/env";
import { stripeClient } from "@/lib/stripe/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.isDemo) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    productSlug?: string;
    returnTo?: string;
  };
  if (!body.productSlug) {
    return NextResponse.json({ error: "missing_product" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, title, price_cents, currency")
    .eq("slug", body.productSlug)
    .eq("is_active", true)
    .maybeSingle();
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const returnTo = body.returnTo?.startsWith("/") ? body.returnTo : ROUTES.catalog;

  const session = await stripeClient().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: product.currency,
          unit_amount: product.price_cents,
          product_data: { name: product.title },
        },
      },
    ],
    customer_email: user.email ?? undefined,
    success_url: `${publicEnv.siteUrl}${returnTo}?compra=ok`,
    cancel_url: `${publicEnv.siteUrl}${returnTo}?compra=cancel`,
    metadata: { user_id: user.id, product_id: product.id },
  });

  return NextResponse.json({ url: session.url });
}
