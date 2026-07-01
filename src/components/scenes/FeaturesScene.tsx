"use client";

import { motion } from "framer-motion";
import { Languages, Smartphone, MessageCircle, Link, Zap, Brain } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { features } from "@/data/mock";

const iconMap = { Languages, Smartphone, MessageCircle, Link, Zap, Brain } as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function FeaturesScene() {
  return (
    <section className="scene-section relative" id="features" aria-label="ScamShield features">
      <div className="max-w-5xl mx-auto px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-4 backdrop-blur-sm">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
            Built for India&apos;s Digital Ecosystem
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Purpose-built tools to protect against every major scam vector.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <motion.div key={f.title} variants={fadeUp}>
                <GlassPanel variant="strong" noise className="p-6 h-full cursor-pointer group">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mb-4 border border-blue-100/40 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </GlassPanel>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
