"use client";

import type { ProductOffer } from "@/types/product";

interface ProductCardProps {
  offer: ProductOffer;
  onAddToBasket?: (offer: ProductOffer) => void;
}

const PROVIDER_COLORS: Record<string, string> = {
  blinkit: "bg-orange-500",
  zepto: "bg-lime-500",
  bigbasket: "bg-blue-600",
  instamart: "bg-orange-600",
};

const PROVIDER_NAMES: Record<string, string> = {
  blinkit: "Blinkit",
  zepto: "Zepto",
  bigbasket: "BigBasket",
  instamart: "Instamart",
};

export function ProductCard({ offer, onAddToBasket }: ProductCardProps) {
  const totalPrice = offer.price + (offer.deliveryFee ?? 0);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${PROVIDER_COLORS[offer.provider] ?? "bg-zinc-500"}`}
            >
              {PROVIDER_NAMES[offer.provider] ?? offer.provider}
            </span>
            {offer.etaMinutes && (
              <span className="text-xs text-zinc-500">
                {offer.etaMinutes} min
              </span>
            )}
          </div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {offer.title}
          </h3>
          {offer.quantity && (
            <p className="text-sm text-zinc-500">{offer.quantity}</p>
          )}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-semibold text-emerald-600">
              ₹{offer.price}
            </span>
            {offer.mrp && offer.mrp > offer.price && (
              <span className="text-sm text-zinc-400 line-through">
                ₹{offer.mrp}
              </span>
            )}
            {offer.discountPercent && offer.discountPercent > 0 && (
              <span className="text-xs text-emerald-600 font-medium">
                {offer.discountPercent}% off
              </span>
            )}
          </div>
          {offer.deliveryFee !== undefined && offer.deliveryFee > 0 && (
            <p className="text-xs text-zinc-500 mt-1">
              + ₹{offer.deliveryFee} delivery
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          {onAddToBasket && (
            <button
              type="button"
              onClick={() => onAddToBasket(offer)}
              className="rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
            >
              Add to basket
            </button>
          )}
          <a
            href={offer.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors whitespace-nowrap text-center"
          >
            Buy on {PROVIDER_NAMES[offer.provider] ?? offer.provider}
          </a>
        </div>
      </div>
      <p className="text-xs text-zinc-500 mt-2">
        Total: ₹{totalPrice}
        {offer.deliveryFee !== undefined && offer.deliveryFee > 0 && (
          <> (incl. delivery)</>
        )}
      </p>
    </div>
  );
}
