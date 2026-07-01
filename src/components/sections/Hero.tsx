"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  const [input, setInput] = useState("");

  const scrollToDemo = () => {
    const el = document.getElementById("demo");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/50 to-blue-100/30 bg-grid">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <h1 className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-black text-slate-900/[0.04] tracking-tighter whitespace-nowrap leading-none">
          ScamShield
        </h1>
      </div>

      {/* Floating glass elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] left-[15%] w-32 h-32 md:w-44 md:h-44 glass-card rotate-12 animate-float opacity-40" />
        <div className="absolute top-[25%] right-[18%] w-28 h-28 md:w-40 md:h-40 glass-card -rotate-6 animate-float-delayed opacity-35" />
        <motion.div
          className="absolute top-[18%] left-1/2 -translate-x-1/2"
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="glass-card p-6 md:p-8">
            <Shield className="w-12 h-12 md:w-16 md:h-16 text-primary/30" strokeWidth={1} />
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-32 pb-20"
      >
        <motion.span
          variants={fadeInUp}
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50 border border-blue-100 mb-6"
        >
          AI-Powered Scam Detection
        </motion.span>

        <motion.h2
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6"
        >
          Paste anything suspicious below.
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-slate-500 mb-10 max-w-xl mx-auto"
        >
          Instantly detect UPI fraud, phishing links, fake job offers, and more with our ML-powered analysis engine built for India.
        </motion.p>

        <motion.div variants={fadeInUp} className="relative max-w-2xl mx-auto">
          <div className="glass-card-strong flex items-center gap-3 px-5 py-3">
            <Sparkles className="w-5 h-5 text-primary/50 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a message, URL, email, or phone number to analyze..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-slate-400 text-sm md:text-base"
              onKeyDown={(e) => e.key === "Enter" && scrollToDemo()}
            />
            <button
              onClick={scrollToDemo}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary-deep text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              aria-label="Analyze scam"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {[
            { value: "1.2M+", label: "Scams Detected" },
            { value: "₹847Cr", label: "Fraud Prevented" },
            { value: "< 2s", label: "Response Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
