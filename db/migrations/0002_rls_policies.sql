-- Amarea 4.0 — RLS (FASE 2)
-- Regola generale: il client legge solo il catalogo attivo e i propri dati.
-- Ordini, pagamenti, inventario e prezzi si scrivono solo da Edge Function
-- (service_role), mai dal browser.

-- ------------------------------------------------------------- catalogo
drop policy if exists "public read active products" on public.products;
create policy "public read active products"
on public.products for select
to anon, authenticated
using (active = true);

drop policy if exists "public read active variants" on public.product_variants;
create policy "public read active variants"
on public.product_variants for select
to anon, authenticated
using (
  active = true
  and exists (select 1 from public.products p where p.id = product_id and p.active)
);

drop policy if exists "public read images of active products" on public.product_images;
create policy "public read images of active products"
on public.product_images for select
to anon, authenticated
using (exists (select 1 from public.products p where p.id = product_id and p.active));

drop policy if exists "public read store settings" on public.store_settings;
create policy "public read store settings"
on public.store_settings for select
to anon, authenticated
using (key in (
  'currency','shipping_flat_cents','free_shipping_threshold_cents',
  'shipping_countries','shipping_label','store_open'
));

-- inventory: nessuna policy => nessun accesso ai client. Solo service_role.

-- ------------------------------------------------- disponibilità pubblica
-- Espone solo la quantità disponibile, non i movimenti di magazzino.
create or replace view public.variant_availability
with (security_invoker = false) as
select
  v.id                              as variant_id,
  v.product_id,
  greatest(coalesce(i.quantity, 0) - coalesce(i.reserved, 0), 0) as available,
  (greatest(coalesce(i.quantity, 0) - coalesce(i.reserved, 0), 0) > 0) as in_stock
from public.product_variants v
left join public.inventory i on i.variant_id = v.id
join public.products p on p.id = v.product_id
where v.active and p.active;

grant select on public.variant_availability to anon, authenticated;

-- ------------------------------------------------------------- profiles
drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles for select
to authenticated using (id = auth.uid());

drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert
to authenticated with check (id = auth.uid());

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update
to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- ------------------------------------------------------------ addresses
drop policy if exists "own addresses" on public.addresses;
create policy "own addresses" on public.addresses for all
to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------- carts
drop policy if exists "own cart" on public.carts;
create policy "own cart" on public.carts for all
to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own cart items" on public.cart_items;
create policy "own cart items" on public.cart_items for all
to authenticated
using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

-- --------------------------------------------------------------- orders
-- Sola lettura, solo i propri. Nessun INSERT/UPDATE/DELETE dal client:
-- gli ordini nascono e cambiano stato solo tramite Edge Function.
drop policy if exists "own orders read" on public.orders;
create policy "own orders read" on public.orders for select
to authenticated using (user_id = auth.uid());

drop policy if exists "own order items read" on public.order_items;
create policy "own order items read" on public.order_items for select
to authenticated
using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- payments e stripe_events: nessuna policy => solo service_role.

-- ------------------------------------------- lettura ordine guest via token
-- Il cliente non autenticato consulta il proprio ordine solo con il token
-- monouso restituito da Stripe nella success page.
create or replace function public.get_order_by_token(p_token uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'order_number',   o.order_number,
    'status',         o.status,
    'email',          o.email,
    'currency',       o.currency,
    'subtotal_cents', o.subtotal_cents,
    'shipping_cents', o.shipping_cents,
    'total_cents',    o.total_cents,
    'created_at',     o.created_at,
    'shipping', jsonb_build_object(
      'first_name',  o.ship_first_name,
      'last_name',   o.ship_last_name,
      'line1',       o.ship_line1,
      'line2',       o.ship_line2,
      'city',        o.ship_city,
      'postal_code', o.ship_postal_code,
      'province',    o.ship_province,
      'country',     o.ship_country
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_name',     i.product_name,
        'variant_name',     i.variant_name,
        'sku',              i.sku,
        'unit_price_cents', i.unit_price_cents,
        'quantity',         i.quantity,
        'line_total_cents', i.line_total_cents
      ) order by i.created_at)
      from public.order_items i where i.order_id = o.id
    ), '[]'::jsonb)
  )
  from public.orders o
  where o.access_token = p_token;
$$;

revoke all on function public.get_order_by_token(uuid) from public;
grant execute on function public.get_order_by_token(uuid) to anon, authenticated;
