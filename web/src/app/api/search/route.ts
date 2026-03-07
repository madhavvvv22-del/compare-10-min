import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ProductOffer, ProviderId } from "@/types/product";
import { getCachedSearch, setCachedSearch } from "@/lib/cache";
import { logSearch } from "@/lib/analytics";

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

  // Fetch real data from our Supabase database based on query tags
  const { data: dbProducts, error } = await supabase
    .from("groceries")
    .select("*")
    .ilike("query_tags", `%${query.toLowerCase()}%`);

  if (error) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({ error: "Database error while fetching products" }, { status: 500 });
  }

  const offers: ProductOffer[] = (dbProducts || []).map((p: any) => ({
    id: `${p.provider}-${p.id}`,
    provider: p.provider as ProviderId,
    providerProductId: `${p.id}`,
    title: p.title,
    quantity: p.quantity,
    price: p.price,
    mrp: p.mrp,
    discountPercent: Math.round(((p.mrp - p.price) / p.mrp) * 100) || 0,
    buyUrl: buildBuyUrl(p.provider, p.title),
    etaMinutes: p.eta_minutes,
    deliveryFee: p.delivery_fee,
    inStock: true,
  }));

  const failedProviders: ProviderId[] = []; // No failures when using direct DB

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

function buildBuyUrl(provider: string, productName: string) {
  const enc = encodeURIComponent(productName);
  const urls: Record<string, string> = {
    blinkit: `https://blinkit.com/s/?q=${enc}`,
    zepto: `https://www.zeptonow.com/search?q=${enc}`,
    bigbasket: `https://www.bigbasket.com/ps/?q=${enc}`,
    instamart: `https://www.swiggy.com/instamart/search?query=${enc}`,
  };
  return urls[provider] || urls.blinkit;
}
