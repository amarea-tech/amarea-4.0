// Amarea 4.0 — Stripe webhook (unica fonte di verità sul pagamento)
// Verifica la firma, è idempotente, aggiorna pagamento/ordine/stock.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const encoder = new TextEncoder();

async function verifyStripeSignature(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((p) => p.split("=") as [string, string]),
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  // rifiuta eventi più vecchi di 5 minuti (replay protection)
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !supabaseUrl || !serviceKey) {
    console.error("Missing environment configuration");
    return new Response("Server misconfigured", { status: 500 });
  }

  const payload = await req.text();
  const sigHeader = req.headers.get("stripe-signature") ?? "";
  if (!(await verifyStripeSignature(payload, sigHeader, secret))) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(payload);
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // idempotenza: l'id evento è chiave primaria
  const { error: dupErr } = await admin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });
  if (dupErr) {
    if (dupErr.code === "23505") return new Response("Already processed", { status: 200 });
    console.error("stripe_events insert failed", dupErr);
    return new Response("Storage error", { status: 500 });
  }

  try {
    const object = event.data?.object ?? {};
    const orderId: string | undefined = object.metadata?.order_id ?? object.client_reference_id;

    switch (event.type) {
      case "checkout.session.completed": {
        if (!orderId) break;
        if (object.payment_status !== "paid") break;

        // conferma stock in modo atomico e transazionale
        const { error: commitErr } = await admin.rpc("commit_stock", { p_order_id: orderId });
        if (commitErr) throw commitErr;

        await admin
          .from("orders")
          .update({ status: "paid" })
          .eq("id", orderId)
          .eq("status", "pending");

        await admin
          .from("payments")
          .update({
            status: "succeeded",
            stripe_payment_intent_id: object.payment_intent ?? null,
            raw: object,
          })
          .eq("order_id", orderId);
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
      case "payment_intent.payment_failed": {
        let id = orderId;
        if (!id && object.id) {
          const { data } = await admin
            .from("payments")
            .select("order_id")
            .or(`stripe_session_id.eq.${object.id},stripe_payment_intent_id.eq.${object.id}`)
            .maybeSingle();
          id = data?.order_id;
        }
        if (!id) break;

        await admin.rpc("release_stock", { p_order_id: id });
        await admin
          .from("orders")
          .update({ status: event.type === "checkout.session.expired" ? "cancelled" : "payment_failed" })
          .eq("id", id)
          .eq("status", "pending");
        await admin
          .from("payments")
          .update({
            status: event.type === "checkout.session.expired" ? "cancelled" : "failed",
            raw: object,
          })
          .eq("order_id", id);
        break;
      }

      case "charge.refunded": {
        const pi = object.payment_intent;
        if (!pi) break;
        const { data: payment } = await admin
          .from("payments")
          .select("order_id")
          .eq("stripe_payment_intent_id", pi)
          .maybeSingle();
        if (!payment) break;
        await admin.from("payments").update({ status: "refunded", raw: object }).eq("order_id", payment.order_id);
        await admin.from("orders").update({ status: "refunded" }).eq("id", payment.order_id);
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.error("webhook handling failed", event.type, e);
    // rimuovi il marcatore così Stripe può ritentare l'evento
    await admin.from("stripe_events").delete().eq("id", event.id);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
