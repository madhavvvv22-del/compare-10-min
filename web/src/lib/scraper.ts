import { chromium, Browser, Page } from "playwright";

let browserPromise: Promise<Browser> | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    });
  }
  return browserPromise;
}

export async function closeBrowser() {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

/**
 * Common configuration for new pages
 */
export async function getNewPage(browser: Browser): Promise<Page> {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'en-IN',
    geolocation: { latitude: 28.6139, longitude: 77.2090 }, // New Delhi
    permissions: ['geolocation'],
  });
  
  const page = await context.newPage();
  
  // Evade webdriver detection
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  });

  return page;
}
