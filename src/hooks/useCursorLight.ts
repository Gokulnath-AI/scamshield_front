"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

export function useCursorLight() {
  const setCursorPosition = useAppStore((s) => s.setCursorPosition);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setCursorPosition(e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [setCursorPosition]);
}
