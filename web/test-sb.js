import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPINGBEE_API_KEY = "c879953997714c4c92b6927de152a673a5dcd0f168e";

async function test() {
    try {
        console.log("Fetching Zepto...");
        const response = await axios.get("https://app.scrapingbee.com/api/v1", {
            params: {
              api_key: SCRAPINGBEE_API_KEY,
              url: "https://www.zeptonow.com/search?q=milk",
              render_js: "true",
              stealth_proxy: "true",
              premium_proxy: "true",
              country_code: "in",
            },
          });
        console.log("Received HTML Length:", response.data.length);

        const $ = cheerio.load(response.data);
        const products = $("[data-testid='product-card']").length;
        console.log("Found products on Zepto:", products);

        if (products === 0) {
            console.log("Dumping part of the HTML to see what we actually got...");
            console.log(response.data.substring(0, 1000));
        }
    } catch (e) {
        console.error("Error:", e.response?.data || e.message);
    }
}
test();
