"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import MagneticButton from "@/components/ui/MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function CTAScene() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="scene-section relative" id="cta" aria-label="Get early access">
      <div className="max-w-2xl mx-auto px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <GlassPanel variant="strong" noise className="p-8 md:p-12 text-center relative overflow-hidden" hover={false}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto mb-6 border border-blue-100/40">
                <Shield className="w-7 h-7 text-primary" />
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight mb-3 font-[family-name:var(--font-display)]">
                Protect Yourself from Digital Fraud
              </h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Join thousands of Indians using ScamShield to stay safe from UPI fraud, phishing, and online scams.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-green-600 bg-green-50/80 rounded-xl px-6 py-4 mx-auto max-w-sm border border-green-200/50 backdrop-blur-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">You&apos;re on the list! We&apos;ll be in touch.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-5 py-3 bg-white/60 rounded-xl border border-slate-200/60 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all backdrop-blur-sm"
                    aria-label="Email address"
                  />
                  <MagneticButton
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-deep transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    Get Early Access
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </form>
              )}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
