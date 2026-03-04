/**
 * Normalized product offer schema shared between backend and frontend.
 * Used to unify data from Blinkit, Zepto, BigBasket, Instamart, etc.
 */
export type ProviderId = "blinkit" | "zepto" | "bigbasket" | "instamart";

export interface ProductOffer {
  /** Unique ID for this offer (provider + productId) */
  id: string;
  /** Provider name for display */
  provider: ProviderId;
  /** Provider's internal product ID */
  providerProductId: string;
  /** Product title (e.g. "Amul Taaza Milk") */
  title: string;
  /** Brand name if available */
  brand?: string;
  /** Quantity/size (e.g. "1L", "500g") */
  quantity?: string;
  /** Selling price in INR */
  price: number;
  /** Maximum retail price in INR */
  mrp?: number;
  /** Discount percentage (e.g. 10) */
  discountPercent?: number;
  /** Product image URL */
  imageUrl?: string;
  /** Deep link or URL to buy on provider's app/site */
  buyUrl: string;
  /** Estimated delivery time in minutes */
  etaMinutes?: number;
  /** Delivery fee in INR */
  deliveryFee?: number;
  /** Whether product is in stock */
  inStock?: boolean;
  /** Unit (e.g. "bottle", "pack") */
  unit?: string;
}

export interface SearchResult {
  query: string;
  location: string;
  offers: ProductOffer[];
  /** Providers that failed or timed out */
  failedProviders?: ProviderId[];
}
