"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { ComparisonGrid } from "@/components/ComparisonGrid";
import { useBasket } from "@/hooks/useBasket";
import type { SearchResult } from "@/types/product";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (!query.trim()) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-4">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px]" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-2xl text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Search for Groceries</h1>
            <p className="text-zinc-400">Enter a product name to get live prices across all major 10-minute delivery apps.</p>
          </div>
          <div className="w-full flex justify-center">
            <SearchForm />
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            <ArrowLeft size={16} /> Back exactly to home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-50 dark:bg-[#080808] relative">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Header & Search Form */}
          <motion.div variants={itemVariants} className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-white/10">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-500 font-medium transition-colors mb-3">
                <ArrowLeft size={16} /> Back to Search
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3 flex-wrap">
                Results for: <span className="text-emerald-600 dark:text-emerald-400">&ldquo;{query}&rdquo;</span>
              </h1>
              {result?.location && (
                <p className="text-zinc-500 mt-2 font-medium">Delivering to: <span className="text-zinc-900 dark:text-zinc-300">{result.location}</span></p>
              )}
            </div>
            
            <div className="w-full xl:w-auto xl:min-w-[500px]">
              <SearchForm className="sm:rounded-2xl" />
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative z-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Fetching Live Prices</h3>
              <p className="text-zinc-500 max-w-md text-center">We are scraping Blinkit, Zepto, BigBasket, and Instamart in real-time to find you the best deals...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div variants={itemVariants} className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-6 flex flex-col items-center justify-center text-center space-y-3 py-16">
              <AlertCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-red-900 dark:text-red-400">Search Failed</h3>
              <p className="text-red-700 dark:text-red-500/80 max-w-md">There was a problem reaching the providers. Bot protections might be active. Ensure you have the playwright browsers installed.</p>
              <div className="text-sm font-mono bg-red-100 dark:bg-red-900/30 px-4 py-2 rounded-xl text-red-800 dark:text-red-300">
                Error: {error}
              </div>
            </motion.div>
          )}

          {/* Results State */}
          {!loading && !error && result && (
            <motion.div variants={containerVariants} className="space-y-6">
              
              {result.failedProviders && result.failedProviders.length > 0 && (
                <motion.div variants={itemVariants} className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-800 dark:text-orange-400">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-medium">We couldn't fetch live data from: <span className="font-bold">{result.failedProviders.join(", ")}</span>. Showing default or cached results for them.</p>
                </motion.div>
              )}

              {result.offers.length === 0 ? (
                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
                  <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 mb-2">
                    <SearchForm className="hidden" /> {/* just hacky wrapper */}
                    <SearchForm className="hidden" />
                    <span>🕵️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">No products found</h3>
                  <p className="text-zinc-500 max-w-sm">We couldn't find exactly what you're looking for. Try a different search term like "Milk" or "Bread".</p>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">Showing <span className="text-zinc-900 dark:text-white font-bold">{result.offers.length}</span> results</p>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-medium text-zinc-500">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow"
                      >
                        <option value="total">Total Price (w/ Del.)</option>
                        <option value="price">Item Price Only</option>
                        <option value="eta">Fastest Delivery</option>
                        <option value="discount">Highest Discount</option>
                      </select>
                    </div>
                  </div>

                  <ComparisonGrid
                    offers={result.offers}
                    sortBy={sortBy}
                    query={result.query}
                    onAddToBasket={addToBasket}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

        </motion.div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium animate-pulse">Preloading app...</p>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
