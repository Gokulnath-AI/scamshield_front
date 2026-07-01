"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, ShieldAlert, CheckCircle, Loader2, Sparkles } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import MagneticButton from "@/components/ui/MagneticButton";
import { sampleAnalysis } from "@/data/mock";

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function DemoScene() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof sampleAnalysis.result | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);

  const analyze = useCallback(() => {
    const text = input.trim() || sampleAnalysis.input;
    if (!input.trim()) setInput(sampleAnalysis.input);

    setTokens(text.split(/\s+/).slice(0, 20));
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setTokens([]);
      setLoading(false);
      setResult(sampleAnalysis.result);
    }, 2500);
  }, [input]);

  return (
    <section className="scene-section relative" id="demo" aria-label="Live scam analysis demo">
      <div className="max-w-3xl mx-auto px-6 pointer-events-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-primary bg-blue-50/80 border border-blue-100/60 mb-4 backdrop-blur-sm">
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
            Real-Time Analysis
          </h2>
          <p className="mt-4 text-slate-500 max-w-md mx-auto">
            Paste any suspicious content. Watch the AI think.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <GlassPanel variant="strong" noise className="p-6 md:p-8" hover={false}>
            <div className="flex flex-col gap-3 mb-6">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a suspicious message, URL, or transaction description..."
                rows={3}
                className="w-full bg-white/60 rounded-xl px-4 py-3 text-sm outline-none border border-slate-200/60 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none backdrop-blur-sm"
                aria-label="Suspicious content input"
              />
              <MagneticButton
                onClick={analyze}
                disabled={loading}
                className="w-full sm:w-auto self-end px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-deep transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Processing..." : "Analyze Content"}
              </MagneticButton>
            </div>

            {/* Token stream animation */}
            <AnimatePresence>
              {tokens.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-1.5 mb-4"
                >
                  {tokens.map((token, i) => (
                    <motion.span
                      key={`${token}-${i}`}
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="px-2 py-0.5 bg-blue-50 text-primary text-xs rounded-md border border-blue-100/50 font-mono"
                    >
                      {token}
                    </motion.span>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: tokens.length * 0.05 }}
                    className="flex items-center gap-1.5 text-xs text-primary/60"
                  >
                    <Sparkles className="w-3 h-3" />
                    extracting features...
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading skeleton */}
            {loading && tokens.length === 0 && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-100/60 rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            <AnimatePresence>
              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                  role="status"
                  aria-live="polite"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/60 rounded-xl p-4 border border-slate-100/60 backdrop-blur-sm">
                      <div className="text-xs text-slate-400 mb-1">Scam Probability</div>
                      <div className="text-3xl font-bold text-red-600 tracking-tight">{result.probability}%</div>
                      <div className="w-full h-1.5 bg-slate-200/60 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.probability}%` }}
                          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const }}
                          className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 border border-slate-100/60 backdrop-blur-sm">
                      <div className="text-xs text-slate-400 mb-1">Risk Level</div>
                      <div className="flex items-center gap-2 mt-1">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-50 text-red-600 border border-red-200/50">
                          {result.riskLevel}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 border border-slate-100/60 backdrop-blur-sm">
                      <div className="text-xs text-slate-400 mb-1">Detected Type</div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2 mt-1">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        {result.scamType}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-xl p-4 border border-slate-100/60 backdrop-blur-sm">
                    <div className="text-xs text-slate-400 mb-2">Key Indicators</div>
                    <div className="flex flex-wrap gap-2">
                      {result.indicators.map((ind, i) => (
                        <motion.span
                          key={ind}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className="px-3 py-1 bg-red-50/80 text-red-600 text-xs rounded-full border border-red-100/60"
                        >
                          {ind}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50/80 rounded-xl p-4 border border-green-200/50 flex gap-3 backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-green-700 font-semibold mb-1">Recommended Action</div>
                      <p className="text-sm text-green-800">{result.action}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}
