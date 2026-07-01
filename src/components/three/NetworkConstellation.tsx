"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore } from "@/stores/useAppStore";

export default function NetworkConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<(THREE.Mesh | null)[]>([]);
  const glowsRef = useRef<(THREE.Mesh | null)[]>([]);
  const linesRef = useRef<THREE.LineSegments>(null);

  const nodeCount = 50;

  const nodeData = useMemo(() => {
    const colors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#ef4444", "#f97316", "#22c55e", "#2563eb", "#0ea5e9"];
    return Array.from({ length: nodeCount }, (_, i) => ({
      basePosition: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 10,
      ),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 0.04 + Math.random() * 0.06,
      speed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      floatAmp: 0.1 + Math.random() * 0.3,
    }));
  }, []);

  const lineIndices = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodeData[i].basePosition.distanceTo(nodeData[j].basePosition);
        if (dist < 4.5) pairs.push([i, j]);
      }
    }
    return pairs;
  }, [nodeData]);

  const linePositions = useMemo(() => new Float32Array(lineIndices.length * 6), [lineIndices]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const progress = useAppStore.getState().scrollProgress;

    // Fade constellation based on scroll
    const visibility = Math.max(0, Math.min(1, (progress - 0.55) * 4));
    groupRef.current.visible = visibility > 0.005;
    if (!groupRef.current.visible) return;

    // Animate each node
    const currentPositions: THREE.Vector3[] = [];
    nodeData.forEach((node, i) => {
      const mesh = nodesRef.current[i];
      const glow = glowsRef.current[i];
      if (!mesh) return;

      const px = node.basePosition.x + Math.sin(t * node.speed + node.phase) * node.floatAmp;
      const py = node.basePosition.y + Math.cos(t * node.speed * 0.7 + node.phase) * node.floatAmp * 0.8;
      const pz = node.basePosition.z + Math.sin(t * node.speed * 0.5 + node.phase + 1) * node.floatAmp * 0.5;

      mesh.position.set(px, py, pz);
      currentPositions.push(new THREE.Vector3(px, py, pz));

      const pulse = 0.7 + Math.sin(t * 2 + node.phase) * 0.3;
      (mesh.material as THREE.MeshStandardMaterial).opacity = visibility * pulse;
      (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4 + Math.sin(t * 1.5 + node.phase) * 0.3;

      if (glow) {
        glow.position.copy(mesh.position);
        (glow.material as THREE.MeshStandardMaterial).opacity = visibility * pulse * 0.06;
      }
    });

    // Animate connection lines
    if (linesRef.current && currentPositions.length === nodeCount) {
      const arr = linesRef.current.geometry.attributes.position.array as Float32Array;
      lineIndices.forEach(([a, b], i) => {
        const pa = currentPositions[a];
        const pb = currentPositions[b];
        arr[i * 6] = pa.x;
        arr[i * 6 + 1] = pa.y;
        arr[i * 6 + 2] = pa.z;
        arr[i * 6 + 3] = pb.x;
        arr[i * 6 + 4] = pb.y;
        arr[i * 6 + 5] = pb.z;
      });
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = visibility * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -2]}>
      {nodeData.map((node, i) => (
        <group key={i}>
          <mesh ref={(el) => { nodesRef.current[i] = el; }} position={node.basePosition}>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh ref={(el) => { glowsRef.current[i] = el; }} position={node.basePosition}>
            <sphereGeometry args={[node.size * 4, 8, 8]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.2}
              transparent
              opacity={0.05}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={lineIndices.length * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
