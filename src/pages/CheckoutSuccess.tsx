import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { fetchOrderByToken } from "@/lib/shopClient";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/shop";
import type { OrderSummary } from "@/integrations/supabase/shopTypes";

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const token = params.get("order") ?? "";
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  const { data, isLoading } = useQuery({
    queryKey: ["order", token],
    queryFn: () => fetchOrderByToken(token) as Promise<OrderSummary | null>,
    enabled: token.length > 0,
    // il webhook Stripe può arrivare con qualche secondo di ritardo
    refetchInterval: (query) =>
      (query.state.data as OrderSummary | null)?.status === "pending" ? 3000 : false,
  });

  const pending = !data || data.status === "pending";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ordine confermato | Amarea Cosmetics</title>
        <meta name="description" content="Grazie per il tuo ordine Amarea Cosmetics." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />
      <main className="pt-36 pb-24 container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-10">
          {pending ? (
            <Loader2 className="mx-auto mb-6 animate-spin text-primary" size={48} />
          ) : (
            <CheckCircle2 className="mx-auto mb-6 text-primary" size={56} />
          )}
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            {pending ? "Stiamo confermando il pagamento" : "Grazie per il tuo ordine!"}
          </h1>
          <p className="font-body text-muted-foreground">
            {pending
              ? "Un attimo: appena il pagamento è confermato vedrai qui il riepilogo."
              : `Abbiamo inviato la conferma a ${data?.email}.`}
          </p>
        </div>

        {isLoading && token && <p className="font-body text-center text-muted-foreground">Caricamento…</p>}

        {data && !pending && (
          <div className="bg-card rounded-3xl p-8 shadow-lg">
            <p className="font-body text-sm text-muted-foreground mb-6">
              Ordine n. <span className="font-bold text-foreground">{data.order_number}</span>
            </p>
            <ul className="space-y-3 mb-6">
              {data.items.map((item, i) => (
                <li key={i} className="flex justify-between font-body">
                  <span className="text-foreground">
                    {item.product_name} · {item.variant_name} × {item.quantity}
                  </span>
                  <span className="text-foreground">
                    {formatCents(item.line_total_cents, data.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-2 font-body">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotale</span>
                <span>{formatCents(data.subtotal_cents, data.currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Spedizione</span>
                <span>
                  {data.shipping_cents === 0
                    ? "Gratuita"
                    : formatCents(data.shipping_cents, data.currency)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-lg pt-2">
                <span>Totale</span>
                <span>{formatCents(data.total_cents, data.currency)}</span>
              </div>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-6">
              Spedizione a {data.shipping.first_name} {data.shipping.last_name}, {data.shipping.line1},{" "}
              {data.shipping.postal_code} {data.shipping.city} ({data.shipping.country})
            </p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block bg-foreground text-primary-foreground font-body font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Torna alla home
          </Link>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default CheckoutSuccess;
