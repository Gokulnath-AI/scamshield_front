"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Shield, ShieldAlert, CheckCircle,
  Loader2, Sparkles, ChevronLeft, Zap, Brain, Eye, FileWarning,
  BarChart3, Clock, Fingerprint, Globe, ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import dynamic from "next/dynamic";

const GlobeBackground = dynamic(() => import("@/components/three/GlobeBackground"), { ssr: false });

// ── Backend Connection ──────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://scamshield-14i0.onrender.com";

const exampleMessages = [
  "Congratulations! You've won ₹50,00,000 in KBC Lucky Draw. Send ₹5,000 to claim.",
  "Dear customer, your SBI account will be blocked. Update KYC immediately: http://sbi-kyc.fake.in",
  "Hi, I'm calling from Amazon. Your order #8834 has a customs hold. Pay ₹2,499 to release.",
  "Invest ₹10,000 in crypto and earn ₹1,00,000 in 7 days! Guaranteed returns. Join now.",
  "Your OTP is 847291. DO NOT share this with anyone. — But sir, I need it for verification.",
];

const panelClass = "rounded-2xl bg-[#0a0a1a]/70 border border-white/[0.07] backdrop-blur-xl shadow-2xl shadow-black/40";

interface AnalysisResult {
  probability: number;
  riskLevel: string;
  scamType: string;
  indicators: string[];
  action: string;
  isScam: boolean;
}

// ── Maps your FastAPI response to the UI ────────────────────────
// Backend returns:
//   prediction: "spam"|"ham"
//   spam_probability: 0.0-1.0
//   ham_probability: 0.0-1.0
//   scam_score: 0-100
//   risk_level: "High"|"Medium"|"Low"|"Safe"
//   recommended_action: "..."
function mapBackendResponse(data: Record<string, unknown>): AnalysisResult {
  const prediction = data.prediction as string;
  const isScam = prediction === "spam";

  const probability = (data.scam_score as number) ?? ((data.spam_probability as number) ?? 0) * 100;
  const rounded = Math.round(probability * 10) / 10;

  const riskLevel = (data.risk_level as string) ?? "Unknown";
  const action = (data.recommended_action as string) ?? (
    isScam
      ? "Do NOT click any links or share personal info. Block the sender and report to cybercrime.gov.in"
      : "This content appears safe. Always stay vigilant and verify sender identity for financial requests."
  );

  let scamType = "Legitimate Content";
  if (isScam) {
    if (riskLevel === "High") scamType = "High-Risk Scam";
    else if (riskLevel === "Medium") scamType = "Suspicious Content";
    else scamType = "Potential Spam";
  }

  let indicators: string[] = [];
  if (isScam) {
    if (rounded >= 80) {
      indicators = ["Strong scam language detected", "Urgency/pressure tactics", "Suspicious link or number", "Known fraud template match"];
    } else if (rounded >= 50) {
      indicators = ["Moderate scam signals", "Promotional pressure language", "Unverified claims"];
    } else {
      indicators = ["Mild spam indicators", "Borderline promotional content"];
    }
  } else {
    indicators = ["No threat indicators found", "Content appears legitimate"];
  }

  return { probability: rounded, riskLevel, scamType, indicators, action, isScam };
}

export default function AnalysisPage() {
  const analysisOpen = useAppStore((s) => s.analysisOpen);
  const setAnalysisOpen = useAppStore((s) => s.setAnalysisOpen);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [phase, setPhase] = useState<"idle" | "tokenizing" | "analyzing" | "done">("idle");
  const [serverWaking, setServerWaking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const analyzeStartTime = useRef<number>(0);

  useEffect(() => {
    if (analysisOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 400);
    }
  }, [analysisOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && analysisOpen) setAnalysisOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [analysisOpen, setAnalysisOpen]);

  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (diff > 80) setAnalysisOpen(false);
  };

  const reset = useCallback(() => {
    setInput("");
    setResult(null);
    setError("");
    setTokens([]);
    setPhase("idle");
    setLoading(false);
    setServerWaking(false);
  }, []);

  const analyze = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    setResult(null);
    setError("");
    setPhase("tokenizing");
    setLoading(true);
    analyzeStartTime.current = Date.now();

    // Tokenizing animation
    const words = text.split(/\s+/).slice(0, 25);
    setTokens([]);
    words.forEach((word, i) => {
      setTimeout(() => setTokens((prev) => [...prev, word]), i * 80);
    });

    const tokenizeMs = words.length * 80 + 400;
    setTimeout(() => {
      setPhase("analyzing");
      setTokens([]);
    }, tokenizeMs);

    const wakeTimer = setTimeout(() => setServerWaking(true), 5000);

    try {
      // ─── BACKEND CALL — sends { message: "..." } ───
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      clearTimeout(wakeTimer);
      setServerWaking(false);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status}: ${errBody || "Unknown error"}`);
      }

      const data = await res.json();
      const mapped = mapBackendResponse(data);

      const elapsed = Date.now() - analyzeStartTime.current;
      const minAnimationMs = tokenizeMs + 1200;
      const waitMore = Math.max(0, minAnimationMs - elapsed);

      setTimeout(() => {
        setPhase("done");
        setLoading(false);
        setResult(mapped);
      }, waitMore);

    } catch (e: unknown) {
      clearTimeout(wakeTimer);
      setServerWaking(false);
      setPhase("idle");
      setLoading(false);

      if (e instanceof TypeError && e.message.includes("fetch")) {
        setError("Cannot reach the backend. Check that CORS is enabled and the server is running.");
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Analysis failed — the server may be waking up (free tier). Try again in 30 seconds.");
      }
    }
  }, [input]);

  const useExample = (msg: string) => {
    setInput(msg);
    setResult(null);
    setError("");
    setPhase("idle");
  };

  return (
    <AnimatePresence>
      {analysisOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.8 }}
          className="fixed inset-0 z-[100] overflow-y-auto"
          style={{ background: "#050008" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <GlobeBackground />

          <div className="fixed inset-0 z-[1] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050008]/80 via-transparent to-[#050008]/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050008]/60 via-transparent to-[#050008]/60" />
          </div>

          {/* Top bar */}
          <div className="sticky top-0 z-50 backdrop-blur-2xl bg-[#050008]/60 border-b border-white/[0.04]">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <button
                onClick={() => setAnalysisOpen(false)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white font-[family-name:var(--font-display)]">
                  SCAM<span className="text-purple-400">SHIELD</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-600 ml-2">Analysis Engine</span>
              </div>
              <button
                onClick={() => setAnalysisOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-[2] max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left — Input */}
              <div className="lg:col-span-5 space-y-5">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-display)] mb-2">
                    Analyze Content
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Paste any suspicious message, URL, email, or phone number. Our ML pipeline will classify and explain the threat.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className={`${panelClass} p-5`}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste suspicious content here..."
                    rows={5}
                    className="w-full bg-transparent text-white placeholder:text-slate-600 text-sm outline-none resize-none leading-relaxed"
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze(); }}
                    aria-label="Content to analyze"
                  />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                      {input.length > 0 ? `${input.split(/\s+/).length} words` : "Ctrl+Enter to submit"}
                    </span>
                    <div className="flex items-center gap-2">
                      {(result || error) && (
                        <button onClick={reset} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.08] rounded-lg transition-colors cursor-pointer">
                          Clear
                        </button>
                      )}
                      <button
                        onClick={analyze}
                        disabled={loading || !input.trim()}
                        className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        {loading ? "Processing" : "Analyze"}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {loading && serverWaking && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${panelClass} !border-amber-500/[0.15] !bg-amber-950/30 p-4 flex items-start gap-3`}>
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-amber-400 font-medium mb-0.5">Server is waking up</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">Free-tier cold start on Render — this takes 30–50 seconds on the first request. Hang tight.</div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${panelClass} !border-red-500/[0.15] !bg-red-950/30 p-4 flex items-start gap-3`}>
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-red-400 font-medium mb-0.5">Analysis Failed</div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">{error}</div>
                    </div>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
                  <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-3">Try an example</p>
                  <div className="space-y-2">
                    {exampleMessages.map((msg, i) => (
                      <button key={i} onClick={() => useExample(msg)} className="w-full text-left px-4 py-2.5 rounded-xl bg-[#0a0a1a]/50 hover:bg-[#0a0a1a]/80 border border-white/[0.04] hover:border-purple-500/20 text-slate-500 hover:text-slate-300 text-xs leading-relaxed transition-all cursor-pointer line-clamp-1 backdrop-blur-sm">
                        {msg}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Brain, label: "NLP Engine", desc: "TF-IDF + XGBoost" },
                    { icon: Zap, label: "< 2s Latency", desc: "Real-time inference" },
                    { icon: Globe, label: "India-Focused", desc: "UPI, KYC, OTP scams" },
                    { icon: Fingerprint, label: "Heuristic Boost", desc: "34+ scam patterns" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#0a0a1a]/40 border border-white/[0.04] backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-purple-400/60 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-slate-300">{label}</div>
                        <div className="text-[10px] text-slate-600">{desc}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Results */}
              <div className="lg:col-span-7">
                <AnimatePresence mode="wait">

                  {phase === "idle" && !result && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`h-full min-h-[500px] ${panelClass} flex flex-col items-center justify-center gap-4`}>
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/[0.08] border border-purple-500/[0.15] flex items-center justify-center">
                        <Shield className="w-8 h-8 text-purple-400/40" />
                      </div>
                      <p className="text-slate-500 text-sm">Paste content and click Analyze</p>
                      <div className="flex items-center gap-4 mt-2">
                        {["Tokenize", "Extract", "Classify", "Explain"].map((step, i) => (
                          <div key={step} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-white/[0.08] flex items-center justify-center text-[9px] text-slate-600 font-mono">{i + 1}</div>
                            <span className="text-[10px] text-slate-600 uppercase tracking-wider">{step}</span>
                            {i < 3 && <div className="w-6 h-px bg-white/[0.06]" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {phase === "tokenizing" && (
                    <motion.div key="tokenizing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-[500px] ${panelClass} p-6`}>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-widest text-amber-400/80">Step 1 — Tokenizing</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tokens.map((token, i) => (
                          <motion.span key={`${token}-${i}`} initial={{ opacity: 0, scale: 0.5, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25 }} className="px-3 py-1.5 bg-purple-500/[0.1] text-purple-300 text-xs rounded-lg border border-purple-500/[0.15] font-mono">
                            {token}
                          </motion.span>
                        ))}
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="flex items-center gap-1.5 text-xs text-purple-400/50 ml-2">
                          <Sparkles className="w-3 h-3" />
                          extracting...
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {phase === "analyzing" && (
                    <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`min-h-[500px] ${panelClass} p-6 flex flex-col items-center justify-center gap-6`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-widest text-cyan-400/80">Step 2 — Classifying</span>
                      </div>
                      <div className="relative w-48 h-48">
                        {[0, 1, 2].map((ring) => (
                          <motion.div key={ring} className="absolute inset-0 rounded-full border border-purple-500/20" style={{ margin: ring * 20 }} animate={{ rotate: ring % 2 === 0 ? 360 : -360 }} transition={{ duration: 3 + ring, repeat: Infinity, ease: "linear" }}>
                            <div className="absolute w-2 h-2 rounded-full bg-purple-400" style={{ top: -4, left: "50%", marginLeft: -4 }} />
                          </motion.div>
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-purple-400/60" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="space-y-2 text-center">
                        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-sm text-slate-400">
                          Running inference pipeline...
                        </motion.p>
                        <div className="flex items-center gap-3 justify-center">
                          {["TF-IDF", "XGBoost", "Heuristic", "Blend"].map((step, i) => (
                            <motion.div key={step} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4, duration: 0.3 }} className="text-[10px] uppercase tracking-wider text-purple-400/50">
                              {step}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {phase === "done" && result && (
                    <motion.div key="done" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-4" role="status" aria-live="polite">

                      <div className={`${panelClass} ${result.isScam ? "!border-red-500/[0.15] !bg-red-950/40" : "!border-emerald-500/[0.15] !bg-emerald-950/40"} p-5 flex items-start gap-4`}>
                        <div className={`w-12 h-12 rounded-xl ${result.isScam ? "bg-red-500/[0.1] border-red-500/[0.2]" : "bg-emerald-500/[0.1] border-emerald-500/[0.2]"} border flex items-center justify-center shrink-0`}>
                          {result.isScam ? <ShieldAlert className="w-6 h-6 text-red-400" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-xs uppercase tracking-widest ${result.isScam ? "text-red-400/80" : "text-emerald-400/80"}`}>
                              {result.isScam ? "Threat Detected" : "Content Safe"}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${result.isScam ? "bg-red-500/20 text-red-400 border-red-500/20" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"} border uppercase tracking-wider`}>
                              {result.riskLevel}
                            </span>
                          </div>
                          <div className="text-xl font-bold text-white tracking-tight">{result.scamType}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-3xl font-bold ${result.isScam ? "text-red-400" : "text-emerald-400"} tracking-tight font-mono`}>{result.probability}%</div>
                          <div className="text-[10px] text-slate-600 uppercase tracking-wider">Scam Score</div>
                        </div>
                      </div>

                      <div className={`${panelClass} p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] uppercase tracking-widest text-slate-500">Scam Probability</span>
                          <span className={`text-sm font-mono font-bold ${result.isScam ? "text-red-400" : "text-emerald-400"}`}>{result.probability}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${result.probability}%` }} transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as const }} className={`h-full rounded-full ${result.isScam ? "bg-gradient-to-r from-amber-500 via-red-500 to-red-600" : "bg-gradient-to-r from-emerald-600 to-emerald-400"}`} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-[9px] text-slate-700">Safe</span>
                          <span className="text-[9px] text-slate-700">Suspicious</span>
                          <span className="text-[9px] text-slate-700">Dangerous</span>
                        </div>
                      </div>

                      <div className={`${panelClass} p-4`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Eye className="w-3.5 h-3.5 text-purple-400/60" />
                          <span className="text-[10px] uppercase tracking-widest text-slate-500">Key Indicators</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.indicators.map((ind, i) => (
                            <motion.span key={ind} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i }} className={`px-3 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 ${result.isScam ? "bg-red-500/[0.06] text-red-300/80 border-red-500/[0.1]" : "bg-emerald-500/[0.06] text-emerald-300/80 border-emerald-500/[0.1]"}`}>
                              {result.isScam ? <FileWarning className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                              {ind}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "ML Model", value: result.isScam ? "Spam" : "Ham", icon: BarChart3, color: result.isScam ? "text-red-400" : "text-emerald-400" },
                          { label: "Risk Level", value: result.riskLevel, icon: Globe, color: result.isScam ? "text-orange-400" : "text-emerald-400" },
                          { label: "Scam Score", value: `${result.probability}`, icon: Fingerprint, color: result.isScam ? "text-red-400" : "text-emerald-400" },
                        ].map(({ label, value, icon: Icon, color }) => (
                          <div key={label} className={`${panelClass} p-3 text-center`}>
                            <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5 opacity-60`} />
                            <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
                            <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">{label}</div>
                          </div>
                        ))}
                      </div>

                      <div className={`${panelClass} !border-emerald-500/[0.12] p-4 flex gap-3`}>
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-emerald-400/80 mb-1">Recommended Action</div>
                          <p className="text-sm text-emerald-200/80 leading-relaxed">{result.action}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          <Clock className="w-3 h-3" />
                          Analyzed via live ML pipeline
                        </div>
                        <div className="text-[10px] text-slate-700">
                          Model: XGBoost + TF-IDF + Heuristic Booster v2.2.0
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
