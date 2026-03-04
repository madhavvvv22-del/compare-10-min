"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/hooks/usePreferences";

export function SearchForm() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const { preferences, updatePreferences } = usePreferences();
  const router = useRouter();
  const locationValue = location !== "" ? location : (preferences.savedLocation ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const loc = (location || preferences.savedLocation || "").trim();
    if (loc) updatePreferences({ savedLocation: loc });
    const params = new URLSearchParams({ query: q });
    if (loc) params.set("location", loc);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for milk, bread, eggs..."
        className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        required
      />
      <input
        type="text"
        value={locationValue}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Pincode (e.g. 110001)"
        className="w-full sm:w-40 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 font-medium text-white transition-colors"
      >
        Compare Prices
      </button>
    </form>
  );
}
