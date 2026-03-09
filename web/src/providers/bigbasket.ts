import type { ProductOffer } from "@/types/product";
import type { ProviderAdapter } from "./types";

export async function scrapeBigbasket(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  // Disabled until Playwright migration is complete
  return [];
}

export const bigbasketProvider: ProviderAdapter = {
  config: {
    id: "bigbasket",
    name: "BigBasket",
    enabled: false, // temporarily disabled
  },
  searchProducts: async ({ query, location }) => {
    return scrapeBigbasket(query, location);
  },
  buildBuyUrl: (productId, productName, location) => {
    return `https://www.bigbasket.com/ps/?q=${encodeURIComponent(productName)}`;
  }
};
