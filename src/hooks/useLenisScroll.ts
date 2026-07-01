"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useAppStore } from "@/stores/useAppStore";

export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 2,
      wheelMultiplier: 1.2,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
      lenis.destroy();
    };
  }, [setScrollProgress]);

  return lenisRef;
}
