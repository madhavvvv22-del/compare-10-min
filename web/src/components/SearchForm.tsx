"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/hooks/usePreferences";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SearchForm({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [focused, setFocused] = useState<"query" | "location" | null>(null);
  const { preferences, updatePreferences } = usePreferences();
  const router = useRouter();
  
  const locationValue = location !== "" ? location : (preferences.savedLocation ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    
    setIsSearching(true);
    const loc = (location || preferences.savedLocation || "").trim();
    if (loc) updatePreferences({ savedLocation: loc });
    
    const params = new URLSearchParams({ query: q });
    if (loc) params.set("location", loc);
    
    // Slight delay for animation awesomeness
    setTimeout(() => {
      router.push(`/search?${params.toString()}`);
    }, 400);
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit} 
      className={cn(
        "relative flex flex-col sm:flex-row items-center gap-3 w-full max-w-3xl p-2 rounded-2xl sm:rounded-[2rem] bg-white/50 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300",
        focused ? "ring-2 ring-emerald-500/50 shadow-emerald-500/20" : "",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1 flex items-center w-full group">
        <div className="absolute left-6 text-zinc-400 dark:text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
          <Search size={22} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused("query")}
          onBlur={() => setFocused(null)}
          placeholder="Search for milk, bread, eggs..."
          className="w-full bg-transparent pl-14 pr-4 py-4 sm:py-5 text-lg font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
          required
        />
      </div>

      <div className="hidden sm:block w-px h-10 bg-zinc-200 dark:bg-zinc-800" />

      {/* Location Input */}
      <div className="relative w-full sm:w-48 flex items-center group border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
        <div className="absolute left-6 sm:left-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
          <MapPin size={22} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={locationValue}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => setFocused("location")}
          onBlur={() => setFocused(null)}
          placeholder="Pincode (110001)"
          className="w-full bg-transparent pl-14 sm:pl-12 pr-4 py-4 sm:py-5 text-base font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSearching || !query.trim()}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500 px-8 py-4 sm:py-5 font-bold text-white shadow-xl shadow-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed m-1 sm:m-0"
      >
        {isSearching ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            Compare
            <ArrowRight size={20} strokeWidth={2.5} />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
