import * as cheerio from "cheerio";
import { fetchWithProxy } from "@/lib/proxy";
import type { ProductOffer } from "@/types/product";

export async function scrapeBlinkit(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  try {
    const searchUrl = `https://blinkit.com/s/?q=${encodeURIComponent(query)}`;
    
    // Use ScrapingBee to get the HTML fully rendered bypassing Cloudflare
    const html = await fetchWithProxy(searchUrl);
    const $ = cheerio.load(html);

    const offers: ProductOffer[] = [];
    
    // Blinkit generic product card selector
    $(".Product--card").each((_, el) => {
      try {
        const title = $(el).find(".Product--name").text().trim() || $(el).find("div[class*='name']").text().trim();
        const quantity = $(el).find(".Product--quantity").text().trim() || $(el).find("div[class*='weight']").text().trim();
        
        let priceStr = $(el).find(".Product--price").text().trim() || $(el).find("div[class*='price']").first().text().trim();
        let mrpStr = $(el).find(".Product--mrp").text().trim() || $(el).find("div[class*='mrp']").text().trim();

        if (!title || !priceStr) return;

        const price = parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
        const mrp = mrpStr ? parseInt(mrpStr.replace(/[^0-9]/g, "")) : price;

        if (price > 0) {
          offers.push({
            id: `blinkit-${Math.random().toString(36).substr(2, 9)}`,
            provider: "blinkit",
            providerProductId: `blk-${Date.now()}`,
            title,
            quantity: quantity || "1 pc",
            price,
            mrp,
            discountPercent: Math.round(((mrp - price) / mrp) * 100) || 0,
            buyUrl: searchUrl,
            etaMinutes: 10,
            deliveryFee: 15,
            inStock: true
          });
        }
      } catch (e) {
        // Skip malformed nodes
      }
    });

    return offers.slice(0, 5); // Return top 5 live results

  } catch (error) {
    console.error("Blinkit ScrapingBee Error:", error);
    return []; // Return empty on failure so the UI gracefully shows 0 for Blinkit
  }
}

import type { ProviderAdapter } from "./types";
export const blinkitProvider: ProviderAdapter = {
  id: "blinkit",
  name: "Blinkit",
  search: scrapeBlinkit
};
