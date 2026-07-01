"use client";

import { useEffect } from "react";
import { getGPUTier } from "detect-gpu";
import { useAppStore } from "@/stores/useAppStore";

export function useGPUTier() {
  const setGpuTier = useAppStore((s) => s.setGpuTier);
  const gpuTier = useAppStore((s) => s.gpuTier);

  useEffect(() => {
    (async () => {
      try {
        const result = await getGPUTier();
        setGpuTier(result.tier);
      } catch {
        setGpuTier(1);
      }
    })();
  }, [setGpuTier]);

  return gpuTier;
}
