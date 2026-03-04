# Compare 10-Min Delivery

A web app that compares grocery product prices across quick-commerce platforms (Blinkit, Zepto, BigBasket, Instamart) and lets users buy from the cheapest option.

## Features

- **Price comparison**: Search for products and see prices across multiple 10-minute delivery apps
- **Basket comparison**: Add items to a basket and see total cost per store
- **Sorting & filtering**: Sort by price, delivery time, or discount; group same products across stores
- **User preferences**: Saved location (pincode) for faster searches
- **Admin dashboard**: Enable/disable providers, view recent search analytics

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- In-memory caching (5 min TTL)
- Mock providers (ready to swap with real scrapers)

## Getting started

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
web/
├── src/
│   ├── app/           # Pages and API routes
│   │   ├── api/       # /api/search, /api/stores, /api/admin/*
│   │   ├── admin/     # Admin dashboard
│   │   ├── basket/    # Basket comparison
│   │   └── search/    # Search results
│   ├── components/    # SearchForm, ProductCard, ComparisonGrid
│   ├── providers/     # Provider adapters (Blinkit, Zepto, BigBasket, Instamart)
│   ├── hooks/         # useBasket, usePreferences
│   ├── lib/           # Cache, analytics, normalization
│   └── types/         # Product schema
```

## Provider integration

Currently uses **mock providers** that return realistic fake data. To integrate real data:

1. Implement scraper in `src/providers/` (e.g. Playwright for Blinkit)
2. Implement the `ProviderAdapter` interface: `searchProducts`, `buildBuyUrl`
3. Replace mock in `src/providers/index.ts`

Note: These platforms do not offer official public APIs. Scraping may violate their terms of service. Use responsibly and consider legal counsel for production use.

## License

MIT
