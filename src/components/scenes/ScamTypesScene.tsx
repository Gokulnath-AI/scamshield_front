"use client";

import { motion } from "framer-motion";
import {
  Smartphone, KeyRound, Link, Briefcase,
  TrendingUp, IndianRupee, Package, MessageCircle,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { scamTypes } from "@/data/mock";

const iconMap = { Smartphone, KeyRound, Link, Briefcase, TrendingUp, IndianRupee, Package, MessageCircle } as const;

const riskStyle: Record<string, string> = {
  Critical: "bg-red-50/80 text-red-600 border-red-200/50",
  High: "bg-orange-50/80 text-orange-600 border-orange-200/50",
  Medium: "bg-yellow-50/80 text-yellow-600 border-yellow-200/50",
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ScamTypesScene() {
  return (
    <section className="scene-section relative" aria-label="Scam types detected">
      <div className="max-w-6xl mx-auto px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-4 backdrop-blur-sm">
            Threat Intelligence
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
            Scam Types We Detect
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Trained on real Indian scam datasets covering every major fraud vector.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {scamTypes.map((scam) => {
            const Icon = iconMap[scam.icon];
            return (
              <motion.div key={scam.name} variants={fadeUp}>
                <GlassPanel variant="strong" noise className="p-5 h-full cursor-pointer group">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${scam.color}12` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: scam.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{scam.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{scam.description}</p>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${riskStyle[scam.risk]}`}>
                    {scam.risk}
                  </span>
                </GlassPanel>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
