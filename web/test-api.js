import axios from 'axios';

const SCRAPE_DO_TOKEN = "c879953997714c4c92b6927de152a673a5dcd0f168e";

async function testApi() {
    try {
        console.log("Fetching Zepto API via Proxy...");
        const response = await axios.get("http://api.scrape.do/", {
            params: {
              token: SCRAPE_DO_TOKEN,
              url: "https://api.zeptonow.com/api/v3/search?q=milk",
              super: "true",
              geoCode: "in",
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "app-version": "14.28.1", // Needed for Zepto API sometimes
            }
        });
        console.log("Zepto API Response type:", typeof response.data);
        console.log("Zepto Data Sample:", JSON.stringify(response.data).substring(0, 300));

    } catch (e) {
        console.error("Zepto Error:", e.message);
        if (e.response) console.error(e.response.data);
    }
}
testApi();
