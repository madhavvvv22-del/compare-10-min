import { chromium } from "playwright";
import type { ProductOffer } from "@/types/product";
import type { ProviderAdapter } from "./types";

export async function scrapeZepto(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  let productDataJson: any = null;

  // Intercept the clean JSON API
  page.on('response', async (response) => {
    if (response.url().includes('api/v3/search') && response.request().method() === 'POST') {
      if (response.status() === 200 || response.status() === 201) {
        try {
          productDataJson = await response.json(); 
        } catch(e) {}
      }
    }
  });

  try {
    // Navigate and trigger search physically
    await page.goto('https://www.zeptonow.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    
    // Focus search bar and type
    try {
      await page.click('[placeholder*="Search"]', { timeout: 2000 });
    } catch(e) {
      await page.click('text="Search for"', { timeout: 2000 });
    }

    await page.keyboard.type(query, { delay: 50 });
    await page.keyboard.press('Enter');
    
    // Wait for the intercepted JSON to appear (max 5 seconds)
    let waited = 0;
    while (!productDataJson && waited < 5000) {
      await page.waitForTimeout(200);
      waited += 200;
    }
    
  } catch (e) {
    console.error("Zepto Playwright Nav Error:", e);
  } finally {
    await browser.close();
  }

  const offers: ProductOffer[] = [];
  
  if (productDataJson && productDataJson.layout) {
    // Parse the JSON layout payload recursively to find items
    const searchRecursively = (obj: any): any[] => {
      let items: any[] = [];
      if (Array.isArray(obj)) {
        for (const v of obj) items.push(...searchRecursively(v));
      } else if (obj !== null && typeof obj === 'object') {
        if (obj.items && Array.isArray(obj.items)) {
          items.push(...obj.items);
        }
        for (const key of Object.keys(obj)) {
          if (key !== 'items') items.push(...searchRecursively(obj[key]));
        }
      }
      return items;
    };

    const allItems = searchRecursively(productDataJson.layout);
    
    for (const item of allItems) {
      if (item && item.productResponse && item.productResponse.product) {
        const p = item.productResponse.product;
        
        let price = (p.discountedPrice || p.mrp || 0) / 100;
        let mrp = (p.mrp || p.discountedPrice || 0) / 100;
        
        if (price === 0) continue;

        offers.push({
          id: `zepto-${p.id}`,
          provider: "zepto" as const,
          providerProductId: p.id,
          title: p.name || "",
          brand: p.brand || "",
          quantity: p.packRatio || p.unitDescription || "1 unit",
          price,
          mrp,
          discountPercent: mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
          imageUrl: p.imageResponse?.imageDTOs?.[0]?.imageUrl || "",
          buyUrl: `https://www.zeptonow.com/search?q=${encodeURIComponent(query)}`,
          etaMinutes: 10,
          deliveryFee: 15,
          inStock: !p.outOfStock
        });

        if (offers.length >= 5) break;
      }
    }
  }

  return offers.slice(0, 5);
}

export const zeptoProvider: ProviderAdapter = {
  config: {
    id: "zepto",
    name: "Zepto",
    enabled: true,
  },
  searchProducts: async ({ query, location }) => {
    return scrapeZepto(query, location);
  },
  buildBuyUrl: (productId, productName, location) => {
    return `https://www.zeptonow.com/search?q=${encodeURIComponent(productName)}`;
  }
};
