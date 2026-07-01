"use client";

import { motion } from "framer-motion";
import {
  Smartphone, KeyRound, Link, Briefcase,
  TrendingUp, IndianRupee, Package, MessageCircle,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { scamTypes } from "@/data/mock";

const iconMap = {
  Smartphone, KeyRound, Link, Briefcase,
  TrendingUp, IndianRupee, Package, MessageCircle,
} as const;

const riskColors: Record<string, string> = {
  Critical: "bg-red-50 text-red-600 border-red-100",
  High: "bg-orange-50 text-orange-600 border-orange-100",
  Medium: "bg-yellow-50 text-yellow-600 border-yellow-100",
};

export default function ScamTypes() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          badge="Threats"
          title="Scam Types We Detect"
          subtitle="Our ML models are trained on real Indian scam datasets covering all major fraud categories."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {scamTypes.map((scam) => {
            const Icon = iconMap[scam.icon];
            return (
              <motion.div key={scam.name} variants={fadeInUp}>
                <GlassCard variant="strong" className="p-5 h-full cursor-pointer">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${scam.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: scam.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{scam.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{scam.description}</p>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${riskColors[scam.risk]}`}>
                    {scam.risk} Risk
                  </span>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
