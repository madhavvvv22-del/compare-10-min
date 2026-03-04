import type { ProductOffer } from "@/types/product";
import type { ProviderAdapter, SearchParams } from "./types";

/** Generates mock products for a given query - used by all mock providers */
function generateMockOffers(
  providerId: "blinkit" | "zepto" | "bigbasket" | "instamart",
  query: string,
  basePrice: number
): ProductOffer[] {
  const names: Record<string, string> = {
    blinkit: "Blinkit",
    zepto: "Zepto",
    bigbasket: "BigBasket",
    instamart: "Instamart",
  };
  const searchUrl: Record<string, string> = {
    blinkit: "https://blinkit.com/s/?q=",
    zepto: "https://www.zeptonow.com/s/?q=",
    bigbasket: "https://www.bigbasket.com/ps/?q=",
    instamart: "https://www.swiggy.com/instamart/search?query=",
  };

  const variations = [
    { qty: "500g", mult: 0.6 },
    { qty: "1kg", mult: 1 },
    { qty: "1L", mult: 0.9 },
    { qty: "250g", mult: 0.35 },
    { qty: "2L", mult: 1.8 },
  ];

  return variations.map((v, i) => {
    const price = Math.round(basePrice * v.mult * (0.9 + Math.random() * 0.2));
    const mrp = Math.round(price * 1.15);
    const discount = Math.round(((mrp - price) / mrp) * 100);
    const id = `${providerId}-${query.toLowerCase().replace(/\s/g, "-")}-${i}`;
    const buyUrl = `${searchUrl[providerId]}${encodeURIComponent(query)}`;

    return {
      id,
      provider: providerId,
      providerProductId: id,
      title: `${query} ${v.qty}`,
      quantity: v.qty,
      price,
      mrp,
      discountPercent: discount,
      buyUrl,
      etaMinutes: providerId === "blinkit" ? 10 : providerId === "zepto" ? 12 : 30,
      deliveryFee: basePrice > 99 ? 0 : 29,
      inStock: true,
    };
  });
}

function createMockProvider(
  id: "blinkit" | "zepto" | "bigbasket" | "instamart",
  name: string
): ProviderAdapter {
  return {
    config: { id, name, enabled: true, searchTimeoutMs: 5000 },
    async searchProducts({ query }: SearchParams) {
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
      const basePrice = 50 + Math.floor(Math.random() * 150);
      return generateMockOffers(id, query, basePrice);
    },
    buildBuyUrl(productId: string, productName: string) {
      const enc = encodeURIComponent(productName || "product");
      const urls: Record<string, string> = {
        blinkit: `https://blinkit.com/s/?q=${enc}`,
        zepto: `https://www.zeptonow.com/s/?q=${enc}`,
        bigbasket: `https://www.bigbasket.com/ps/?q=${enc}`,
        instamart: `https://www.swiggy.com/instamart/search?query=${enc}`,
      };
      return urls[id] || urls.blinkit;
    },
  };
}

export const blinkitProvider = createMockProvider("blinkit", "Blinkit");
export const zeptoProvider = createMockProvider("zepto", "Zepto");
export const bigbasketProvider = createMockProvider("bigbasket", "BigBasket");
export const instamartProvider = createMockProvider("instamart", "Instamart");
