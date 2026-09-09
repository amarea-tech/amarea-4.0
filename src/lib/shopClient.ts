import { supabase } from "@/integrations/supabase/client";
import type {
  ProductImageRow,
  ProductRow,
  ProductVariantRow,
  StoreSettingRow,
  StoreSettings,
  VariantAvailabilityRow,
} from "@/integrations/supabase/shopTypes";

/**
 * Il client generato è tipizzato su uno schema ancora vuoto: qui lo usiamo in
 * modo non tipizzato e riportiamo i tipi reali dello schema ecommerce.
 */
const db = supabase as unknown as {
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: any; error: any }>;
  functions: typeof supabase.functions;
};

export type CatalogProduct = ProductRow & {
  images: ProductImageRow[];
  variants: (ProductVariantRow & { available: number })[];
};

export const fetchStoreSettings = async (): Promise<StoreSettings> => {
  const { data, error } = await db.from("store_settings").select("key, value");
  if (error) throw error;
  const map = new Map((data as StoreSettingRow[]).map((r) => [r.key, r.value]));
  return {
    currency: (map.get("currency") as string) ?? "EUR",
    shipping_flat_cents: Number(map.get("shipping_flat_cents") ?? 0),
    free_shipping_threshold_cents:
      map.get("free_shipping_threshold_cents") == null
        ? null
        : Number(map.get("free_shipping_threshold_cents")),
    shipping_countries: (map.get("shipping_countries") as string[]) ?? ["IT"],
    shipping_label: (map.get("shipping_label") as string) ?? "Spedizione",
    store_open: map.get("store_open") !== false,
  };
};

const withAvailability = async (products: CatalogProduct[]) => {
  const { data } = await db.from("variant_availability").select("variant_id, available");
  const avail = new Map(
    ((data ?? []) as VariantAvailabilityRow[]).map((r) => [r.variant_id, r.available]),
  );
  products.forEach((p) =>
    p.variants.forEach((v) => {
      v.available = avail.get(v.id) ?? 0;
    }),
  );
  return products;
};

const selectProducts = `
  id, slug, name, subtitle, description, seo_description, badge_label,
  active, purchasable, sort_order,
  images:product_images(id, product_id, asset_key, url, alt, sort_order),
  variants:product_variants(id, product_id, name, sku, price_cents, currency, active, sort_order)
`;

export const fetchCatalog = async (): Promise<CatalogProduct[]> => {
  const { data, error } = await db
    .from("products")
    .select(selectProducts)
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return withAvailability((data ?? []) as CatalogProduct[]);
};

export const fetchProductBySlug = async (slug: string): Promise<CatalogProduct | null> => {
  const { data, error } = await db
    .from("products")
    .select(selectProducts)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [product] = await withAvailability([data as CatalogProduct]);
  return product;
};

export const fetchVariantsByIds = async (ids: string[]) => {
  if (ids.length === 0) return [];
  const { data, error } = await db
    .from("product_variants")
    .select(
      "id, product_id, name, sku, price_cents, currency, active, sort_order, products(name, slug, active)",
    )
    .in("id", ids);
  if (error) throw error;
  const { data: avail } = await db
    .from("variant_availability")
    .select("variant_id, available")
    .in("variant_id", ids);
  const availMap = new Map(
    ((avail ?? []) as VariantAvailabilityRow[]).map((r) => [r.variant_id, r.available]),
  );
  return ((data ?? []) as any[]).map((v) => ({
    id: v.id as string,
    product_id: v.product_id as string,
    product_name: v.products?.name as string,
    product_slug: v.products?.slug as string,
    name: v.name as string,
    sku: v.sku as string,
    price_cents: v.price_cents as number,
    currency: v.currency as string,
    active: Boolean(v.active) && Boolean(v.products?.active),
    available: availMap.get(v.id) ?? 0,
  }));
};

export type CartLine = Awaited<ReturnType<typeof fetchVariantsByIds>>[number] & {
  quantity: number;
};

export const fetchOrderByToken = async (token: string) => {
  const { data, error } = await db.rpc("get_order_by_token", { p_token: token });
  if (error) throw error;
  return data ?? null;
};
