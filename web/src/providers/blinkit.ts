import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";
import type { ProductOffer } from "@/types/product";
import type { ProviderAdapter } from "./types";

export async function scrapeBlinkit(query: string, location: string = "110001"): Promise<ProductOffer[]> {
  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  let products: any[] = [];

  try {
    await page.goto(`https://blinkit.com/s/?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
    
    // Fallback: wait for product cards to render, then pull from DOM
    await page.waitForSelector('.Product--card', { timeout: 6000 }).catch(() => null);

    // Playwright scraping the DOM is very robust against bot detection:
    products = await page.$$eval('.Product--card', elements => {
      return elements.slice(0, 5).map(el => {
          const title = el.querySelector("[class*='name']")?.textContent || "";
          const quantity = el.querySelector("[class*='weight']")?.textContent || "";
          const priceText = el.querySelector('.Product--price')?.textContent || el.querySelector("[class*='price']")?.textContent || "0";
          const mrpText = el.querySelector('.Product--mrp')?.textContent || el.querySelector("[class*='mrp']")?.textContent || priceText;
          
          const price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
          const mrp = mrpText ? parseInt(mrpText.replace(/[^0-9]/g, "")) : price;
          
          return {
              title: title.trim(),
              quantity: quantity.trim(),
              price,
              mrp,
          };
      });
    });

  } catch (e) {
    console.error("Blinkit Playwright Nav Error:", e);
  } finally {
    await browser.close();
  }

  const offers: ProductOffer[] = products.map((p, index) => ({
    id: `blinkit-${index}-${Date.now()}`,
    provider: "blinkit" as const,
    providerProductId: `blk-${index}`,
    title: p.title,
    quantity: p.quantity || "1 pc",
    price: p.price,
    mrp: p.mrp,
    discountPercent: p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0,
    buyUrl: `https://blinkit.com/s/?q=${encodeURIComponent(query)}`,
    etaMinutes: 10,
    deliveryFee: 15,
    inStock: true
  })).filter(o => o.title && o.price > 0);

  return offers;
}

export const blinkitProvider: ProviderAdapter = {
  config: {
    id: "blinkit",
    name: "Blinkit",
    enabled: true,
  },
  searchProducts: async ({ query, location }) => {
    return scrapeBlinkit(query, location);
  },
  buildBuyUrl: (productId, productName, location) => {
    return `https://blinkit.com/s/?q=${encodeURIComponent(productName)}`;
  }
};
