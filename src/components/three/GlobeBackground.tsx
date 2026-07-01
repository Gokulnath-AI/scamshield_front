"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

const PURPLE = new THREE.Color("#8b5cf6");
const PURPLE_DIM = new THREE.Color("#4c1d95");
const PURPLE_GLOW = new THREE.Color("#a78bfa");

const AFRICA: [number, number][] = [
  [37.5,-10],[36.8,0],[37,10],[32,12],[31,32],[30,33],[22,36],[15,42],[12,44],[11,51],
  [2,51],[0,42],[-2,41],[-10,40],[-15,40],[-25,35],[-34,26],[-35,19],[-33,17],[-30,16],
  [-22,14],[-17,12],[-12,14],[-8,13],[-5,12],[0,10],[5,5],[5,1],[6,-2],[4,-7],[5,-10],
  [8,-14],[10,-16],[15,-17],[20,-17],[22,-16],[25,-15],[28,-13],[30,-10],[33,-8],[35,-2],
  [37.5,-10],
];

const EUROPE: [number, number][] = [
  [36,-10],[38,-9],[40,-9],[43,-8],[44,-1],[46,-1],[47,0],[48,-5],[51,-5],[52,-10],
  [54,-10],[56,-7],[58,-3],[59,1],[57,7],[54,8],[55,12],[54,14],[56,13],[58,17],
  [63,20],[66,25],[70,27],[71,28],[70,32],[65,30],[62,30],[60,28],[58,28],[56,24],
  [55,21],[54,18],[52,21],[50,20],[47,15],[45,14],[43,16],[42,19],[41,29],[42,28],
  [44,34],[42,36],[40,26],[38,24],[38,20],[40,18],[41,13],[39,3],[38,0],[37,0],
  [36,-5],[36,-10],
];

const ASIA: [number, number][] = [
  [42,28],[44,40],[42,44],[40,50],[38,57],[30,51],[26,56],[24,58],[25,62],[23,68],
  [25,67],[28,65],[30,67],[35,69],[37,71],[40,54],[42,59],[45,52],[50,55],[55,60],
  [58,60],[60,68],[55,73],[52,78],[50,87],[52,88],[55,83],[60,77],[63,78],[66,72],
  [68,70],[70,72],[68,82],[70,90],[72,105],[72,130],[68,140],[64,140],[62,135],
  [59,143],[55,137],[53,141],[50,141],[48,143],[46,143],[43,147],[42,140],[40,132],
  [37,127],[35,129],[38,130],[39,132],[36,137],[33,130],[31,132],[36,140],[42,145],
  [46,152],[44,148],[43,146],[46,150],[45,148],
  [35,127],[32,127],[35,126],[37,122],[40,122],[39,117],[37,117],[35,108],
  [30,105],[25,102],[22,106],[20,107],[18,107],[16,108],[10,106],[8,105],[7,103],
  [3,104],[1,104],[2,99],[6,100],[6,99],[5,95],[16,98],[21,97],[23,90],
  [22,88],[20,87],[21,80],[17,82],[15,80],[8,77],[16,73],[20,73],[24,72],
  [26,70],[30,67],[28,65],[25,62],[24,58],[26,56],[30,51],[32,48],[35,46],
  [38,44],[40,43],[42,36],[44,34],[42,29],[42,28],
];

const INDIA: [number, number][] = [
  [35,73],[33,75],[30,79],[28,84],[27,88],[22,88],[21,87],[21,80],[17,82],
  [15,80],[8,77],[8,73],[10,76],[13,80],[15,80],[17,73],[20,73],[21,70],
  [24,69],[25,68],[28,65],[30,67],[35,69],[35,73],
];

const NORTH_AMERICA: [number, number][] = [
  [72,-170],[70,-162],[68,-164],[66,-165],[64,-170],[62,-166],[60,-165],[60,-148],
  [58,-136],[55,-130],[52,-128],[49,-127],[48,-125],[45,-124],[40,-124],[35,-121],
  [33,-118],[30,-115],[28,-113],[25,-110],[22,-106],[20,-105],[18,-103],[16,-96],
  [16,-88],[18,-88],[20,-87],[21,-90],[26,-90],[28,-82],[25,-80],[25,-78],
  [30,-81],[32,-79],[35,-76],[38,-75],[40,-74],[41,-70],[42,-70],[43,-66],
  [45,-64],[47,-60],[50,-57],[52,-56],[55,-60],[47,-53],[50,-56],[53,-56],
  [55,-59],[60,-64],[58,-68],[55,-76],[51,-80],[52,-82],[50,-85],[48,-88],
  [47,-84],[45,-82],[44,-82],[42,-83],[42,-88],[46,-88],[48,-90],[49,-95],
  [51,-98],[55,-98],[58,-95],[60,-95],[62,-92],[64,-90],[65,-88],[68,-87],
  [70,-85],[68,-80],[67,-76],[65,-64],[64,-63],[62,-66],[60,-68],
  [60,-78],[55,-82],[53,-82],[50,-82],[50,-85],[53,-85],[55,-82],
  [60,-94],[62,-95],[66,-100],[68,-105],[70,-110],[71,-120],[72,-130],
  [72,-140],[72,-155],[72,-170],
];

const SOUTH_AMERICA: [number, number][] = [
  [12,-72],[10,-72],[8,-62],[7,-60],[5,-52],[2,-50],[0,-50],[-2,-44],
  [-5,-35],[-8,-35],[-12,-37],[-15,-39],[-18,-39],[-23,-42],[-25,-48],
  [-28,-49],[-30,-51],[-33,-53],[-35,-57],[-38,-58],[-40,-62],[-42,-64],
  [-46,-68],[-48,-66],[-50,-70],[-52,-70],[-54,-68],[-56,-70],[-55,-66],
  [-53,-71],[-50,-75],[-46,-75],[-42,-73],[-38,-73],[-35,-72],[-30,-72],
  [-25,-70],[-20,-70],[-15,-75],[-10,-77],[-5,-81],[-2,-80],[0,-80],
  [2,-78],[5,-77],[8,-77],[10,-75],[12,-72],
];

const AUSTRALIA: [number, number][] = [
  [-12,130],[-12,136],[-15,140],[-18,146],[-22,150],[-25,153],[-28,153],
  [-32,152],[-35,151],[-37,150],[-39,147],[-38,145],[-35,137],[-33,134],
  [-32,131],[-32,127],[-34,123],[-34,118],[-33,115],[-31,115],[-25,113],
  [-22,114],[-20,119],[-18,122],[-15,125],[-14,126],[-12,130],
];

const JAPAN: [number, number][] = [
  [31,131],[33,130],[34,132],[35,133],[35,137],[37,137],[38,140],[40,140],
  [41,141],[43,145],[45,142],[43,140],[40,139],[38,138],[36,136],[36,133],
  [34,130],[31,131],
];

const UK: [number, number][] = [
  [50,-5],[51,-3],[52,1],[53,0],[54,-1],[55,-2],[57,-5],[58,-3],[58,-5],
  [57,-7],[56,-7],[54,-5],[53,-3],[52,-4],[51,-5],[50,-5],
];

const INDONESIA: [number, number][] = [
  [-6,105],[-7,106],[-7,110],[-8,113],[-8,116],[-9,119],[-8,122],[-9,125],
  [-8,127],[-7,128],[-5,127],[-3,128],[-1,128],[0,127],[1,125],[0,120],
  [-1,117],[-2,116],[-3,114],[-5,112],[-6,110],[-6,105],
];

const MADAGASCAR: [number, number][] = [
  [-12,49],[-14,48],[-16,47],[-19,44],[-22,44],[-24,44],[-26,47],
  [-24,48],[-20,49],[-16,50],[-12,49],
];

const NEW_ZEALAND: [number, number][] = [
  [-35,174],[-37,175],[-38,177],[-40,176],[-42,173],[-44,170],[-46,168],
  [-45,167],[-44,169],[-42,172],[-40,174],[-38,176],[-36,175],[-35,174],
];

const GREENLAND: [number, number][] = [
  [60,-44],[62,-42],[65,-40],[68,-32],[70,-22],[72,-20],[74,-18],[76,-18],
  [78,-20],[80,-20],[82,-24],[83,-30],[82,-40],[80,-50],[78,-56],[76,-60],
  [74,-58],[72,-56],[70,-52],[68,-50],[66,-46],[64,-44],[62,-44],[60,-44],
];

const PHILIPPINES: [number, number][] = [
  [5,120],[7,122],[9,124],[11,124],[13,124],[15,121],[17,122],[18,121],
  [18,120],[16,120],[14,120],[12,122],[10,121],[8,119],[6,118],[5,120],
];

const SRI_LANKA: [number, number][] = [
  [10,80],[9,81],[8,82],[7,80],[7,79],[8,80],[10,80],
];

const TAIWAN: [number, number][] = [
  [22,121],[23,121],[25,122],[25,121],[24,120],[22,121],
];

const KOREA: [number, number][] = [
  [35,126],[36,127],[37,127],[38,128],[39,128],[40,129],[38,126],[37,126],
  [36,126],[35,126],
];

const POLYGONS = [
  AFRICA, EUROPE, ASIA, INDIA, NORTH_AMERICA, SOUTH_AMERICA,
  AUSTRALIA, JAPAN, UK, INDONESIA, MADAGASCAR, NEW_ZEALAND,
  GREENLAND, PHILIPPINES, SRI_LANKA, TAIWAN, KOREA,
];

function pointInPolygon(lat: number, lon: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const yi = polygon[i][0], xi = polygon[i][1];
    const yj = polygon[j][0], xj = polygon[j][1];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(lat: number, lon: number): boolean {
  for (const poly of POLYGONS) {
    if (pointInPolygon(lat, lon, poly)) return true;
  }
  return false;
}

function generateGlobePoints(): Float32Array {
  const points: number[] = [];
  const radius = 2.2;
  const dotDensity = 160;

  for (let lat = -90; lat <= 90; lat += 180 / dotDensity) {
    const latRad = (lat * Math.PI) / 180;
    const circumference = Math.cos(latRad);
    const dotsAtLat = Math.max(1, Math.floor(dotDensity * 2 * circumference));

    for (let i = 0; i < dotsAtLat; i++) {
      const lonDeg = (i / dotsAtLat) * 360 - 180;
      const lonRad = (lonDeg * Math.PI) / 180;

      if (isLand(lat, lonDeg)) {
        const x = radius * Math.cos(latRad) * Math.cos(lonRad);
        const y = radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.sin(lonRad);
        points.push(x, y, z);
      }
    }
  }

  return new Float32Array(points);
}

function generateOceanGrid(): Float32Array {
  const points: number[] = [];
  const radius = 2.2;
  const step = 4;

  for (let lat = -80; lat <= 80; lat += step) {
    const latRad = (lat * Math.PI) / 180;
    const circumference = Math.cos(latRad);
    const count = Math.max(1, Math.floor(90 * circumference));

    for (let i = 0; i < count; i++) {
      const lonDeg = (i / count) * 360 - 180;
      if (isLand(lat, lonDeg)) continue;
      const lonRad = (lonDeg * Math.PI) / 180;
      const x = radius * Math.cos(latRad) * Math.cos(lonRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.sin(lonRad);
      points.push(x, y, z);
    }
  }

  return new Float32Array(points);
}

function generateStarField(): Float32Array {
  const stars: number[] = [];
  for (let i = 0; i < 800; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 12 + Math.random() * 25;
    stars.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }
  return new Float32Array(stars);
}

function DotGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const landPositions = useMemo(() => generateGlobePoints(), []);
  const oceanPositions = useMemo(() => generateOceanGrid(), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, 0, 0.08]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[landPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#a78bfa"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[oceanPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#6d28d9"
          transparent
          opacity={0.12}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <mesh>
        <icosahedronGeometry args={[2.18, 18]} />
        <meshBasicMaterial
          color={PURPLE_DIM}
          wireframe
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.15, 48, 48]} />
        <meshBasicMaterial color="#06000e" transparent opacity={0.92} />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.32, 48, 48]} />
        <meshBasicMaterial
          color={PURPLE_GLOW}
          transparent
          opacity={0.07}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.55, 48, 48]} />
        <meshBasicMaterial
          color={PURPLE}
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Stars() {
  const positions = useMemo(() => generateStarField(), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function GlobeBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        opacity: ready ? 1 : 0,
        transition: "opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#050008" }}
        onCreated={() => {
          setTimeout(() => setReady(true), 100);
        }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.08} color="#8b5cf6" />
        <DotGlobe />
        <Stars />
      </Canvas>
    </div>
  );
}
