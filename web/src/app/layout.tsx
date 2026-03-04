import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Compare 10-Min Delivery | Blinkit, Zepto, BigBasket",
  description: "Compare grocery prices across Blinkit, Zepto, BigBasket & Instamart. Find the cheapest option and buy directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Compare 10-Min
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/basket"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                Basket
              </Link>
              <Link
                href="/admin"
                className="text-sm text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
