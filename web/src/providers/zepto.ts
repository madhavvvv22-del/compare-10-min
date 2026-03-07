import * as cheerio from "cheerio";
import { fetchWithProxy } from "@/lib/proxy";
import type { ProductOffer } from "@/types/product";

export async function scrapeZepto(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  try {
    const searchUrl = `https://www.zeptonow.com/search?q=${encodeURIComponent(query)}`;
    const html = await fetchWithProxy(searchUrl);
    const $ = cheerio.load(html);
    const offers: ProductOffer[] = [];
    
    // Zepto standard classes
    $("[data-testid='product-card'], .product-card").each((_, el) => {
      try {
        const title = $(el).find("h5").text().trim() || $(el).find(".product-name").text().trim();
        const quantity = $(el).find(".volume-text").text().trim() || $(el).find("span[class*='weight']").text().trim();
        
        const priceText = $(el).find("h4").text().trim() || $(el).find(".selling-price").text().trim();
        const mrpText = $(el).find(".mrp-text").text().trim();

        if (!title || !priceText) return;

        // Strip non-digits safely
        const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
        const mrp = mrpText ? parseInt(mrpText.replace(/[^0-9]/g, "")) : price;

        if (price > 0) {
          offers.push({
            id: `zepto-${Math.random().toString(36).substr(2, 9)}`,
            provider: "zepto",
            providerProductId: `zpt-${Date.now()}`,
            title,
            quantity: quantity || "1 pc",
            price,
            mrp,
            discountPercent: Math.round(((mrp - price) / mrp) * 100) || 0,
            buyUrl: searchUrl,
            etaMinutes: 9, // Estimated average
            deliveryFee: 15, // Fixed base Zepto delivery fee for demo purposes
            inStock: true
          });
        }
      } catch (e) {}
    });

    return offers.slice(0, 5);
  } catch (error) {
    console.error("Zepto ScrapingBee Error:", error);
    return [];
  }
}

import type { ProviderAdapter } from "./types";
export const zeptoProvider: ProviderAdapter = {
  id: "zepto",
  name: "Zepto",
  search: scrapeZepto
};
