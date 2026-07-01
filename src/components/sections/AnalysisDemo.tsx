"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { fadeInUp } from "@/lib/animations";
import { sampleAnalysis } from "@/data/mock";

const riskColors: Record<string, string> = {
  Critical: "text-red-600 bg-red-50",
  High: "text-orange-600 bg-orange-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Low: "text-green-600 bg-green-50",
};

export default function AnalysisDemo() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof sampleAnalysis.result | null>(null);

  const analyze = useCallback(() => {
    if (!input.trim()) {
      setInput(sampleAnalysis.input);
    }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(sampleAnalysis.result);
    }, 2000);
  }, [input]);

  return (
    <section id="demo" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          badge="Live Demo"
          title="Real-Time Analysis"
          subtitle="Try our scam detection engine. Paste any suspicious content or use the sample below."
        />

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <GlassCard variant="strong" className="p-6 md:p-8" hover={false}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a suspicious message, URL, or transaction description..."
                rows={3}
                className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm outline-none border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              />
              <button
                onClick={analyze}
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-deep transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" style={{ animation: "shimmer 1.5s infinite" }} />
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Scam Probability</div>
                      <div className="text-2xl font-bold text-red-600">{result.probability}%</div>
                      <div className="w-full h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.probability}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Risk Level</div>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <span className={`px-2.5 py-0.5 rounded-full text-sm font-semibold ${riskColors[result.riskLevel]}`}>
                          {result.riskLevel}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1">Detected Type</div>
                      <div className="text-base font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {result.scamType}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs text-slate-400 mb-2">Key Indicators</div>
                    <div className="flex flex-wrap gap-2">
                      {result.indicators.map((ind) => (
                        <span key={ind} className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full border border-red-100">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-green-700 font-medium mb-1">Recommended Action</div>
                      <p className="text-sm text-green-800">{result.action}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
