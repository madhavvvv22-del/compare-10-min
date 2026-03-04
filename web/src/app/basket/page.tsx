"use client";

import Link from "next/link";
import { useBasket } from "@/hooks/useBasket";
import { ProductCard } from "@/components/ProductCard";

const PROVIDER_NAMES: Record<string, string> = {
  blinkit: "Blinkit",
  zepto: "Zepto",
  bigbasket: "BigBasket",
  instamart: "Instamart",
};

export default function BasketPage() {
  const { items, remove, clear, totals, cheapest } = useBasket();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Back to search
          </Link>
          <Link
            href="/search"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
          >
            Add more items
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Your basket
        </h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-12 text-center text-zinc-500">
            <p className="mb-4">Your basket is empty.</p>
            <Link
              href="/search"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Search and add products to compare
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-zinc-600 dark:text-zinc-400">
                {items.length} item{items.length !== 1 ? "s" : ""} in basket
              </p>
              <button
                type="button"
                onClick={clear}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Clear basket
              </button>
            </div>

            {totals.length > 0 && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 mb-8">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Basket total by store
                </h2>
                <div className="space-y-2">
                  {totals.map((t) => (
                    <div
                      key={t.provider}
                      className={`flex items-center justify-between py-2 ${
                        cheapest?.provider === t.provider
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <span>
                        {PROVIDER_NAMES[t.provider] ?? t.provider} ({t.count}{" "}
                        item{t.count !== 1 ? "s" : ""})
                      </span>
                      <span>
                        ₹{t.total}
                        {t.delivery > 0 && (
                          <span className="text-zinc-500 text-sm ml-1">
                            (incl. ₹{t.delivery} delivery)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {cheapest && (
                  <p className="mt-3 text-sm text-zinc-500">
                    Cheapest for your basket:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {PROVIDER_NAMES[cheapest.provider]} (₹{cheapest.total})
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              {items.map((offer) => (
                <div key={offer.id} className="relative">
                  <ProductCard offer={offer} />
                  <button
                    type="button"
                    onClick={() => remove(offer.id)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-600 text-sm"
                    aria-label="Remove from basket"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
