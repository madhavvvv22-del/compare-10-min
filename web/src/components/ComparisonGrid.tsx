"use client";

import { useState } from "react";
import type { ProductOffer } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { groupOffersByProduct } from "@/lib/normalize";
import { LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        return (a.price + (a.deliveryFee ?? 0)) - (b.price + (b.deliveryFee ?? 0));
      case "eta":
        return (a.etaMinutes ?? 99) - (b.etaMinutes ?? 99);
      case "discount":
        return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
      default:
        return 0;
    }
  });

  const getCheapestAndFastest = (offersList: ProductOffer[]) => {
    if (offersList.length === 0) return { cheapestId: null, fastestId: null };
    const cheapest = [...offersList].sort((a, b) => (a.price + (a.deliveryFee ?? 0)) - (b.price + (b.deliveryFee ?? 0)))[0];
    const fastest = [...offersList].sort((a, b) => (a.etaMinutes ?? 99) - (b.etaMinutes ?? 99))[0];
    return { cheapestId: cheapest.id, fastestId: fastest.id };
  };

  const overview = getCheapestAndFastest(sorted);

  return (
    <div className="space-y-6 w-full">
      {/* Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10">
        <button
          onClick={() => setGroupByProduct(!groupByProduct)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          {groupByProduct ? <List size={16} /> : <LayoutGrid size={16} />}
          {groupByProduct ? "Ungroup Products" : "Group Similar"}
        </button>
      </div>

      {groupByProduct && query.trim() ? (
        <div className="space-y-12">
          {Array.from(groupOffersByProduct(sorted, query).entries()).map(([key, groupOffers], i) => {
            const { cheapestId, fastestId } = getCheapestAndFastest(groupOffers);
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={key} 
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {groupOffers[0]?.title ?? key}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                    {groupOffers.length} options
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
                  {groupOffers.map((offer) => (
                    <ProductCard
                      key={offer.id}
                      offer={offer}
                      isCheapest={offer.id === cheapestId}
                      isFastest={offer.id === fastestId}
                      onAddToBasket={onAddToBasket}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch"
        >
          <AnimatePresence>
            {sorted.map((offer, i) => (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <ProductCard
                  offer={offer}
                  isCheapest={offer.id === overview.cheapestId}
                  isFastest={offer.id === overview.fastestId}
                  onAddToBasket={onAddToBasket}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
