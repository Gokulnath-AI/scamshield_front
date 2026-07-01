"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/stores/useAppStore";

/* ─── Nucleus — solid dark sphere with subtle sheen ─── */
function Nucleus() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const breathe = 1 + Math.sin(t * 0.8) * 0.015 + Math.sin(t * 2.1) * 0.008;
    ref.current.scale.setScalar(0.55 * breathe);
    ref.current.rotation.y = t * 0.05;

    if (glowRef.current) {
      const pulse = 0.06 + Math.sin(t * 1.4) * 0.03;
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity = pulse;
      glowRef.current.scale.setScalar(0.75 * breathe);
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.15}
          metalness={0.9}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* Subtle blue glow around nucleus */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={0.6}
          transparent
          opacity={0.06}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

/* ─── Single electron ─── */
function Electron({ orbitRadius, speed, tilt, phase, size }: {
  orbitRadius: number;
  speed: number;
  tilt: [number, number, number];
  phase: number;
  size: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = t * speed + phase;

    if (meshRef.current) {
      meshRef.current.position.set(
        Math.cos(angle) * orbitRadius,
        0,
        Math.sin(angle) * orbitRadius,
      );
    }

    if (trailRef.current) {
      const trailMat = trailRef.current.material as THREE.MeshStandardMaterial;
      trailMat.opacity = 0.08 + Math.sin(t * 2 + phase) * 0.03;
    }
  });

  return (
    <group ref={groupRef} rotation={tilt}>
      {/* Orbit ring */}
      <mesh ref={trailRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.008, orbitRadius + 0.008, 128]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#2563eb"
          emissiveIntensity={0.3}
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Electron sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 20, 20]} />
        <meshStandardMaterial
          color="#3b82f6"
          emissive="#2563eb"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

/* ─── Orbital electron shells ─── */
function ElectronShells() {
  const electrons = useMemo(() => [
    // Shell 1 — tight, fast
    { orbitRadius: 1.4, speed: 1.8, tilt: [0.3, 0, 0] as [number, number, number], phase: 0, size: 0.07 },
    { orbitRadius: 1.4, speed: 1.8, tilt: [0.3, 0, 0] as [number, number, number], phase: Math.PI, size: 0.07 },

    // Shell 2 — medium
    { orbitRadius: 2.0, speed: 1.2, tilt: [1.2, 0.4, 0] as [number, number, number], phase: 0, size: 0.065 },
    { orbitRadius: 2.0, speed: 1.2, tilt: [1.2, 0.4, 0] as [number, number, number], phase: Math.PI * 0.66, size: 0.065 },
    { orbitRadius: 2.0, speed: 1.2, tilt: [1.2, 0.4, 0] as [number, number, number], phase: Math.PI * 1.33, size: 0.065 },

    // Shell 3 — wide, slow
    { orbitRadius: 2.8, speed: 0.7, tilt: [-0.5, 1.1, 0.3] as [number, number, number], phase: 0, size: 0.06 },
    { orbitRadius: 2.8, speed: 0.7, tilt: [-0.5, 1.1, 0.3] as [number, number, number], phase: Math.PI * 0.5, size: 0.06 },
    { orbitRadius: 2.8, speed: 0.7, tilt: [-0.5, 1.1, 0.3] as [number, number, number], phase: Math.PI, size: 0.06 },
    { orbitRadius: 2.8, speed: 0.7, tilt: [-0.5, 1.1, 0.3] as [number, number, number], phase: Math.PI * 1.5, size: 0.06 },

    // Shell 4 — widest
    { orbitRadius: 3.6, speed: 0.45, tilt: [0.8, -0.6, 0.5] as [number, number, number], phase: 0, size: 0.055 },
    { orbitRadius: 3.6, speed: 0.45, tilt: [0.8, -0.6, 0.5] as [number, number, number], phase: Math.PI * 0.4, size: 0.055 },
    { orbitRadius: 3.6, speed: 0.45, tilt: [0.8, -0.6, 0.5] as [number, number, number], phase: Math.PI * 0.8, size: 0.055 },
    { orbitRadius: 3.6, speed: 0.45, tilt: [0.8, -0.6, 0.5] as [number, number, number], phase: Math.PI * 1.2, size: 0.055 },
    { orbitRadius: 3.6, speed: 0.45, tilt: [0.8, -0.6, 0.5] as [number, number, number], phase: Math.PI * 1.6, size: 0.055 },
  ], []);

  return (
    <>
      {electrons.map((e, i) => (
        <Electron key={i} {...e} />
      ))}
    </>
  );
}

/* ─── Particle cloud around atom ─── */
function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  const { positions, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 3.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      spd[i] = 0.1 + Math.random() * 0.4;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, phases: phs };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = arr[idx];
      const z = arr[idx + 2];
      const angle = Math.atan2(z, x) + speeds[i] * 0.004;
      const dist = Math.sqrt(x * x + z * z);

      arr[idx] = Math.cos(angle) * dist;
      arr[idx + 1] += Math.sin(t * speeds[i] + phases[i]) * 0.001;
      arr[idx + 2] = Math.sin(angle) * dist;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#60a5fa"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Energy pulse rings expanding outward ─── */
function EnergyPulses() {
  const count = 4;
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (t * 0.5 + i * (Math.PI * 2 / count)) % (Math.PI * 2);
      const progress = phase / (Math.PI * 2);
      mesh.scale.setScalar(0.6 + progress * 4);
      (mesh.material as THREE.MeshStandardMaterial).opacity = (1 - progress) * 0.06;
    });
  });

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.97, 1, 80]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#2563eb"
            emissiveIntensity={0.5}
            transparent
            opacity={0.05}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─── Glass shield emblem floating near nucleus ─── */
function ShieldEmblem() {
  const ref = useRef<THREE.Mesh>(null);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const r = 0.5;
    s.moveTo(0, r);
    s.bezierCurveTo(r * 0.6, r * 0.95, r, r * 0.5, r, 0);
    s.bezierCurveTo(r, -r * 0.5, r * 0.5, -r * 0.85, 0, -r * 1.1);
    s.bezierCurveTo(-r * 0.5, -r * 0.85, -r, -r * 0.5, -r, 0);
    s.bezierCurveTo(-r, r * 0.5, -r * 0.6, r * 0.95, 0, r);
    return s;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.5;
    ref.current.rotation.x = Math.sin(t * 0.18) * 0.1;
    ref.current.position.y = Math.sin(t * 0.4) * 0.03;
    ref.current.scale.setScalar(0.28 + Math.sin(t * 0.6) * 0.01);
  });

  return (
    <mesh ref={ref}>
      <extrudeGeometry args={[shape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 4,
        curveSegments: 32,
      }]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={0.2}
        chromaticAberration={0.015}
        ior={1.5}
        color="#93c5fd"
        roughness={0.05}
        transmission={0.9}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={1.6}
      />
    </mesh>
  );
}

/* ─── Main atom export ─── */
export default function AICore() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const progress = useAppStore.getState().scrollProgress;
    groupRef.current.rotation.y = t * 0.03 + progress * Math.PI * 0.3;
    groupRef.current.position.y = Math.sin(t * 0.25) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <Nucleus />
      <ShieldEmblem />
      <ElectronShells />
      <ParticleCloud />
      <EnergyPulses />
    </group>
  );
}
