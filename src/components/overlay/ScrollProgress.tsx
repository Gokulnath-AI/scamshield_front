"use client";

import { useAppStore } from "@/stores/useAppStore";

export default function ScrollProgress() {
  const progress = useAppStore((s) => s.scrollProgress);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary-accent to-cyan-accent transition-[width] duration-100 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
