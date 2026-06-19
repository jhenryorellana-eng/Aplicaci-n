import { Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { BuyButton } from "@/components/store/BuyButton";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/purchases/data";
import type { Series } from "@/types/domain";

type Props = {
  series: Series;
  product: StoreProduct | null;
  bundle: StoreProduct | null;
};

/** Panel de compra para una serie de pago que el usuario aún no tiene. */
export function PurchasePanel({ series, product, bundle }: Props) {
  const returnTo = ROUTES.series(series.slug);

  return (
    <div className="space-y-4 rounded-2xl border border-gold/30 bg-surface p-5">
      <div className="flex items-center gap-2 text-gold">
        <Lock className="size-5" aria-hidden />
        <span className="text-sm font-bold uppercase tracking-wide">
          Video de pago
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted">
        Desbloquea este video y míralo todas las veces que quieras, cuando
        quieras.
      </p>

      <ul className="space-y-2">
        {[
          "Acceso de por vida — sin mensualidades",
          "Explicado en español, paso a paso",
          "Basado en la experiencia real de Henry",
        ].map((benefit) => (
          <li key={benefit} className="flex items-center gap-2.5 text-sm">
            <Check className="size-4 shrink-0 text-gold" aria-hidden />
            {benefit}
          </li>
        ))}
      </ul>

      {product && (
        <BuyButton
          productSlug={product.slug}
          returnTo={returnTo}
          label={`Comprar por ${formatPrice(product.priceCents, product.currency)}`}
        />
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-faint">
        <ShieldCheck className="size-3.5" aria-hidden />
        Pago seguro · +500 familias acompañadas
      </p>

      {bundle && (
        <div className="space-y-2 rounded-xl border border-border bg-surface-2/60 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="size-4 text-gold" aria-hidden />
            ¿Vas a varias audiencias?
          </p>
          <p className="text-sm text-muted">
            Llévate los 3 videos por{" "}
            <strong className="text-gold">
              {formatPrice(bundle.priceCents, bundle.currency)}
            </strong>{" "}
            y ahorra.
          </p>
          <BuyButton
            productSlug={bundle.slug}
            returnTo={returnTo}
            variant="outline"
            label={`Comprar el paquete · ${formatPrice(bundle.priceCents, bundle.currency)}`}
          />
        </div>
      )}
    </div>
  );
}
