"use client";

import { motion } from "framer-motion";
import { SearchForm } from "@/components/SearchForm";
import { Zap, Wallet, Timer, ShieldCheck } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#050505] text-zinc-50 flex items-center justify-center">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-teal-500/20 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20 sm:py-32 flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="w-full flex flex-col items-center text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm text-sm text-emerald-400 font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Real-time Prices
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            Find the <span className="text-gradient">Cheapest</span> <br className="hidden sm:block" />
            10-Min Groceries.
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-12 font-medium"
          >
            Search once, compare everywhere. Get live prices and ETAs from Blinkit, Zepto, Swiggy Instamart, and BigBasket instantly.
          </motion.p>
          
          <motion.div variants={itemVariants} className="w-full flex justify-center">
            <SearchForm />
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl"
        >
          <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <Wallet size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Save Money</h3>
            <p className="text-zinc-400 font-medium">Compare total cart value including hidden delivery fees and surge pricing in real-time.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
              <Timer size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Save Time</h3>
            <p className="text-zinc-400 font-medium">Don't open 4 different apps. See exactly who can deliver your items the fastest right now.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
              <Zap size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Buy Directly</h3>
            <p className="text-zinc-400 font-medium">One click takes you straight to the cheapest app's checkout with your pre-filled cart.</p>
          </motion.div>
        </motion.div>

        {/* Live Logo Marquee */}
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ delay: 0.5, duration: 1 }}
           viewport={{ once: true }}
           className="mt-20 pt-10 border-t border-white/5 w-full max-w-3xl flex flex-col items-center"
        >
          <p className="text-sm font-semibold text-zinc-500 tracking-widest uppercase mb-8">Supported Platforms</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {["Blinkit", "Zepto", "Swiggy Instamart", "BigBasket"].map((app, i) => (
              <span key={i} className="text-xl sm:text-2xl font-bold text-white tracking-widest">{app}</span>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
