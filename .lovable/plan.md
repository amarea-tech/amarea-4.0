# Report backend + piano di migrazione a Supabase self-managed

## 1. Backend attuale

Confermato: il progetto usa **Lovable Cloud** (istanza Supabase gestita da Lovable, `Managed by Lovable: true`, size Tiny, regione eu-central-1, non in pausa).

## 2. Inventario risorse backend

| Risorsa | Stato |
|---|---|
| Tabelle schema `public` | **Nessuna** (confermato anche da `src/integrations/supabase/types.ts`: `Tables: never`) |
| Views | Nessuna |
| Database functions | Nessuna |
| Triggers | Nessuna |
| RLS policies | Nessuna (non ci sono tabelle applicative) |
| Auth | Nessun utente registrato (0 righe in `auth.users`); nessun provider social configurato in uso; il frontend non chiama mai `signIn`/`signUp`/`getUser` |
| Storage buckets | 1: `database_export_29_08_26` (privato) |
| File in storage | 1: `amareacosmetics_260829.backup` (~230 KB, creato il 29/08/2026) — è un backup, non dato applicativo vivo |
| Edge Functions | 1: `newsletter-subscribe` |
| Migrations nel repo | Cartella `supabase/migrations/` vuota |

## 3. Edge Functions

### `newsletter-subscribe`
- **Sorgente nel repo**: `supabase/functions/newsletter-subscribe/index.ts` (presente e completa)
- **Servizi esterni**: Brevo, chiamato **non** direttamente ma via **Lovable Connector Gateway** (`https://connector-gateway.lovable.dev/brevo`)
- **Secrets richiesti**: `LOVABLE_API_KEY` (auth verso il gateway Lovable), `BREVO_API_KEY` (passata come header `X-Connection-Api-Key`)
- **Dipendenze Lovable**: **sì, forte** — il gateway `connector-gateway.lovable.dev` e `LOVABLE_API_KEY` sono servizi Lovable. Su Supabase self-managed vanno sostituiti con chiamate dirette a `https://api.brevo.com/v3` con header `api-key`.
- **Nessuna dipendenza dal database**: la funzione non scrive su Postgres, non usa service role key.

#### Flusso esatto verso Brevo
1. `OPTIONS` → risposta CORS.
2. Legge `LOVABLE_API_KEY` e `BREVO_API_KEY`; se mancano, errore.
3. Valida `email` (regex, max 255) e `consent` → 400 con messaggio italiano se non validi.
4. `POST {gateway}/brevo/contacts` con `listIds: [2]`, `updateEnabled: true`, attributi `OPT_IN`, `DOUBLE_OPT_IN:false`, `SOURCE: "amarea-website"`. Errore `duplicate_parameter` tollerato.
5. `POST {gateway}/brevo/smtp/email` — email di benvenuto all'utente, mittente `Amarea Cosmetics <newsletter@amareacosmetics.com>`. Fallimento non bloccante.
6. `POST {gateway}/brevo/smtp/email` — notifica interna a `sales@amareacosmetics.com` con email iscritto + timestamp Europe/Rome, `replyTo` = iscritto. Fallimento non bloccante.
7. Risposta `{"success": true}`. Errori interni mascherati con messaggio generico.

Nota: l'account Brevo risulta con **SMTP non attivato** (403), quindi gli step 5 e 6 falliscono oggi. Da risolvere lato Brevo indipendentemente dalla migrazione.

## 4. Dati persistenti da migrare
- Nessun dato applicativo (0 tabelle, 0 utenti).
- Unico oggetto: il file di backup in storage → si può scaricare e ricaricare a mano, oppure semplicemente conservare in locale.
- **Conclusione: migrazione a rischio molto basso.**

## 5. Riferimenti hardcoded al backend attuale
- `supabase/config.toml` → `project_id = "xbxymqccjlwldvxqiifm"`
- `.env` → `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (file auto-generato da Lovable)
- `src/integrations/supabase/client.ts` → legge solo le env, nessun URL hardcoded (buono)
- Nessun URL `*.supabase.co` hardcoded nel codice sorgente
- Punti di consumo del backend: solo 2 chiamate, entrambe `functions.invoke("newsletter-subscribe")` in `src/components/NewsletterBlock.tsx` e `src/components/PlantGrowthApp.tsx`

## 6. Piano di migrazione (da autorizzare)

**Fase 0 — Preparazione (nessun downtime)**
1. Crei il progetto Supabase nel tuo account con `a.manzella@pm.univpm.it`, regione eu-central-1.
2. Scarichi il file `amareacosmetics_260829.backup` dallo storage attuale come copia di sicurezza.
3. Recuperi dal tuo progetto: Project URL, anon/publishable key, service role key.

**Fase 1 — Collegamento**
4. Colleghi il progetto Supabase esterno da **Connectors → Supabase** in Lovable. Lovable rigenera `.env`, `client.ts` e `config.toml` verso il nuovo project ref.
5. Verifica che il sito continui a caricare (il frontend non dipende da DB/auth, quindi nessuna rottura attesa).

**Fase 2 — Schema e storage**
6. Nessuna tabella/policy da ricreare. Se in futuro servono, si parte da zero con migration + GRANT + RLS.
7. Opzionale: ricreare il bucket privato `database_export_29_08_26` e ricaricare il backup, oppure archiviarlo fuori dal cloud.

**Fase 3 — Edge Function (unico lavoro tecnico reale)**
8. Riscrivere `newsletter-subscribe` per chiamare Brevo direttamente:
   - endpoint `https://api.brevo.com/v3/contacts` e `https://api.brevo.com/v3/smtp/email`
   - header `api-key: ${BREVO_API_KEY}` al posto di `Authorization: Bearer LOVABLE_API_KEY` + `X-Connection-Api-Key`
   - rimuovere ogni riferimento a `connector-gateway.lovable.dev` e a `LOVABLE_API_KEY`
9. Impostare `BREVO_API_KEY` come secret nel nuovo progetto (chiave presa dal tuo account Brevo).
10. Deploy della funzione sul nuovo progetto e test: email non valida → 400; senza consenso → 400; caso valido → `{"success":true}` + notifica ricevuta su `sales@`.
11. Attivare l'SMTP Brevo (oggi bloccato a 403) o, in alternativa, sostituire Brevo con un provider a tua scelta.

**Fase 4 — Verifica e cutover**
12. Test sul preview: form "Lista prioritaria di lancio" in homepage e nella pagina Grow.
13. Pubblicazione. Il dominio e il resto del sito (statico) non sono toccati.
14. Dopo qualche giorno di stabilità, si può considerare chiuso il vecchio backend.

**Rischi**: minimi. L'unica funzionalità dinamica del sito è il form newsletter; il rischio è una finestra in cui il form fallisce se la funzione non è ancora deployata sul nuovo progetto. Mitigazione: fare Fase 3 subito dopo Fase 1, nella stessa sessione.

Nessuna modifica è stata eseguita: solo letture.
