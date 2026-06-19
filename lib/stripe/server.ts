import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env";

let cached: Stripe | null = null;

/** Cliente de Stripe (solo servidor). Lazy: no exige la llave hasta usarse. */
export function stripeClient(): Stripe {
  if (!cached) {
    cached = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  }
  return cached;
}
