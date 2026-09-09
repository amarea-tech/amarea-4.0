import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { useCart } from "@/context/CartContext";
import { formatCents } from "@/lib/shop";
import { fetchStoreSettings } from "@/lib/shopClient";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { lines, items, subtotalCents, shippingCents, totalCents, currency, storeOpen } = useCart();
  const { data: settings } = useQuery({ queryKey: ["store-settings"], queryFn: fetchStoreSettings });
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    line1: "",
    line2: "",
    city: "",
    postal_code: "",
    province: "",
    country: "",
  });

  const countries = settings?.shipping_countries ?? [];
  const country = form.country || countries[0] || "";

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          items: items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })),
          customer: { email: form.email, phone: form.phone || null },
          shipping_address: { ...form, country },
          origin: window.location.origin,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }
      throw new Error("Risposta di checkout non valida");
    } catch (err) {
      console.error(err);
      toast.error("Non è stato possibile avviare il pagamento. Riprova.");
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 pb-24 container mx-auto px-6 text-center">
          <h1 className="font-display text-4xl font-extrabold text-foreground mb-4">Checkout</h1>
          <p className="font-body text-muted-foreground mb-8">Il tuo carrello è vuoto.</p>
          <Link
            to="/#prodotti"
            className="inline-block bg-foreground text-primary-foreground font-body font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Scopri i prodotti
          </Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Checkout | Amarea Cosmetics</title>
        <meta name="description" content="Completa il tuo ordine Amarea Cosmetics in modo sicuro." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />
      <main className="pt-32 pb-24 container mx-auto px-6">
        <Link
          to="/#prodotti"
          className="inline-flex items-center gap-2 font-body text-foreground/60 hover:text-foreground mb-8"
        >
          <ArrowLeft size={16} /> Continua lo shopping
        </Link>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-foreground mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-foreground">Contatti</h2>
            <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} className={inputClass} />
            <input type="tel" placeholder="Telefono (opzionale)" value={form.phone} onChange={set("phone")} className={inputClass} />

            <h2 className="font-display text-2xl font-bold text-foreground pt-4">Indirizzo di spedizione</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <input required placeholder="Nome" value={form.first_name} onChange={set("first_name")} className={inputClass} />
              <input required placeholder="Cognome" value={form.last_name} onChange={set("last_name")} className={inputClass} />
            </div>
            <input required placeholder="Indirizzo" value={form.line1} onChange={set("line1")} className={inputClass} />
            <input placeholder="Interno, scala (opzionale)" value={form.line2} onChange={set("line2")} className={inputClass} />
            <div className="grid sm:grid-cols-3 gap-5">
              <input required placeholder="Città" value={form.city} onChange={set("city")} className={inputClass} />
              <input required placeholder="CAP" value={form.postal_code} onChange={set("postal_code")} className={inputClass} />
              <input placeholder="Provincia" value={form.province} onChange={set("province")} className={inputClass} />
            </div>
            <select required value={country} onChange={set("country")} className={inputClass}>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={submitting || !storeOpen}
              className="inline-flex items-center gap-3 bg-foreground text-primary-foreground font-body font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:hover:scale-100"
            >
              {submitting && <Loader2 className="animate-spin" size={18} />}
              Vai al pagamento
            </button>
            <p className="font-body text-sm text-muted-foreground">
              Il pagamento avviene su Stripe. Non conserviamo i dati della tua carta.
            </p>
          </form>

          <aside className="bg-card rounded-3xl p-8 h-fit shadow-lg">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Riepilogo</h2>
            <ul className="space-y-4 mb-6">
              {lines.map((l) => (
                <li key={l.id} className="flex justify-between font-body">
                  <span className="text-foreground">
                    {l.product_name} · {l.name} × {l.quantity}
                  </span>
                  <span className="text-foreground whitespace-nowrap">
                    {formatCents(l.price_cents * l.quantity, l.currency)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-2 font-body">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotale</span>
                <span>{formatCents(subtotalCents, currency)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{settings?.shipping_label ?? "Spedizione"}</span>
                <span>{shippingCents === 0 ? "Gratuita" : formatCents(shippingCents, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-lg pt-2">
                <span>Totale</span>
                <span>{formatCents(totalCents, currency)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default CheckoutPage;
