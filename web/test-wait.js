import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPE_DO_TOKEN = "c879953997714c4c92b6927de152a673a5dcd0f168e";

async function testWait() {
    try {
        console.log("Fetching Zepto with wait=5000...");
        const response = await axios.get("http://api.scrape.do/", {
            params: {
              token: SCRAPE_DO_TOKEN,
              url: "https://www.zeptonow.com/search?q=milk",
              render: "true",
              super: "true",
              geoCode: "in",
              // Scrape.do allows playrightWait but usually just `playwrightWait: "5000"` or `wait: 5000`
              playwrightWait: 3000, 
            },
          });
        
        const $ = cheerio.load(response.data);
        const products = $("[data-testid='product-card'], .product-card").length;
        console.log("Length:", response.data.length);
        console.log("Found products on Zepto:", products);

        if (products === 0) {
            console.log(response.data.substring(response.data.length - 1000));
        }
    } catch (e) {
        console.error("Error:", e.response?.data || e.message);
    }
}
testWait();
