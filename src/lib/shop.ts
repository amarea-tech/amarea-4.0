import productConero from "@/assets/product-conero.jpg";
import productSibilla from "@/assets/product-sibilla.jpg";
import productCatria from "@/assets/product-catria.jpg";

/** Mappa chiave asset (colonna product_images.asset_key) -> immagine nel bundle. */
export const productAssets: Record<string, string> = {
  sibilla: productSibilla,
  conero: productConero,
  catria: productCatria,
};

export const resolveProductImage = (
  assetKey?: string | null,
  url?: string | null,
): string | undefined => (assetKey ? productAssets[assetKey] : undefined) ?? url ?? undefined;

export const formatCents = (cents: number, currency = "EUR") =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency }).format(cents / 100);
