import * as cheerio from "cheerio";
import { fetchWithProxy } from "@/lib/proxy";
import type { ProductOffer } from "@/types/product";

export async function scrapeBigbasket(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  try {
    const searchUrl = `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query)}`;
    const html = await fetchWithProxy(searchUrl);
    const $ = cheerio.load(html);
    const offers: ProductOffer[] = [];
    
    // BB Nuxt Layout Check
    $("div[class*='SKUDeck']").each((_, el) => {
      try {
        const title = $(el).find("h3").text().trim();
        const quantity = $(el).find("span[class*='PackSize']").text().trim();
        
        const priceStr = $(el).find("span[class*='Pricing']").first().text().trim();
        const mrpStr = $(el).find("span[class*='StrikePricing']").text().trim() || priceStr;

        if (!title || !priceStr) return;

        const price = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
        const mrp = parseFloat(mrpStr.replace(/[^0-9.]/g, "")) || price;

        if (price > 0) {
          offers.push({
            id: `bb-${Math.random().toString(36).substr(2, 9)}`,
            provider: "bigbasket",
            providerProductId: `bb-${Date.now()}`,
            title,
            quantity: quantity || "1 pc",
            price: Math.round(price),
            mrp: Math.round(mrp),
            discountPercent: Math.round(((mrp - price) / mrp) * 100) || 0,
            buyUrl: searchUrl,
            etaMinutes: 25, // BB usually takes longer
            deliveryFee: 5,
            inStock: true
          });
        }
      } catch (e) {}
    });

    return offers.slice(0, 5);
  } catch (error) {
    console.error("BigBasket ScrapingBee Error:", error);
    return [];
  }
}

import type { ProviderAdapter } from "./types";
export const bigbasketProvider: ProviderAdapter = {
  config: {
    id: "bigbasket",
    name: "BigBasket",
    enabled: true,
  },
  searchProducts: async ({ query, location }) => {
    return scrapeBigbasket(query, location);
  },
  buildBuyUrl: (productId, productName, location) => {
    return `https://www.bigbasket.com/ps/?q=${encodeURIComponent(productName)}`;
  }
};
