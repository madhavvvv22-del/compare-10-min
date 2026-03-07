import * as cheerio from "cheerio";
import { fetchWithProxy } from "@/lib/proxy";
import type { ProductOffer } from "@/types/product";

export async function scrapeInstamart(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  try {
    const searchUrl = `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(query)}`;
    const html = await fetchWithProxy(searchUrl);
    const $ = cheerio.load(html);
    const offers: ProductOffer[] = [];
    
    // Swiggy Instamart relies heavily on CSS modules
    $("div[data-testid='item-card']").each((_, el) => {
      try {
        const title = $(el).find("div[aria-label]").attr("aria-label")?.trim() || "";
        const quantity = $(el).find("div[aria-label*='ml'], div[aria-label*='g'], div[aria-label*='L']").text().trim();
        
        const textNodes = $(el).text();
        const priceMatch = textNodes.match(/₹([0-9]+)/g); // Find all ₹ matches
        const priceStrs = priceMatch ? priceMatch.map(p => parseInt(p.replace(/[^0-9]/g, ""))) : [];

        if (!title || priceStrs.length === 0) return;

        // Highest usually is MRP, lowest is current price on Instamart DOM
        const sorted = priceStrs.sort((a,b)=>a-b);
        const price = sorted[0];
        const mrp = sorted.length > 1 ? sorted[sorted.length-1] : price;

        if (price > 0) {
          offers.push({
            id: `insta-${Math.random().toString(36).substr(2, 9)}`,
            provider: "instamart",
            providerProductId: `im-${Date.now()}`,
            title,
            quantity: quantity || "1 pc",
            price,
            mrp,
            discountPercent: Math.round(((mrp - price) / mrp) * 100) || 0,
            buyUrl: searchUrl, // They don't expose direct item links cleanly
            etaMinutes: 14,
            deliveryFee: 25, 
            inStock: true
          });
        }
      } catch (e) {}
    });

    return offers.slice(0, 5);
  } catch (error) {
    console.error("Instamart ScrapingBee Error:", error);
    return [];
  }
}

import type { ProviderAdapter } from "./types";
export const instamartProvider: ProviderAdapter = {
  config: {
    id: "instamart",
    name: "Swiggy Instamart",
    enabled: true,
  },
  searchProducts: async ({ query, location }) => {
    return scrapeInstamart(query, location);
  },
  buildBuyUrl: (productId, productName, location) => {
    return `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(productName)}`;
  }
};
