"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/stores/useAppStore";

export default function SceneLights() {
  const orbiter1 = useRef<THREE.PointLight>(null);
  const orbiter2 = useRef<THREE.PointLight>(null);
  const orbiter3 = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = useAppStore.getState().scrollProgress;

    // Orbiting accent lights with smooth sinusoidal paths
    if (orbiter1.current) {
      orbiter1.current.position.set(
        Math.cos(t * 0.25) * 8,
        Math.sin(t * 0.15) * 3 + 2,
        Math.sin(t * 0.25) * 8,
      );
      orbiter1.current.intensity = 0.12 + Math.sin(t * 0.8) * 0.04 + progress * 0.08;
    }

    if (orbiter2.current) {
      orbiter2.current.position.set(
        Math.cos(t * 0.18 + Math.PI) * 7,
        Math.sin(t * 0.22 + 1) * 2.5 - 1,
        Math.sin(t * 0.18 + Math.PI) * 7,
      );
      orbiter2.current.intensity = 0.1 + Math.sin(t * 0.6 + 1) * 0.03;
    }

    if (orbiter3.current) {
      orbiter3.current.position.set(
        Math.cos(t * 0.12 + 2) * 10,
        Math.sin(t * 0.1) * 4,
        Math.sin(t * 0.12 + 2) * 10,
      );
      orbiter3.current.intensity = 0.08 + Math.sin(t * 0.5 + 2) * 0.03;
    }

    // Spotlight follows scroll
    if (spotRef.current) {
      spotRef.current.position.y = 8 + Math.sin(t * 0.2) * 1;
      spotRef.current.intensity = 0.6 + progress * 0.3;
    }
  });

  return (
    <>
      {/* Key light — warm white, upper-right */}
      <directionalLight position={[5, 8, 5]} intensity={1.4} color="#fff8f2" />

      {/* Fill light — cool blue, lower-left */}
      <directionalLight position={[-4, -2, 3]} intensity={0.55} color="#dbeafe" />

      {/* Rim light — cyan accent, behind-above */}
      <directionalLight position={[0, 6, -6]} intensity={0.7} color="#06b6d4" />

      {/* Secondary rim — subtle violet from below */}
      <directionalLight position={[-3, -4, -2]} intensity={0.2} color="#a78bfa" />

      {/* Overhead spot for dramatic focus */}
      <spotLight
        ref={spotRef}
        position={[0, 8, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.6}
        color="#eff6ff"
        distance={25}
        decay={2}
      />

      {/* Ambient — slightly blue-tinted */}
      <ambientLight intensity={0.3} color="#eff6ff" />

      {/* Hemisphere light for soft sky/ground gradient */}
      <hemisphereLight
        color="#dbeafe"
        groundColor="#fef3c7"
        intensity={0.25}
      />

      {/* Orbiting accent lights */}
      <pointLight ref={orbiter1} color="#3b82f6" distance={25} decay={2} />
      <pointLight ref={orbiter2} color="#06b6d4" distance={20} decay={2} />
      <pointLight ref={orbiter3} color="#8b5cf6" distance={22} decay={2} />
    </>
  );
}
