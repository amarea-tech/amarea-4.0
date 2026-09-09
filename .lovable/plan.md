# Amarea 4.0 — Ecommerce reale su Supabase esterno

Base: il sito attuale resta com'è. Aggiungiamo carrello, checkout e pagamenti Stripe sopra il design esistente. La newsletter Brevo non viene toccata.

## Cosa cambia per chi visita il sito

- **Sibilla** diventa acquistabile: prezzo 49,90 €, pulsante "Aggiungi al carrello" nella sua pagina.
- **Conero** e **Catria** restano come oggi, "Prossimamente", non acquistabili.
- Nuova icona carrello nella barra in alto, con pannello laterale: modifica quantità, rimuovi, subtotale.
- Nuova pagina di checkout (stessa grafica del sito): email, nome, cognome, indirizzo, città, CAP, provincia, paese, telefono opzionale.
- Spedizione a costo fisso Italia (imposto 5,90 € — dimmi se preferisci un altro importo).
- Pagamento su Stripe, poi ritorno su una pagina "Grazie" o "Pagamento annullato".
- Acquisto da ospite: nessun account richiesto.

## Assunzioni da confermare

- Sibilla: formato 50 ml, codice articolo `SIB-50`, stock iniziale da indicare.
- Spedizione fissa 5,90 €, solo Italia.
- Valuta EUR, prezzi IVA inclusa.

## Fasi

1. **Database** — migration SQL versionate nel repository.
2. **Sicurezza (RLS)** — catalogo attivo pubblico, ordini e carrelli isolati, prezzi/stock/pagamenti non modificabili dal browser.
3. **Seed catalogo** — i tre prodotti attuali entrano nel database mantenendo gli slug `sibilla`, `conero`, `catria` e le immagini già presenti. Solo Sibilla con variante acquistabile.
4. **Catalogo dal database** — `ProductPage` legge prezzo e disponibilità da Supabase, con i contenuti attuali come fallback: nessun link si rompe.
5. **Carrello** — nuovo contesto carrello + pannello laterale, in stile Amarea.
6. **Ordini** — creazione ordine lato server.
7. **Stripe Checkout** — Edge Function dedicata.
8. **Webhook Stripe** — Edge Function separata, idempotente.
9. **Pagine esito** — `/checkout/success`, `/checkout/cancel`.
10. **Test end-to-end** — inclusi stock esaurito, prodotto inattivo, acquisto concorrente, pagamento fallito, accesso non autorizzato agli ordini.

## Dettagli tecnici

### Migration (in `supabase/migrations/`)

- `0001_ecommerce_schema.sql`: `products`, `product_variants`, `product_images`, `inventory`, `profiles`, `addresses`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `stripe_events`, più gli enum `order_status` (`pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `payment_failed`, `refunded`) e `payment_status`. GRANT espliciti per `anon`/`authenticated`/`service_role` su ogni tabella nuova, coerenti con le policy.
- `0002_rls_policies.sql`: RLS attiva ovunque.
  - `products`/`product_variants`/`product_images`: SELECT pubblico solo dove `active = true`.
  - `inventory`: nessun accesso client diretto; disponibilità esposta da una view/RPC che restituisce solo "disponibile sì/no" e quantità.
  - `carts`/`cart_items`: accesso per `auth.uid()` oppure per `cart_token` anonimo passato via RPC; nessuna scrittura di prezzi.
  - `orders`/`order_items`/`payments`: nessun accesso client in scrittura; lettura solo del proprio ordine (utente autenticato) o tramite token ordine monouso restituito dopo il pagamento.
  - service_role riservato alle Edge Functions.
- `0003_inventory_functions.sql`: funzioni `security definer`
  - `reserve_stock(items jsonb)` — decremento atomico con `UPDATE ... SET qty = qty - n WHERE qty >= n` in singola transazione, `CHECK (quantity >= 0)`: niente stock negativo, niente overselling in concorrenza.
  - `release_stock(order_id)` per annullamenti/fallimenti.
- `0004_seed_catalog.sql`: i tre prodotti, immagini, variante Sibilla 49,90 € (`price_cents = 4990`), inventario iniziale.

Prezzi sempre in centesimi interi. `order_items` conserva snapshot: `product_id`, `variant_id`, `product_name`, `variant_name`, `sku`, `unit_price_cents`, `quantity`, `line_total_cents`. `orders` conserva email, dati di spedizione denormalizzati, `shipping_cents`, `subtotal_cents`, `total_cents`, `currency`.

### Edge Functions (nuove, `newsletter-subscribe` intatta)

- `create-checkout-session`: riceve solo `variant_id` + quantità e i dati di spedizione. Rilegge prezzi e stato attivo dal database, verifica stock, calcola totale e spedizione server-side, crea ordine `pending`, crea la Stripe Checkout Session con i prezzi calcolati, restituisce l'URL. Il prezzo inviato dal browser viene ignorato.
- `stripe-webhook`: verifica firma con `STRIPE_WEBHOOK_SECRET`, inserisce l'`event.id` in `stripe_events` con vincolo unico (idempotenza), poi su `checkout.session.completed` riserva/decrementa stock e porta ordine a `paid`; su `payment_intent.payment_failed`/`checkout.session.expired` porta a `payment_failed`/`cancelled` e rilascia le riserve. Deployata con verifica JWT disabilitata.

### Frontend

Nuovi: `src/context/CartContext.tsx`, `src/components/CartDrawer.tsx`, `src/components/AddToCartButton.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/CheckoutSuccess.tsx`, `src/pages/CheckoutCancel.tsx`, `src/hooks/useCatalog.ts`.
Modificati (al minimo): `src/App.tsx` (nuove rotte + provider), `src/components/Navbar.tsx` (icona carrello), `src/pages/ProductPage.tsx` (prezzo e acquisto da database, contenuti attuali invariati).
`src/integrations/supabase/types.ts` rigenerato sul nuovo schema.

### Segreti da configurare (lato server, mai nel frontend)

`STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`. Te li chiederò con il modulo sicuro al momento giusto, dopo aver creato la funzione webhook così avrai l'URL da incollare in Stripe.

### Vincoli rispettati

Nessun Lovable Cloud, nessun nuovo progetto Supabase, `newsletter-subscribe` e Brevo intoccati, nessuna cancellazione di dati o funzionalità esistenti, nessun URL prodotto rotto.
