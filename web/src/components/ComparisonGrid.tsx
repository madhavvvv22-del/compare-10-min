"use client";

import { useState } from "react";
import type { ProductOffer } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { groupOffersByProduct } from "@/lib/normalize";

type SortKey = "price" | "total" | "eta" | "discount";

export function ComparisonGrid({
  offers,
  sortBy = "total",
  query = "",
  onAddToBasket,
}: {
  offers: ProductOffer[];
  sortBy?: SortKey;
  query?: string;
  onAddToBasket?: (offer: ProductOffer) => void;
}) {
  const [groupByProduct, setGroupByProduct] = useState(false);

  const sorted = [...offers].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "total":
        return (
          a.price + (a.deliveryFee ?? 0) - (b.price + (b.deliveryFee ?? 0))
        );
      case "eta":
        return (a.etaMinutes ?? 99) - (b.etaMinutes ?? 99);
      case "discount":
        return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
      default:
        return 0;
    }
  });

  if (groupByProduct && query.trim()) {
    const groups = groupOffersByProduct(sorted, query);
    return (
      <div className="space-y-6">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={groupByProduct}
            onChange={(e) => setGroupByProduct(e.target.checked)}
            className="rounded"
          />
          Group same product across stores
        </label>
        {Array.from(groups.entries()).map(([key, groupOffers]) => (
          <div key={key} className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {groupOffers[0]?.title ?? key}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groupOffers.map((offer) => (
                <ProductCard
                  key={offer.id}
                  offer={offer}
                  onAddToBasket={onAddToBasket}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <input
          type="checkbox"
          checked={groupByProduct}
          onChange={(e) => setGroupByProduct(e.target.checked)}
          className="rounded"
        />
        Group same product across stores
      </label>
      {sorted.map((offer) => (
        <ProductCard
          key={offer.id}
          offer={offer}
          onAddToBasket={onAddToBasket}
        />
      ))}
    </div>
  );
}
