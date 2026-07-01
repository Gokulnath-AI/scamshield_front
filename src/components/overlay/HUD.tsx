"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Scan } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const navLinks = [
  { label: "How it works", scene: 1 },
  { label: "Features", scene: 3 },
  { label: "Stats", scene: 4 },
];

export default function HUD() {
  const scrollProgress = useAppStore((s) => s.scrollProgress);
  const setAnalysisOpen = useAppStore((s) => s.setAnalysisOpen);
  const analysisOpen = useAppStore((s) => s.analysisOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(scrollProgress > 0.03);
  }, [scrollProgress]);

  const scrollToScene = (sceneIndex: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (sceneIndex / 7) * totalHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setMobileOpen(false);
  };

  if (analysisOpen) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className="glass max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 cursor-pointer"
              aria-label="Scroll to top"
            >
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-base font-bold tracking-tight font-[family-name:var(--font-display)]">
                <span className="text-foreground">SCAM</span>
                <span className="text-primary">SHIELD</span>
              </span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToScene(link.scene)}
                  className="text-sm font-medium text-slate-500 hover:text-primary transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => setAnalysisOpen(true)}
                className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary-deep transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Scan className="w-3.5 h-3.5" />
                Analyze
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass max-w-5xl mx-auto mt-2 px-6 py-4 md:hidden"
              >
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => scrollToScene(link.scene)}
                      className="text-sm font-medium text-slate-600 hover:text-primary py-2 text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { setAnalysisOpen(true); setMobileOpen(false); }}
                    className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-full text-center hover:bg-primary-deep transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Scan className="w-3.5 h-3.5" />
                    Analyze
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
