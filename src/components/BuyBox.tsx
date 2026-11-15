import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/shop";
import type { CatalogProduct } from "@/lib/shopClient";

/** Blocco acquisto: prezzo, variante e disponibilità arrivano solo dal database. */
const BuyBox = ({ product }: { product: CatalogProduct }) => {
  const { add, storeOpen } = useCart();
  const variants = useMemo(
    () => (product.variants ?? []).filter((v) => v.active).sort((a, b) => a.sort_order - b.sort_order),
    [product.variants],
  );
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  if (!variant) return null;

  const maxQty = Math.max(0, variant.available);
  const soldOut = maxQty <= 0;

  return (
    <div className="mt-2">
      <p className="font-display text-4xl font-semibold text-primary mb-4">
        {formatCents(variant.price_cents, variant.currency)}
      </p>

      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {variants.map((v) => (
            <Button variant="ghost"
              key={v.id}
              onClick={() => {
                setVariantId(v.id);
                setQuantity(1);
              }}
              className={`font-body text-sm px-5 py-2 rounded-full border transition-colors ${
                v.id === variant.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground/70 hover:border-primary"
              }`}
            >
              {v.name}
            </Button>
          ))}
        </div>
      )}

      <p className="font-body text-sm text-muted-foreground mb-5">
        {soldOut
          ? "Esaurito al momento"
          : maxQty <= 5
            ? `Ultimi ${maxQty} pezzi disponibili`
            : "Disponibile"}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-border rounded-full">
          <Button variant="ghost"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={soldOut}
            aria-label="Diminuisci quantità"
            className="px-4 py-3 text-foreground/70 hover:text-foreground disabled:opacity-30"
          >
            <Minus size={16} />
          </Button>
          <span className="font-body w-8 text-center">{quantity}</span>
          <Button variant="ghost"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={soldOut || quantity >= maxQty}
            aria-label="Aumenta quantità"
            className="px-4 py-3 text-foreground/70 hover:text-foreground disabled:opacity-30"
          >
            <Plus size={16} />
          </Button>
        </div>

        <Button variant="ghost"
          onClick={() => add(variant.id, quantity)}
          disabled={soldOut || !storeOpen}
          className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-body font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-500 disabled:opacity-40 disabled:hover:scale-100"
        >
          <ShoppingBag size={18} />
          {soldOut ? "Esaurito" : "Aggiungi al carrello"}
        </Button>
      </div>
    </div>
  );
};

export default BuyBox;
