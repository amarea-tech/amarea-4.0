// Amarea 4.0 — creazione ordine + Stripe Checkout Session (server-side)
// I prezzi arrivano SEMPRE dal database, mai dal browser.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type IncomingItem = { variant_id: string; quantity: number };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const str = (v: unknown, max = 200) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!stripeKey || !supabaseUrl || !serviceKey) {
      console.error("Missing environment configuration");
      return json({ error: "Configurazione del negozio incompleta." }, 500);
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const body = await req.json().catch(() => null);
    if (!body) return json({ error: "Richiesta non valida." }, 400);

    const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0 || items.length > 50) {
      return json({ error: "Il carrello è vuoto." }, 400);
    }

    // normalizza e aggrega quantità per variante
    const wanted = new Map<string, number>();
    for (const it of items) {
      const id = str(it?.variant_id, 64);
      const qty = Number(it?.quantity);
      if (!id || !Number.isInteger(qty) || qty < 1 || qty > 99) {
        return json({ error: "Quantità non valida." }, 400);
      }
      wanted.set(id, (wanted.get(id) ?? 0) + qty);
    }

    const email = str(body.email, 255).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Inserisci un indirizzo email valido." }, 400);
    }

    const ship = {
      first_name: str(body.first_name, 80),
      last_name: str(body.last_name, 80),
      line1: str(body.line1, 200),
      line2: str(body.line2, 200) || null,
      city: str(body.city, 100),
      postal_code: str(body.postal_code, 20),
      province: str(body.province, 50) || null,
      country: (str(body.country, 2) || "IT").toUpperCase(),
      phone: str(body.phone, 40) || null,
    };
    for (const [k, v] of Object.entries({
      first_name: ship.first_name,
      last_name: ship.last_name,
      line1: ship.line1,
      city: ship.city,
      postal_code: ship.postal_code,
    })) {
      if (!v) return json({ error: `Campo obbligatorio mancante: ${k}` }, 400);
    }

    // ---- impostazioni negozio (tutto da DB, niente hardcode)
    const { data: settingsRows, error: settingsErr } = await admin
      .from("store_settings")
      .select("key, value");
    if (settingsErr) throw settingsErr;
    const settings = Object.fromEntries(
      (settingsRows ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value]),
    ) as Record<string, unknown>;

    const currency = String(settings.currency ?? "EUR");
    const shippingFlat = Number(settings.shipping_flat_cents ?? 0);
    const freeThreshold = settings.free_shipping_threshold_cents == null
      ? null
      : Number(settings.free_shipping_threshold_cents);
    const allowedCountries: string[] = Array.isArray(settings.shipping_countries)
      ? (settings.shipping_countries as string[]).map((c) => String(c).toUpperCase())
      : ["IT"];
    const siteUrl = String(settings.site_url ?? new URL(req.url).origin);

    if (!allowedCountries.includes(ship.country)) {
      return json({ error: "Al momento spediamo solo in: " + allowedCountries.join(", ") }, 400);
    }

    // ---- prezzi e disponibilità dal database
    const variantIds = [...wanted.keys()];
    const { data: variants, error: vErr } = await admin
      .from("product_variants")
      .select("id, name, sku, price_cents, currency, active, product_id, products(name, active), inventory(quantity, reserved)")
      .in("id", variantIds);
    if (vErr) throw vErr;

    if (!variants || variants.length !== variantIds.length) {
      return json({ error: "Uno dei prodotti selezionati non è più disponibile." }, 409);
    }

    let subtotal = 0;
    const orderItems: Record<string, unknown>[] = [];
    const lineItems: Record<string, unknown>[] = [];

    for (const v of variants as any[]) {
      const qty = wanted.get(v.id)!;
      if (!v.active || !v.products?.active) {
        return json({ error: `${v.products?.name ?? "Prodotto"} non è acquistabile.` }, 409);
      }
      if (String(v.currency).toUpperCase() !== currency.toUpperCase()) {
        return json({ error: "Valuta non coerente nel carrello." }, 409);
      }
      const inv = Array.isArray(v.inventory) ? v.inventory[0] : v.inventory;
      const available = (inv?.quantity ?? 0) - (inv?.reserved ?? 0);
      if (available < qty) {
        return json(
          { error: `Disponibilità insufficiente per ${v.products?.name ?? v.name}.`, available },
          409,
        );
      }
      const lineTotal = v.price_cents * qty;
      subtotal += lineTotal;
      orderItems.push({
        product_id: v.product_id,
        variant_id: v.id,
        product_name: v.products?.name ?? "",
        variant_name: v.name,
        sku: v.sku,
        unit_price_cents: v.price_cents,
        quantity: qty,
        line_total_cents: lineTotal,
      });
      lineItems.push({
        variant_id: v.id,
        name: `${v.products?.name ?? ""} — ${v.name}`,
        unit_amount: v.price_cents,
        quantity: qty,
      });
    }

    const shippingCents = freeThreshold != null && subtotal >= freeThreshold ? 0 : shippingFlat;
    const total = subtotal + shippingCents;

    // ---- ordine pending
    const { data: order, error: oErr } = await admin
      .from("orders")
      .insert({
        email,
        phone: ship.phone,
        ship_first_name: ship.first_name,
        ship_last_name: ship.last_name,
        ship_line1: ship.line1,
        ship_line2: ship.line2,
        ship_city: ship.city,
        ship_postal_code: ship.postal_code,
        ship_province: ship.province,
        ship_country: ship.country,
        currency,
        subtotal_cents: subtotal,
        shipping_cents: shippingCents,
        total_cents: total,
      })
      .select("id, access_token")
      .single();
    if (oErr) throw oErr;

    const { error: oiErr } = await admin
      .from("order_items")
      .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));
    if (oiErr) throw oiErr;

    // ---- riserva stock in modo atomico (anti-overselling)
    const { data: reserved, error: rErr } = await admin.rpc("reserve_stock", {
      p_order_id: order.id,
    });
    if (rErr) throw rErr;
    if (reserved !== true) {
      await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      return json({ error: "L'ultimo pezzo è appena stato acquistato da un altro cliente." }, 409);
    }

    // ---- Stripe Checkout Session
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("customer_email", email);
    form.set("client_reference_id", order.id);
    form.set("success_url", `${siteUrl}/checkout/success?order=${order.access_token}`);
    form.set("cancel_url", `${siteUrl}/checkout/cancel?order=${order.access_token}`);
    form.set("metadata[order_id]", order.id);
    lineItems.forEach((li: any, i) => {
      form.set(`line_items[${i}][quantity]`, String(li.quantity));
      form.set(`line_items[${i}][price_data][currency]`, currency.toLowerCase());
      form.set(`line_items[${i}][price_data][unit_amount]`, String(li.unit_amount));
      form.set(`line_items[${i}][price_data][product_data][name]`, li.name);
    });
    if (shippingCents > 0) {
      form.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
      form.set("shipping_options[0][shipping_rate_data][display_name]", String(settings.shipping_label ?? "Spedizione"));
      form.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shippingCents));
      form.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", currency.toLowerCase());
    }

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": order.id,
      },
      body: form,
    });
    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe error", session?.error?.message);
      await admin.rpc("release_stock", { p_order_id: order.id });
      await admin.from("orders").update({ status: "payment_failed" }).eq("id", order.id);
      return json({ error: "Non è stato possibile avviare il pagamento." }, 502);
    }

    await admin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    await admin.from("payments").insert({
      order_id: order.id,
      provider: "stripe",
      status: "pending",
      amount_cents: total,
      currency,
      stripe_session_id: session.id,
    });

    return json({ url: session.url, order_token: order.access_token });
  } catch (e) {
    console.error("create-checkout-session failed", e);
    return json({ error: "Si è verificato un errore. Riprova tra poco." }, 500);
  }
});
