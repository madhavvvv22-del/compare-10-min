import { SearchForm } from "@/components/SearchForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <main className="max-w-3xl mx-auto px-4 py-20 sm:py-32">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-2">
          Compare 10-Min Delivery
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-center mb-10">
          Search for groceries and compare prices across Blinkit, Zepto, BigBasket & Instamart. Buy from the cheapest store.
        </p>
        <div className="flex justify-center">
          <SearchForm />
        </div>
        <div className="mt-16 grid sm:grid-cols-2 gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Compare prices
            </h3>
            See the same product across multiple quick-commerce apps and pick the best deal.
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Buy directly
            </h3>
            Click through to complete your purchase on Blinkit, Zepto, or your preferred app.
          </div>
        </div>
      </main>
    </div>
  );
}
