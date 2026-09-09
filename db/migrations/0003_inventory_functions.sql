-- Amarea 4.0 — Gestione stock transazionale (FASE 2)
-- reserve_stock  : impegna i pezzi alla creazione dell'ordine (anti-overselling)
-- commit_stock   : scarica definitivamente il magazzino a pagamento confermato
-- release_stock  : libera l'impegno su annullamento / pagamento fallito
-- Tutte eseguibili SOLO da service_role (Edge Functions).

create or replace function public.reserve_stock(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  updated integer;
begin
  -- lock dell'ordine: evita doppie riserve sullo stesso ordine
  perform 1 from public.orders where id = p_order_id for update;

  if exists (select 1 from public.orders where id = p_order_id and stock_reserved) then
    return true;
  end if;

  for r in
    select variant_id, sum(quantity)::int as qty
    from public.order_items
    where order_id = p_order_id and variant_id is not null
    group by variant_id
    order by variant_id -- ordine deterministico: niente deadlock
  loop
    update public.inventory
       set reserved = reserved + r.qty
     where variant_id = r.variant_id
       and quantity - reserved >= r.qty;

    get diagnostics updated = row_count;
    if updated = 0 then
      -- stock insufficiente: annulla tutta la transazione
      raise exception using errcode = '23514',
        message = 'insufficient_stock:' || r.variant_id;
    end if;
  end loop;

  update public.orders set stock_reserved = true where id = p_order_id;
  return true;
exception
  when sqlstate '23514' then
    return false;
end;
$$;

create or replace function public.commit_stock(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  perform 1 from public.orders where id = p_order_id for update;

  if exists (select 1 from public.orders where id = p_order_id and stock_committed) then
    return true; -- idempotente
  end if;

  for r in
    select variant_id, sum(quantity)::int as qty
    from public.order_items
    where order_id = p_order_id and variant_id is not null
    group by variant_id
    order by variant_id
  loop
    update public.inventory
       set quantity = quantity - r.qty,
           reserved = greatest(reserved - r.qty, 0)
     where variant_id = r.variant_id
       and quantity >= r.qty;
    if not found then
      raise exception 'stock_commit_failed:%', r.variant_id;
    end if;
  end loop;

  update public.orders
     set stock_committed = true, stock_reserved = false
   where id = p_order_id;
  return true;
end;
$$;

create or replace function public.release_stock(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  perform 1 from public.orders where id = p_order_id for update;

  if not exists (select 1 from public.orders where id = p_order_id and stock_reserved) then
    return true; -- idempotente
  end if;

  for r in
    select variant_id, sum(quantity)::int as qty
    from public.order_items
    where order_id = p_order_id and variant_id is not null
    group by variant_id
    order by variant_id
  loop
    update public.inventory
       set reserved = greatest(reserved - r.qty, 0)
     where variant_id = r.variant_id;
  end loop;

  update public.orders set stock_reserved = false where id = p_order_id;
  return true;
end;
$$;

revoke all on function public.reserve_stock(uuid) from public, anon, authenticated;
revoke all on function public.commit_stock(uuid)  from public, anon, authenticated;
revoke all on function public.release_stock(uuid) from public, anon, authenticated;
grant execute on function public.reserve_stock(uuid)  to service_role;
grant execute on function public.commit_stock(uuid)   to service_role;
grant execute on function public.release_stock(uuid)  to service_role;
