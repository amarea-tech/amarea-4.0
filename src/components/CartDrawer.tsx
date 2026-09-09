import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/shop";

const CartDrawer = () => {
  const {
    isOpen,
    closeCart,
    lines,
    subtotalCents,
    shippingCents,
    totalCents,
    currency,
    setQuantity,
    remove,
    storeOpen,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[61] h-full w-full max-w-md bg-background shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Carrello"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-display text-2xl font-extrabold text-foreground flex items-center gap-2">
                <ShoppingBag size={20} /> Carrello
              </h2>
              <button onClick={closeCart} aria-label="Chiudi carrello" className="text-foreground/60 hover:text-foreground">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <p className="font-body text-muted-foreground py-12 text-center">
                  Il tuo carrello è vuoto.
                </p>
              ) : (
                <ul className="space-y-5">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <p className="font-body font-semibold text-foreground">{line.product_name}</p>
                        <p className="font-body text-sm text-muted-foreground">{line.name}</p>
                        <p className="font-body text-sm text-foreground/80 mt-1">
                          {formatCents(line.price_cents, line.currency)}
                        </p>
                        {line.available < line.quantity && (
                          <p className="font-body text-xs text-destructive mt-1">
                            Disponibili solo {line.available} pezzi
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-border rounded-full">
                            <button
                              onClick={() => setQuantity(line.id, line.quantity - 1)}
                              aria-label="Diminuisci quantità"
                              className="px-3 py-1.5 text-foreground/70 hover:text-foreground"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-body text-sm w-6 text-center">{line.quantity}</span>
                            <button
                              onClick={() => setQuantity(line.id, line.quantity + 1)}
                              disabled={line.quantity >= line.available}
                              aria-label="Aumenta quantità"
                              className="px-3 py-1.5 text-foreground/70 hover:text-foreground disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(line.id)}
                            aria-label={`Rimuovi ${line.product_name}`}
                            className="text-foreground/50 hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="font-body font-semibold text-foreground whitespace-nowrap">
                        {formatCents(line.price_cents * line.quantity, line.currency)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-border px-6 py-5 space-y-2">
                <div className="flex justify-between font-body text-muted-foreground">
                  <span>Subtotale</span>
                  <span>{formatCents(subtotalCents, currency)}</span>
                </div>
                <div className="flex justify-between font-body text-muted-foreground">
                  <span>Spedizione</span>
                  <span>{shippingCents === 0 ? "Gratuita" : formatCents(shippingCents, currency)}</span>
                </div>
                <div className="flex justify-between font-body font-bold text-foreground text-lg pt-1">
                  <span>Totale</span>
                  <span>{formatCents(totalCents, currency)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  aria-disabled={!storeOpen}
                  className={`block text-center mt-4 bg-foreground text-primary-foreground font-body font-bold px-8 py-4 rounded-full transition-transform ${
                    storeOpen ? "hover:scale-105" : "pointer-events-none opacity-50"
                  }`}
                >
                  Vai al checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
