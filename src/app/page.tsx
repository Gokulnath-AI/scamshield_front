"use client";

import dynamic from "next/dynamic";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useGPUTier } from "@/hooks/useGPUTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCursorLight } from "@/hooks/useCursorLight";

import HUD from "@/components/overlay/HUD";
import ScrollProgress from "@/components/overlay/ScrollProgress";
import CursorLight from "@/components/overlay/CursorLight";

import HeroScene from "@/components/scenes/HeroScene";
import PipelineScene from "@/components/scenes/PipelineScene";
import ScamTypesScene from "@/components/scenes/ScamTypesScene";
import FeaturesScene from "@/components/scenes/FeaturesScene";
import CTAScene from "@/components/scenes/CTAScene";
import FooterScene from "@/components/scenes/FooterScene";
import AnalysisPage from "@/components/scenes/AnalysisPage";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), { ssr: false });
const StatsScene = dynamic(() => import("@/components/scenes/StatsScene"), { ssr: false });

export default function Home() {
  useLenisScroll();
  useGPUTier();
  useReducedMotion();
  useCursorLight();

  return (
    <>
      {/* Fixed 3D background */}
      <SceneCanvas />

      {/* Cursor light effect */}
      <CursorLight />

      {/* HUD navigation */}
      <HUD />
      <ScrollProgress />

      {/* Skip link for accessibility */}
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Skip to features
      </a>

      {/* Content layer — scrolls over the 3D scene */}
      <div className="content-layer pointer-events-none">
        <HeroScene />
        <PipelineScene />
        <ScamTypesScene />
        <FeaturesScene />
        <StatsScene />
        <CTAScene />
        <FooterScene />
      </div>

      {/* Analysis page — slides in from right */}
      <AnalysisPage />
    </>
  );
}
