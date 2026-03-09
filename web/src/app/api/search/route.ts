import { NextRequest, NextResponse } from "next/server";
import { providers } from "@/providers";
import type { ProductOffer, ProviderId } from "@/types/product";
import { getCachedSearch, setCachedSearch } from "@/lib/cache";
import { logSearch } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  const location = searchParams.get("location")?.trim() ?? "110001";

  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: query" },
      { status: 400 }
    );
  }

  // 1. Check Cache
  const cached = getCachedSearch(query, location);
  if (cached) {
    return NextResponse.json(cached);
  }

  // 2. Fetch from active providers using Headless Playwright/API
  const failedProviders: ProviderId[] = [];
  const resultsPromises = providers.map(async (provider) => {
    try {
      if (!provider.config.enabled) return [];
      const data = await provider.searchProducts({ query, location });
      if (!data || data.length === 0) {
        throw new Error("Empty data returned");
      }
      return data;
    } catch (error) {
       console.error(`Failed to fetch from ${provider.config.id}:`, error);
       failedProviders.push(provider.config.id as ProviderId);
       return [];
    }
  });

  const allOffers = await Promise.all(resultsPromises);
  const offers: ProductOffer[] = allOffers.flat();

  const result = {
    query,
    location,
    offers,
    ...(failedProviders.length > 0 && { failedProviders }),
  };

  // 3. Save to cache & analytics
  if (offers.length > 0) {
    setCachedSearch(query, location, result);
    logSearch(query, location, offers.length, failedProviders);
  }

  return NextResponse.json(result);
}
