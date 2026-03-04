import type { ProductOffer } from "@/types/product";

export interface ProviderConfig {
  id: string;
  name: string;
  enabled: boolean;
  searchTimeoutMs?: number;
}

export interface SearchParams {
  query: string;
  location: string; // pincode or city
}

export interface ProviderAdapter {
  readonly config: ProviderConfig;
  searchProducts(params: SearchParams): Promise<ProductOffer[]>;
  buildBuyUrl(productId: string, productName: string, location: string): string;
}
