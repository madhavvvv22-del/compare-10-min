import axios from 'axios';
import * as cheerio from 'cheerio';

const SCRAPE_DO_TOKEN = "c879953997714c4c92b6927de152a673a5dcd0f168e";

async function test() {
    try {
        console.log("Fetching Zepto via Proxy...");
        const response = await axios.get("http://api.scrape.do/", {
            params: {
              token: SCRAPE_DO_TOKEN,
              url: "https://www.zeptonow.com/search?q=milk",
              // we don't even need render=true if we just parse __NEXT_DATA__
              super: "true",
              geoCode: "in",
            },
          });

        const $ = cheerio.load(response.data);
        const nextData = $("#__NEXT_DATA__").html();
        if (nextData) {
            console.log("Found __NEXT_DATA__ JSON!");
            const data = JSON.parse(nextData);
            // Search data is usually deep in Next.js props
            console.log(Object.keys(data.props.pageProps));
        } else {
            console.log("No NEXT_DATA script found. Dumping some html...");
            console.log(response.data.substring(0, 1000));
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
