"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProductOffer } from "@/types/product";

const STORAGE_KEY = "compare10-basket";

export function useBasket() {
  const [items, setItems] = useState<ProductOffer[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProductOffer[];
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setItems([]);
    }
  }, []);

  const persist = useCallback((next: ProductOffer[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback(
    (offer: ProductOffer) => {
      persist([...items, { ...offer }]);
    },
    [items, persist]
  );

  const remove = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  const clear = useCallback(() => persist([]), [persist]);

  const totalByProvider = items.reduce(
    (acc, item) => {
      const p = item.provider;
      const total = item.price + (item.deliveryFee ?? 0);
      if (!acc[p]) acc[p] = { subtotal: 0, delivery: 0, count: 0 };
      acc[p].subtotal += item.price;
      acc[p].delivery = Math.max(acc[p].delivery, item.deliveryFee ?? 0);
      acc[p].count += 1;
      return acc;
    },
    {} as Record<string, { subtotal: number; delivery: number; count: number }>
  );

  const totals = Object.entries(totalByProvider).map(([provider, data]) => ({
    provider,
    subtotal: data.subtotal,
    delivery: data.delivery,
    total: data.subtotal + data.delivery,
    count: data.count,
  }));

  const cheapest = totals.length
    ? totals.reduce((a, b) => (a.total < b.total ? a : b))
    : null;

  return { items, add, remove, clear, totals, cheapest };
}
