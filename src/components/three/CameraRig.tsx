"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/stores/useAppStore";
import * as THREE from "three";

const KEYFRAMES = [
  { t: 0.00, pos: [0, 0.5, 14],   rot: [0, 0, 0] },
  { t: 0.04, pos: [0, 0.4, 13],   rot: [-0.01, 0, 0] },
  { t: 0.08, pos: [0.3, 0.3, 11.5], rot: [-0.02, -0.03, 0] },
  { t: 0.12, pos: [0.6, 0.6, 10], rot: [-0.04, -0.06, 0] },
  { t: 0.16, pos: [0.3, 0.8, 8.5], rot: [-0.05, -0.03, 0] },
  { t: 0.20, pos: [0, 0.5, 7.5],  rot: [-0.03, 0.02, 0] },
  { t: 0.25, pos: [-0.3, 0.3, 6.5], rot: [-0.02, 0.06, 0] },
  { t: 0.30, pos: [0, 0.1, 5.5],  rot: [0, 0.08, 0] },
  { t: 0.35, pos: [0.2, -0.1, 4.5], rot: [0.01, 0.1, 0] },
  { t: 0.40, pos: [0, 0, 3.5],    rot: [0, 0.06, 0] },
  { t: 0.45, pos: [-0.2, 0.1, 4.5], rot: [-0.01, -0.02, 0] },
  { t: 0.50, pos: [0, 0, 6],      rot: [0, 0, 0] },
  { t: 0.55, pos: [0, -0.2, 7],   rot: [0.02, -0.05, 0] },
  { t: 0.58, pos: [0.3, -0.1, 7.5], rot: [0.01, -0.06, 0] },
  { t: 0.62, pos: [0.2, 0.2, 8],  rot: [0, -0.04, 0] },
  { t: 0.66, pos: [0, 0.5, 8.5],  rot: [-0.03, 0, 0] },
  { t: 0.70, pos: [-0.2, 0.8, 9.5], rot: [-0.05, 0.03, 0] },
  { t: 0.75, pos: [0, 1.2, 10.5], rot: [-0.06, 0, 0] },
  { t: 0.80, pos: [0, 0.8, 10],   rot: [-0.04, -0.02, 0] },
  { t: 0.85, pos: [0.2, 0.4, 9],  rot: [-0.02, -0.03, 0] },
  { t: 0.90, pos: [0, 0.1, 8.5],  rot: [0, 0, 0] },
  { t: 0.95, pos: [0, 0.2, 9],    rot: [-0.01, 0, 0] },
  { t: 1.00, pos: [0, 0.4, 10],   rot: [-0.02, 0, 0] },
] as const;

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function samplePath(progress: number, axis: 0 | 1 | 2, field: "pos" | "rot"): number {
  const p = Math.max(0, Math.min(1, progress));

  let i1 = 0;
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (p >= KEYFRAMES[i].t && p <= KEYFRAMES[i + 1].t) {
      i1 = i;
      break;
    }
  }
  if (p >= KEYFRAMES[KEYFRAMES.length - 1].t) i1 = KEYFRAMES.length - 2;

  const i0 = Math.max(0, i1 - 1);
  const i2 = Math.min(KEYFRAMES.length - 1, i1 + 1);
  const i3 = Math.min(KEYFRAMES.length - 1, i1 + 2);

  const seg = KEYFRAMES[i2].t - KEYFRAMES[i1].t;
  const localT = seg > 0 ? (p - KEYFRAMES[i1].t) / seg : 0;

  return catmullRom(
    KEYFRAMES[i0][field][axis],
    KEYFRAMES[i1][field][axis],
    KEYFRAMES[i2][field][axis],
    KEYFRAMES[i3][field][axis],
    localT,
  );
}

export default function CameraRig() {
  const sPos = useRef(new THREE.Vector3(0, 0.5, 14));
  const sRot = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const progress = useAppStore.getState().scrollProgress;
    const cursor = useAppStore.getState().cursorPosition;

    const tx = samplePath(progress, 0, "pos");
    const ty = samplePath(progress, 1, "pos");
    const tz = samplePath(progress, 2, "pos");
    const rx = samplePath(progress, 0, "rot");
    const ry = samplePath(progress, 1, "rot");
    const rz = samplePath(progress, 2, "rot");

    const w = typeof window !== "undefined" ? window.innerWidth : 1;
    const h = typeof window !== "undefined" ? window.innerHeight : 1;
    const mx = ((cursor.x / w) - 0.5) * 0.2;
    const my = ((cursor.y / h) - 0.5) * 0.1;

    // Frame-rate independent lerp: 1 - e^(-speed * dt)
    const speed = 8;
    const factor = 1 - Math.exp(-speed * delta);

    sPos.current.x += ((tx + mx) - sPos.current.x) * factor;
    sPos.current.y += ((ty - my) - sPos.current.y) * factor;
    sPos.current.z += (tz - sPos.current.z) * factor;

    sRot.current.x += ((rx + my * 0.02) - sRot.current.x) * factor;
    sRot.current.y += ((ry + mx * 0.03) - sRot.current.y) * factor;
    sRot.current.z += (rz - sRot.current.z) * factor;

    state.camera.position.set(sPos.current.x, sPos.current.y, sPos.current.z);
    state.camera.rotation.set(sRot.current.x, sRot.current.y, sRot.current.z);
  });

  return null;
}
