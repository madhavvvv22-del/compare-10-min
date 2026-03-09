import type { ProductOffer } from "@/types/product";
import type { ProviderAdapter } from "./types";

export async function scrapeInstamart(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  // Disabled until Playwright migration is complete
  return [];
}

export const instamartProvider: ProviderAdapter = {
  config: {
    id: "instamart",
    name: "Swiggy Instamart",
    enabled: false, // temporarily disabled
  },
  searchProducts: async ({ query, location }) => {
    return scrapeInstamart(query, location);
  },
  buildBuyUrl: (productId, productName, location) => {
    return `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(productName)}`;
  }
};
