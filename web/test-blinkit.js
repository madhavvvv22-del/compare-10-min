import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPE_DO_TOKEN = "c879953997714c4c92b6927de152a673a5dcd0f168e";

async function testBlinkit() {
    try {
        console.log("Fetching Blinkit via Proxy...");
        const response = await axios.get("http://api.scrape.do/", {
            params: {
              token: SCRAPE_DO_TOKEN,
              url: "https://blinkit.com/s/?q=milk",
              render: "true",
              super: "true",
              geoCode: "in",
            },
          });

        const $ = cheerio.load(response.data);
        const products = $(".Product--card").length;
        console.log("Found products on Blinkit:", products);

    } catch (e) {
        console.error("Error:", e.message);
    }
}
testBlinkit();
