"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Preload, AdaptiveDpr } from "@react-three/drei";
import CameraRig from "./CameraRig";
import SceneLights from "./SceneLights";
import AICore from "./AICore";
import NetworkConstellation from "./NetworkConstellation";
import PostFX from "./PostFX";
import { useAppStore } from "@/stores/useAppStore";

export default function SceneCanvas() {
  const gpuTier = useAppStore((s) => s.gpuTier);

  return (
    <div className="canvas-container">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0.5, 14], fov: 45, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <CameraRig />
        <SceneLights />

        <Suspense fallback={null}>
          <AICore />
          <NetworkConstellation />
          <Environment preset="city" environmentIntensity={0.25} />
          <Preload all />
        </Suspense>

        {gpuTier >= 2 && <PostFX />}
      </Canvas>
    </div>
  );
}
