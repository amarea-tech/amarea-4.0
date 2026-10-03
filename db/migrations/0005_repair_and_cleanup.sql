-- Amarea 4.0 — Pulizia ordini di prova + ripristino catalogo/magazzino
-- ATTENZIONE: cancella TUTTI gli ordini, pagamenti ed eventi Stripe.
-- Lanciare solo finché il negozio non ha ordini reali.
-- Non tocca la newsletter né nessuna tabella fuori dal negozio.

begin;

-- ------------------------------------------------ 1. cancella dati di prova
delete from public.stripe_events;
delete from public.payments;
delete from public.order_items;
delete from public.orders;
delete from public.cart_items;
delete from public.carts;

-- ------------------------------------------- 2. impostazioni negozio mancanti
insert into public.store_settings (key, value, description) values
  ('currency',                      '"EUR"'::jsonb,  'Valuta del negozio'),
  ('shipping_flat_cents',           '590'::jsonb,    'Costo di spedizione fisso in centesimi'),
  ('free_shipping_threshold_cents', 'null'::jsonb,   'Soglia per spedizione gratuita (null = disattivata)'),
  ('shipping_countries',            '["IT"]'::jsonb, 'Paesi di spedizione ammessi'),
  ('shipping_label',                '"Spedizione in Italia"'::jsonb, 'Etichetta mostrata al checkout'),
  ('store_open',                    'true'::jsonb,   'Se false il checkout è disabilitato'),
  ('site_url',                      '"https://amareacosmetics.com"'::jsonb, 'URL usato per i ritorni da Stripe')
on conflict (key) do nothing;

-- ------------------------------------------------------- 3. prodotti mancanti
insert into public.products
  (slug, name, subtitle, description, seo_description, badge_label, active, purchasable, sort_order)
values
  ('sibilla', 'Sibilla', 'Anti-Age Cream',
   'Formulata con attivi rigeneranti derivati da fiori di zafferano e vinacce selezionate. Aiuta a contrastare i segni del tempo.',
   'Sibilla è la crema viso anti-età di Amarea Cosmetics, formulata con attivi rigeneranti derivati da fiori di zafferano e vinacce marchigiane selezionate tramite upcycling. Parte della collezione Monti Italiani, sviluppata dal team di ricerca dell''Università Politecnica delle Marche.',
   null, true, true, 1),
  ('conero', 'Conero', 'Purifying Face Cream',
   'Con foglie di ulivo e attivi riequilibranti, aiuta a purificare la pelle e regolare l''eccesso di sebo.',
   'Conero è la crema viso purificante di Amarea Cosmetics, formulata con foglie di ulivo e attivi botanici riequilibranti per aiutare a purificare la pelle e regolare l''eccesso di sebo. Parte della collezione Monti Italiani, ispirata al territorio marchigiano.',
   'Prossimamente ✨', true, false, 2),
  ('catria', 'Catria', 'Nourishing Face Cream',
   'Nutre e idrata grazie a una formulazione leggera arricchita con bioresidui del caffè.',
   'Catria è la crema viso nutriente di Amarea Cosmetics, formulata con bioresidui del caffè per un''idratazione ricca ma leggera. Parte della collezione Monti Italiani, ispirata alle vette dell''Appennino marchigiano.',
   'Prossimamente ✨', true, false, 3)
on conflict (slug) do nothing;

insert into public.product_images (product_id, asset_key, alt, sort_order)
select p.id, p.slug, 'Crema viso ' || p.name || ' — ' || coalesce(p.subtitle, ''), 1
from public.products p
where p.slug in ('sibilla','conero','catria')
  and not exists (select 1 from public.product_images i where i.product_id = p.id);

insert into public.product_variants (product_id, name, sku, price_cents, currency, active, sort_order)
select p.id, '50 ml', 'SIB-50', 4990, 'EUR', true, 1
from public.products p
where p.slug = 'sibilla'
on conflict (sku) do nothing;

-- ------------------------------------------------------------ 4. magazzino
-- Ricrea la riga di magazzino mancante per ogni variante (Sibilla 10, altre 0).
insert into public.inventory (variant_id, quantity, reserved)
select v.id, case when v.sku = 'SIB-50' then 10 else 0 end, 0
from public.product_variants v
on conflict (variant_id) do nothing;

-- Nessun ordine esiste più: nessun pezzo deve risultare impegnato.
update public.inventory set reserved = 0 where reserved <> 0;

commit;

-- --------------------------------------------------------- 5. verifica finale
select p.slug, p.active, p.purchasable, v.sku, v.price_cents, v.active as variant_active,
       i.quantity, i.reserved
from public.products p
left join public.product_variants v on v.product_id = p.id
left join public.inventory i on i.variant_id = v.id
order by p.sort_order;
select key, value from public.store_settings order by key;
