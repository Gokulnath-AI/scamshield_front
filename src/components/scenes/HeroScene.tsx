"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

export default function HeroScene() {
  const setAnalysisOpen = useAppStore((s) => s.setAnalysisOpen);

  return (
    <section className="scene-section relative" aria-label="ScamShield Hero">
      <div className="max-w-4xl mx-auto px-6 text-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-6 backdrop-blur-sm">
            AI-Powered Scam Detection
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-6 font-[family-name:var(--font-display)]"
        >
          <span className="text-foreground">Scam</span>
          <span className="text-primary">Shield</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Protecting millions of Indians from digital fraud with real-time ML-powered scam detection.
        </motion.p>

        {/* Launch Analysis Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <button
            onClick={() => setAnalysisOpen(true)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-deep text-white rounded-2xl font-semibold text-base transition-all duration-300 cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Try Live Analysis
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-14 flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {[
            { value: "1.2M+", label: "Scams Detected" },
            { value: "₹847Cr", label: "Fraud Prevented" },
            { value: "96.8%", label: "Accuracy" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1 tracking-wide uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Swipe hint at right edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 pointer-events-auto"
      >
        <button
          onClick={() => setAnalysisOpen(true)}
          className="group flex flex-col items-center gap-2 cursor-pointer p-3"
          aria-label="Open analysis page"
        >
          <motion.div
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-1 text-slate-400 group-hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <ChevronRight className="w-4 h-4 -ml-2.5 opacity-60" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors writing-mode-vertical"
            style={{ writingMode: "vertical-rl" }}
          >
            Analyze
          </span>
        </button>
      </motion.div>
    </section>
  );
}
