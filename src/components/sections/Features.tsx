"use client";

import { motion } from "framer-motion";
import { Languages, Smartphone, MessageCircle, Link, Zap, Brain } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { features } from "@/data/mock";

const iconMap = { Languages, Smartphone, MessageCircle, Link, Zap, Brain } as const;

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          badge="Features"
          title="Built for India's Digital Ecosystem"
          subtitle="Purpose-built tools to protect against the most common scam vectors in India."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const Icon = iconMap[f.icon];
            return (
              <motion.div key={f.title} variants={fadeInUp}>
                <GlassCard variant="strong" className="p-6 h-full cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
