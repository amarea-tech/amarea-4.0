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

## Frontend negozio (fatto)
- Carrello globale (CartProvider + drawer) con quantità e totali calcolati da prezzi DB
- Icona carrello in navbar con contatore
- Pagina prodotto: prezzo, varianti, disponibilità e "Aggiungi al carrello" solo se il prodotto è acquistabile a DB
- Pagine /checkout, /checkout/success, /checkout/cancel (guest checkout, indirizzo, riepilogo)
- src/lib/shopClient.ts: letture catalogo/impostazioni/ordine; src/integrations/supabase/shopTypes.ts: tipi schema

## Ancora bloccato
- Le migration in db/migrations/ NON sono applicate: il progetto Supabase esterno non è raggiungibile dagli strumenti e supabase/migrations/ è gestito dalla piattaforma.
- Secrets Stripe (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) e deploy delle due Edge Function da fare.
- Rigenerazione di src/integrations/supabase/types.ts dopo l'applicazione dello schema.
