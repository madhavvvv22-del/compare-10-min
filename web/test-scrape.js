const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  console.log("Navigating to Zepto...");
  await page.goto('https://www.zeptonow.com/search?q=milk');
  try {
    await page.waitForTimeout(5000);
    const content = await page.content();
    if (content.includes("Cloudflare") || content.includes("Access Denied")) {
        console.log("BLOCKED BY CLOUDFLARE/WAF");
    } else {
        console.log("Page loaded. Checking for products...");
        const items = await page.$$("a[data-testid='product-card']");
        console.log(`Found ${items.length} products`);
    }
  } catch (e) {
    console.error(e);
  }
  await browser.close();
})();
