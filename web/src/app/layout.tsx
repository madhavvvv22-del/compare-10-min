import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ShoppingBasket, ShieldCheck } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "10-Min Live Compare | Find the Cheapest Groceries",
  description: "Compare real-time grocery prices across Blinkit, Zepto, Swiggy Instamart, and BigBasket. Save money and time instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-50 min-h-screen flex flex-col`}>
        {/* Navigation Navbar */}
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg group-hover:shadow-emerald-500/50 transition duration-300">
                <ShoppingBasket className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white">
                QuickCompare
              </span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
              
              <Link
                href="/basket"
                className="relative p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                title="Your Basket"
              >
                <ShoppingBasket className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-black" />
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 flex flex-col">{children}</main>
        
        {/* Footer */}
        <footer className="py-8 border-t border-zinc-200 dark:border-zinc-900/50 text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} QuickCompare. Real-time prices for 10-minute delivery apps.</p>
        </footer>
      </body>
    </html>
  );
}
