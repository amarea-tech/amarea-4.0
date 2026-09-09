// Tipi dello schema ecommerce (progetto Supabase esterno).
// Il file generato `types.ts` è gestito dalla piattaforma e oggi non riflette
// ancora lo schema: finché le migration non sono applicate e i tipi rigenerati,
// queste definizioni sono la fonte di verità per il frontend.

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "payment_failed"
  | "refunded";

export type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled" | "refunded";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  seo_description: string | null;
  badge_label: string | null;
  active: boolean;
  purchasable: boolean;
  sort_order: number;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_cents: number;
  currency: string;
  active: boolean;
  sort_order: number;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  asset_key: string | null;
  url: string | null;
  alt: string | null;
  sort_order: number;
};

export type VariantAvailabilityRow = {
  variant_id: string;
  product_id: string;
  available: number;
  in_stock: boolean;
};

export type StoreSettingRow = { key: string; value: unknown };

export type StoreSettings = {
  currency: string;
  shipping_flat_cents: number;
  free_shipping_threshold_cents: number | null;
  shipping_countries: string[];
  shipping_label: string;
  store_open: boolean;
};

export type OrderSummary = {
  order_number: number;
  status: OrderStatus;
  email: string;
  currency: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  created_at: string;
  shipping: {
    first_name: string;
    last_name: string;
    line1: string;
    line2: string | null;
    city: string;
    postal_code: string;
    province: string | null;
    country: string;
  };
  items: Array<{
    product_name: string;
    variant_name: string;
    sku: string;
    unit_price_cents: number;
    quantity: number;
    line_total_cents: number;
  }>;
};
