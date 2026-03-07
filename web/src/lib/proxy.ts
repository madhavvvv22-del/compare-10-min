import axios from "axios";

const SCRAPE_DO_TOKEN = "c879953997714c4c92b6927de152a673a5dcd0f168e";

/**
 * Fetches HTML perfectly bypassing Cloudflare by using Scrape.do Proxies
 */
export async function fetchWithProxy(targetUrl: string): Promise<string> {
  try {
    const response = await axios.get("http://api.scrape.do/", {
      params: {
        token: SCRAPE_DO_TOKEN,
        url: targetUrl,
        render: "true", // Scrape.do parameter to run JS
        super: "true", // Scrape.do parameter for residential proxies
        geoCode: "in", // Route through India
      },
    });
    return response.data;
  } catch (err: any) {
    console.error("Scrape.do Error:", err?.response?.data || err.message);
    throw new Error("Failed to bypass bot protection");
  }
}
