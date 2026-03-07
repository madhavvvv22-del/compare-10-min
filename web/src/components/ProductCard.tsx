"use client";

import { motion } from "framer-motion";
import type { ProductOffer } from "@/types/product";
import { Clock, ShoppingCart, Truck, Tag } from "lucide-react";

interface ProductCardProps {
  offer: ProductOffer;
  isCheapest?: boolean;
  isFastest?: boolean;
  onAddToBasket?: (offer: ProductOffer) => void;
}

const PROVIDER_THEMES: Record<string, { bg: string; text: string; badge: string; shadow: string }> = {
  blinkit: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500 text-white", shadow: "hover:shadow-amber-500/20" },
  zepto: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-600 dark:text-fuchsia-400", badge: "bg-fuchsia-500 text-white", shadow: "hover:shadow-fuchsia-500/20" },
  bigbasket: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-600 text-white", shadow: "hover:shadow-blue-500/20" },
  instamart: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-600 text-white", shadow: "hover:shadow-orange-500/20" },
};

const PROVIDER_NAMES: Record<string, string> = {
  blinkit: "Blinkit",
  zepto: "Zepto",
  bigbasket: "BigBasket",
  instamart: "Instamart",
};

export function ProductCard({ offer, isCheapest, isFastest, onAddToBasket }: ProductCardProps) {
  const totalPrice = offer.price + (offer.deliveryFee ?? 0);
  const theme = PROVIDER_THEMES[offer.provider] ?? PROVIDER_THEMES.blinkit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-[#111]/70 backdrop-blur-xl p-5 shadow-lg transition-all duration-300 ${theme.shadow} flex flex-col justify-between h-full`}
    >
      {/* Badges container */}
      <div className="absolute -top-3 left-4 flex gap-2 z-10">
        {isCheapest && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-1">
            <Tag size={12} /> Cheapest
          </span>
        )}
        {isFastest && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-lg shadow-blue-500/30 flex items-center gap-1">
            <Clock size={12} /> Fastest
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${theme.badge}`}>
            {PROVIDER_NAMES[offer.provider] ?? offer.provider}
          </span>
          {offer.etaMinutes && (
            <span className={`flex items-center gap-1 text-sm font-semibold ${theme.text} bg-white dark:bg-black px-2 py-1 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800`}>
              <Clock size={14} className="animate-pulse" />
              {offer.etaMinutes} min
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 leading-tight mb-1 line-clamp-2">
          {offer.title}
        </h3>
        {offer.quantity && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-4">{offer.quantity}</p>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            ₹{offer.price}
          </span>
          {offer.mrp && offer.mrp > offer.price && (
            <span className="text-base text-zinc-400 line-through mb-1">
              ₹{offer.mrp}
            </span>
          )}
          {offer.discountPercent && offer.discountPercent > 0 && (
            <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md mb-1 ml-auto">
              -{offer.discountPercent}% OFF
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-5 bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-xl">
          <Truck size={14} /> 
          {offer.deliveryFee === 0 ? (
            <span className="text-emerald-500 font-bold">Free Delivery</span>
          ) : (
            <span>₹{offer.deliveryFee} delivery</span>
          )}
          <span className="ml-auto font-bold text-zinc-700 dark:text-zinc-300">
            Total: ₹{totalPrice}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onAddToBasket && (
            <button
              type="button"
              onClick={() => onAddToBasket(offer)}
              className="flex items-center justify-center p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 hover:border-emerald-500 dark:hover:text-emerald-400 dark:hover:border-emerald-500 transition-colors"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
            </button>
          )}
          <a
            href={offer.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center rounded-xl py-3 text-sm font-bold transition-transform active:scale-95 ${theme.badge} shadow-lg ${theme.shadow}`}
          >
            Buy on {PROVIDER_NAMES[offer.provider]}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
