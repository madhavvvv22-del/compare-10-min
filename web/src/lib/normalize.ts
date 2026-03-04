import type { ProductOffer } from "@/types/product";

/** Canonical key for deduplication: same product across providers */
export function getCanonicalKey(offer: ProductOffer, query: string): string {
  const base = query.toLowerCase().trim().replace(/\s+/g, "-");
  const qty = (offer.quantity ?? "").toLowerCase().trim();
  return qty ? `${base}-${qty}` : base;
}

/** Group offers by canonical product (query + quantity) for cross-provider comparison */
export function groupOffersByProduct(
  offers: ProductOffer[],
  query: string
): Map<string, ProductOffer[]> {
  const map = new Map<string, ProductOffer[]>();
  for (const offer of offers) {
    const key = getCanonicalKey(offer, query);
    const existing = map.get(key) ?? [];
    existing.push(offer);
    map.set(key, existing);
  }
  return map;
}
