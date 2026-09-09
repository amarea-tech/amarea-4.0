-- Amarea 4.0 — Schema ecommerce (FASE 1)
-- Prezzi sempre in centesimi interi. Nessun floating point.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums
do $$ begin
  create type public.order_status as enum (
    'pending','paid','processing','shipped','delivered',
    'cancelled','payment_failed','refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'pending','succeeded','failed','cancelled','refunded'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------- store_settings
-- Ogni valore configurabile del negozio (spedizione, valuta, soglie, paesi).
create table if not exists public.store_settings (
  key         text primary key,
  value       jsonb not null,
  description text,
  updated_at  timestamptz not null default now()
);
grant select on public.store_settings to anon, authenticated;
grant all on public.store_settings to service_role;
alter table public.store_settings enable row level security;

-- ---------------------------------------------------------------- products
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  subtitle        text,
  description     text,
  seo_description text,
  badge_label     text,
  active          boolean not null default false,
  purchasable     boolean not null default false,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;

-- -------------------------------------------------------- product_variants
create table if not exists public.product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  name        text not null,
  sku         text not null unique,
  price_cents integer not null check (price_cents >= 0),
  currency    text not null default 'EUR',
  active      boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists product_variants_product_id_idx on public.product_variants(product_id);
grant select on public.product_variants to anon, authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;

-- ---------------------------------------------------------- product_images
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  -- chiave dell'asset già presente nel frontend (es. 'conero') oppure URL assoluto
  asset_key  text,
  url        text,
  alt        text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (asset_key is not null or url is not null)
);
create index if not exists product_images_product_id_idx on public.product_images(product_id);
grant select on public.product_images to anon, authenticated;
grant all on public.product_images to service_role;
alter table public.product_images enable row level security;

-- --------------------------------------------------------------- inventory
-- quantity = pezzi fisici a magazzino. reserved = impegnati da ordini pending.
create table if not exists public.inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  quantity   integer not null default 0 check (quantity >= 0),
  reserved   integer not null default 0 check (reserved >= 0),
  updated_at timestamptz not null default now(),
  constraint inventory_reserved_le_quantity check (reserved <= quantity)
);
-- nessun accesso client diretto: la disponibilità passa dalla view pubblica
grant all on public.inventory to service_role;
alter table public.inventory enable row level security;

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  first_name text,
  last_name  text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- --------------------------------------------------------------- addresses
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  line1       text not null,
  line2       text,
  city        text not null,
  postal_code text not null,
  province    text,
  country     text not null default 'IT',
  phone       text,
  created_at  timestamptz not null default now()
);
create index if not exists addresses_user_id_idx on public.addresses(user_id);
grant select, insert, update, delete on public.addresses to authenticated;
grant all on public.addresses to service_role;
alter table public.addresses enable row level security;

-- ------------------------------------------------------------------- carts
create table if not exists public.carts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  cart_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.carts to authenticated;
grant all on public.carts to service_role;
alter table public.carts enable row level security;

create table if not exists public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  cart_id    uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity   integer not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);
create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);
grant select, insert, update, delete on public.cart_items to authenticated;
grant all on public.cart_items to service_role;
alter table public.cart_items enable row level security;

-- ------------------------------------------------------------------ orders
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      bigint generated by default as identity,
  user_id           uuid references auth.users(id) on delete set null,
  access_token      uuid not null default gen_random_uuid() unique,
  status            public.order_status not null default 'pending',
  email             text not null,
  phone             text,
  ship_first_name   text not null,
  ship_last_name    text not null,
  ship_line1        text not null,
  ship_line2        text,
  ship_city         text not null,
  ship_postal_code  text not null,
  ship_province     text,
  ship_country      text not null default 'IT',
  currency          text not null default 'EUR',
  subtotal_cents    integer not null check (subtotal_cents >= 0),
  shipping_cents    integer not null default 0 check (shipping_cents >= 0),
  total_cents       integer not null check (total_cents >= 0),
  stock_reserved    boolean not null default false,
  stock_committed   boolean not null default false,
  stripe_session_id text unique,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;

-- ------------------------------------------------------------- order_items
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  product_id       uuid references public.products(id) on delete set null,
  variant_id       uuid references public.product_variants(id) on delete set null,
  product_name     text not null,
  variant_name     text not null,
  sku              text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity         integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  created_at       timestamptz not null default now()
);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
grant select on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;

-- ---------------------------------------------------------------- payments
create table if not exists public.payments (
  id                       uuid primary key default gen_random_uuid(),
  order_id                 uuid not null references public.orders(id) on delete cascade,
  provider                 text not null default 'stripe',
  status                   public.payment_status not null default 'pending',
  amount_cents             integer not null check (amount_cents >= 0),
  currency                 text not null default 'EUR',
  stripe_session_id        text,
  stripe_payment_intent_id text,
  raw                      jsonb,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index if not exists payments_order_id_idx on public.payments(order_id);
grant all on public.payments to service_role;
alter table public.payments enable row level security;

-- ----------------------------------------------------------- stripe_events
create table if not exists public.stripe_events (
  id           text primary key,
  type         text not null,
  processed_at timestamptz not null default now()
);
grant all on public.stripe_events to service_role;
alter table public.stripe_events enable row level security;

-- --------------------------------------------------------------- updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'store_settings','products','product_variants','inventory',
    'profiles','carts','orders','payments'
  ] loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; '
      'create trigger set_updated_at before update on public.%I '
      'for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;
