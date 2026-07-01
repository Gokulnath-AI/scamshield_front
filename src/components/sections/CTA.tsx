"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function CTA() {
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
    <section id="cta" className="py-24 px-6 bg-gradient-to-b from-white to-blue-50/50">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <div className="glass-card-strong p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Protect Yourself from Digital Fraud
            </h2>
            <p className="text-slate-500 mb-8 max-w-lg mx-auto">
              Join thousands of Indians using ScamShield to stay safe from UPI fraud, phishing, and online scams.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-xl px-6 py-4 mx-auto max-w-sm"
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
                  className="flex-1 px-5 py-3 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-deep transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  Get Early Access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
