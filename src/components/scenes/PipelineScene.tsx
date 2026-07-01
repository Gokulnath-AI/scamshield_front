"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Cpu, BarChart3, CheckCircle } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import { howItWorks } from "@/data/mock";

const icons = [ClipboardPaste, Cpu, BarChart3, CheckCircle];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function PipelineScene() {
  return (
    <section className="scene-section relative" id="how-it-works" aria-label="How ScamShield works">
      <div className="max-w-5xl mx-auto px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-4 backdrop-blur-sm">
            Pipeline
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
            How It Works
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            From suspicious content to actionable insight in under 2 seconds.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {howItWorks.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={step.step} variants={fadeUp}>
                <GlassPanel variant="strong" noise className="p-6 h-full cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center border border-blue-100/40">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary/60 tracking-widest">0{step.step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </GlassPanel>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
