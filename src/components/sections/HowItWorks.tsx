"use client";

import { motion } from "framer-motion";
import { ClipboardPaste, Cpu, BarChart3, CheckCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { howItWorks } from "@/data/mock";

const icons = [ClipboardPaste, Cpu, BarChart3, CheckCircle];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          badge="Process"
          title="How It Works"
          subtitle="Four simple steps to detect and classify potential scams in real time."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {howItWorks.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={step.step} variants={fadeInUp}>
                <GlassCard variant="strong" className="p-6 h-full cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs font-semibold text-primary mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
