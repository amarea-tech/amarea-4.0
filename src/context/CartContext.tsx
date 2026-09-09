import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings, fetchVariantsByIds, type CartLine } from "@/lib/shopClient";

const STORAGE_KEY = "amarea.cart.v1";

type StoredItem = { variant_id: string; quantity: number };

type CartContextValue = {
  items: StoredItem[];
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  loading: boolean;
  storeOpen: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const readStorage = (): StoredItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (i) => typeof i?.variant_id === "string" && Number.isInteger(i?.quantity) && i.quantity > 0,
        )
      : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<StoredItem[]>(readStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const ids = useMemo(() => items.map((i) => i.variant_id).sort(), [items]);

  const { data: variants = [], isLoading } = useQuery({
    queryKey: ["cart-variants", ids],
    queryFn: () => fetchVariantsByIds(ids),
    enabled: ids.length > 0,
    staleTime: 30_000,
  });

  const { data: settings } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchStoreSettings,
    staleTime: 5 * 60_000,
  });

  const lines: CartLine[] = useMemo(
    () =>
      items
        .map((item) => {
          const v = variants.find((x) => x.id === item.variant_id);
          return v ? { ...v, quantity: item.quantity } : null;
        })
        .filter(Boolean) as CartLine[],
    [items, variants],
  );

  const subtotalCents = lines.reduce((sum, l) => sum + l.price_cents * l.quantity, 0);
  const threshold = settings?.free_shipping_threshold_cents ?? null;
  const shippingCents =
    lines.length === 0
      ? 0
      : threshold != null && subtotalCents >= threshold
        ? 0
        : (settings?.shipping_flat_cents ?? 0);

  const add = useCallback((variantId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variant_id === variantId);
      if (existing) {
        return prev.map((i) =>
          i.variant_id === variantId ? { ...i, quantity: Math.min(i.quantity + quantity, 99) } : i,
        );
      }
      return [...prev, { variant_id: variantId, quantity: Math.min(quantity, 99) }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.variant_id !== variantId)
        : prev.map((i) =>
            i.variant_id === variantId ? { ...i, quantity: Math.min(quantity, 99) } : i,
          ),
    );
  }, []);

  const remove = useCallback(
    (variantId: string) => setItems((prev) => prev.filter((i) => i.variant_id !== variantId)),
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value: CartContextValue = {
    items,
    lines,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    currency: settings?.currency ?? "EUR",
    loading: isLoading,
    storeOpen: settings?.store_open ?? true,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    add,
    setQuantity,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve essere usato dentro CartProvider");
  return ctx;
};
