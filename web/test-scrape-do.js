import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPE_DO_TOKEN = "c879953997714c4c92b6927de152a673a5dcd0f168e";

async function test() {
    try {
        console.log("Fetching Zepto via Scrape.do...");
        const response = await axios.get("http://api.scrape.do/", {
            params: {
              token: SCRAPE_DO_TOKEN,
              url: "https://www.zeptonow.com/search?q=milk",
              render: "true",
              super: "true",
              geoCode: "in",
            },
          });
        console.log("Received HTML Length:", response.data.length);

        const $ = cheerio.load(response.data);
        const products = $("[data-testid='product-card'], .product-card").length;
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
