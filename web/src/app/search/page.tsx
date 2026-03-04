"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { ComparisonGrid } from "@/components/ComparisonGrid";
import { useBasket } from "@/hooks/useBasket";
import type { SearchResult } from "@/types/product";

function SearchPageContent() {
  const { add: addToBasket } = useBasket();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const location = searchParams.get("location") ?? "";

  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "total" | "eta" | "discount">("total");

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ query: query.trim() });
    if (location.trim()) params.set("location", location.trim());
    fetch(`/api/search?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then(setResult)
      .catch((err) => setError(err.message || "Failed to load results"))
      .finally(() => setLoading(false));
  }, [query, location]);

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              href="/"
              className="text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              ← Back
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-zinc-500">Enter a search query to compare prices.</p>
          <div className="mt-6">
            <SearchForm />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            ← Back to search
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchForm />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-pulse text-zinc-500">
              Comparing prices across Blinkit, Zepto, BigBasket & Instamart...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && result && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Results for &ldquo;{result.query}&rdquo;
                {result.location && (
                  <span className="text-zinc-500 font-normal">
                    {" "}
                    in {result.location}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "total" | "eta" | "discount")
                  }
                  className="rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
                >
                  <option value="total">Total price</option>
                  <option value="price">Item price</option>
                  <option value="eta">Delivery time</option>
                  <option value="discount">Discount</option>
                </select>
              </div>
            </div>

            {result.failedProviders && result.failedProviders.length > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                Some stores could not be reached:{" "}
                {result.failedProviders.join(", ")}
              </p>
            )}

            {result.offers.length === 0 ? (
              <p className="text-zinc-500 py-8">
                No products found. Try a different search term.
              </p>
            ) : (
              <ComparisonGrid
                offers={result.offers}
                sortBy={sortBy}
                query={result.query}
                onAddToBasket={addToBasket}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
