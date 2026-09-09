# Amarea 4.0 — Ecommerce roadmap

## Vincoli
- Solo Supabase esterno (`cgjzoktwcblrdwasakxw`). No Lovable Cloud.
- `supabase/functions/newsletter-subscribe` e Brevo: intoccabili.
- Nessun valore hardcodato nel codice: prezzi, stock, spedizione, disponibilità e testi commerciali vivono nel database (`store_settings`, `products`, `product_variants`, `inventory`).

## Fasi
- [x] FASE 1 — Schema database + migration versionate
- [x] FASE 2 — RLS e funzioni sicure (stock atomico)
- [x] FASE 3 — Seed catalogo esistente (slug invariati)
- [x] FASE 4 — Catalogo frontend da Supabase
- [x] FASE 5 — Carrello
- [x] FASE 6 — Creazione ordini server-side
- [x] FASE 7 — Stripe Checkout (edge function)
- [x] FASE 8 — Stripe webhook idempotente
- [x] FASE 9 — Pagine success/cancel
- [ ] FASE 10 — Test end-to-end (bloccato: richiede migration applicate + secrets Stripe)

## Aperti / bloccati
- Applicazione delle migration sul progetto Supabase esterno (nessun accesso DDL dall'agente).
- Deploy delle due nuove Edge Functions.
- Secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
