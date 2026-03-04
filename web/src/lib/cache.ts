import NodeCache from "node-cache";
import type { SearchResult } from "@/types/product";

export const searchCache = new NodeCache({
  stdTTL: 5 * 60, // 5 minutes
  checkperiod: 60,
});

export function getCacheKey(query: string, location: string): string {
  return `search:${query.toLowerCase().trim()}:${location.trim()}`;
}

export function getCachedSearch(
  query: string,
  location: string
): SearchResult | undefined {
  return searchCache.get<SearchResult>(getCacheKey(query, location));
}

export function setCachedSearch(
  query: string,
  location: string,
  result: SearchResult
): void {
  searchCache.set(getCacheKey(query, location), result);
}
