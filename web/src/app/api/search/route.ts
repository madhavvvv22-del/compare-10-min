import { NextRequest, NextResponse } from "next/server";
import { getEnabledProviders } from "@/lib/provider-registry";
import type { ProviderAdapter } from "@/providers";
import type { ProductOffer, ProviderId } from "@/types/product";
import { getCachedSearch, setCachedSearch } from "@/lib/cache";
import { logSearch } from "@/lib/analytics";

const TIMEOUT_MS = 8000;

async function searchProvider(
  provider: ProviderAdapter,
  query: string,
  location: string
): Promise<{ offers: ProductOffer[]; failed: false } | { failed: true; error?: string }> {
  try {
    const timeoutMs = provider.config.searchTimeoutMs ?? TIMEOUT_MS;
    const offers = await Promise.race([
      provider.searchProducts({ query, location }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutMs)
      ),
    ]);
    return { offers, failed: false };
  } catch (err) {
    return { failed: true, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  const location = searchParams.get("location")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(
      { error: "Missing required parameter: query" },
      { status: 400 }
    );
  }

  const loc = location || "110001"; // default Delhi pincode

  const cached = getCachedSearch(query, loc);
  if (cached) {
    return NextResponse.json(cached);
  }

  const enabledProviders = getEnabledProviders();
  const results = await Promise.all(
    enabledProviders.map((p) => searchProvider(p, query, loc))
  );

  const offers: ProductOffer[] = [];
  const failedProviders: ProviderId[] = [];

  results.forEach((r, i) => {
    if (r.failed) {
      failedProviders.push(enabledProviders[i].config.id as ProviderId);
    } else {
      offers.push(...r.offers);
    }
  });

  const result = {
    query,
    location: loc,
    offers,
    ...(failedProviders.length > 0 && { failedProviders }),
  };

  setCachedSearch(query, loc, result);
  logSearch(query, loc, offers.length, failedProviders);
  return NextResponse.json(result);
}
