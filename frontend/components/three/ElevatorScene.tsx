"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/* Palette (matches the site tokens) */
const BRASS = "#b8912f";
const BRASS_LIGHT = "#d8b24a";
const INK = "#1b241f";
const GREEN = "#1e5c46";
const GREEN_DEEP = "#123b2d";
const PAPER = "#eae7dc";

const TRAVEL_END = 0.86;
const Y_BOTTOM = -2.7;
const Y_TOP = 2.75;
const FLOORS = [-2.7, -1.34, 0.02, 1.38, 2.74];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** The whole apparatus, driven by scroll progress `p` (0..1) + mouse parallax. */
function ElevatorRig({ p }: { p: MotionValue<number> }) {
  const rig = useRef<THREE.Group>(null);
  const car = useRef<THREE.Group>(null);
  const cwt = useRef<THREE.Group>(null);
  const sheave = useRef<THREE.Group>(null);
  const cableCarL = useRef<THREE.Mesh>(null);
  const cableCarR = useRef<THREE.Mesh>(null);
  const cableCwt = useRef<THREE.Mesh>(null);
  const doorL = useRef<THREE.Mesh>(null);
  const doorR = useRef<THREE.Mesh>(null);
  const floorMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const prevCarY = useRef(Y_BOTTOM);

  useFrame((state, delta) => {
    const prog = p.get();
    const t = clamp01(prog / TRAVEL_END);
    const eased = t * t * (3 - 2 * t); // smoothstep
    const carY = lerp(Y_BOTTOM, Y_TOP, eased);
    const bob = Math.sin(state.clock.elapsedTime * 1.4) * 0.015;

    if (car.current) car.current.position.y = carY + bob;
    if (cwt.current) cwt.current.position.y = -carY * 0.9;

    // cables stretch between sheave (y≈3.5) and their loads
    const top = 3.42;
    const stretch = (mesh: THREE.Mesh | null, fromY: number, toY: number) => {
      if (!mesh) return;
      const len = Math.max(Math.abs(toY - fromY), 0.001);
      mesh.scale.y = len;
      mesh.position.y = (fromY + toY) / 2;
    };
    stretch(cableCarL.current, top, carY + 0.85);
    stretch(cableCarR.current, top, carY + 0.85);
    stretch(cableCwt.current, top, -carY * 0.9 + 0.65);

    // sheave spins with car velocity (+ gentle idle)
    const vel = carY - prevCarY.current;
    prevCarY.current = carY;
    if (sheave.current) sheave.current.rotation.z -= vel * 2.4 + delta * 0.35;

    // doors part as the car arrives at the top
    const openAmt = clamp01((prog - TRAVEL_END - 0.01) / (1 - TRAVEL_END)) * 0.28;
    if (doorL.current) doorL.current.position.x = -0.2 - openAmt;
    if (doorR.current) doorR.current.position.x = 0.2 + openAmt;

    // light up the floor the car is passing
    let active = 0;
    let best = Infinity;
    for (let i = 0; i < FLOORS.length; i++) {
      const d = Math.abs(FLOORS[i] - carY);
      if (d < best) {
        best = d;
        active = i;
      }
    }
    floorMats.current.forEach((m, i) => {
      if (!m) return;
      const target = i === active ? 0.9 : 0.0;
      m.emissiveIntensity += (target - m.emissiveIntensity) * Math.min(1, delta * 6);
    });

    // mouse parallax + slow auto-orbit on the whole rig
    if (rig.current) {
      const px = state.pointer.x * 0.35;
      const py = state.pointer.y * 0.18;
      const baseRot = -0.5 + Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
      rig.current.rotation.y += (baseRot + px - rig.current.rotation.y) * 0.05;
      rig.current.rotation.x += (-py - rig.current.rotation.x) * 0.05;
    }
  });

  const railGeo = useMemo(() => new THREE.BoxGeometry(0.09, Y_TOP - Y_BOTTOM + 1.4, 0.09), []);
  const rails: [number, number][] = [
    [-1.15, 0.85],
    [1.15, 0.85],
    [-1.15, -0.85],
    [1.15, -0.85],
  ];

  return (
    <group ref={rig} position={[0, -0.1, 0]}>
      {/* guide rails */}
      {rails.map(([x, z], i) => (
        <mesh key={i} geometry={railGeo} position={[x, (Y_TOP + Y_BOTTOM) / 2, z]}>
          <meshStandardMaterial color={INK} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* floor slabs — active one glows brass */}
      {FLOORS.map((y, i) => (
        <mesh key={i} position={[0, y - 0.5, 0]}>
          <boxGeometry args={[2.7, 0.06, 2.2]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) floorMats.current[i] = m;
            }}
            color={PAPER}
            emissive={BRASS}
            emissiveIntensity={0}
            metalness={0.1}
            roughness={0.85}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* traction sheave + hub at the top */}
      <group ref={sheave} position={[0, 3.5, -0.35]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.11, 16, 40]} />
          <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.28} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.5, 20]} />
          <meshStandardMaterial color={INK} metalness={0.7} roughness={0.4} />
        </mesh>
        {[0, 1, 2, 3].map((s) => (
          <mesh key={s} rotation={[0, 0, (s * Math.PI) / 4]}>
            <boxGeometry args={[0.78, 0.05, 0.05]} />
            <meshStandardMaterial color={BRASS_LIGHT} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* cables */}
      {[cableCarL, cableCarR, cableCwt].map((r, i) => (
        <mesh key={i} ref={r} position={[i === 2 ? 0 : i === 0 ? -0.25 : 0.25, 0, i === 2 ? -0.35 : 0.2]}>
          <cylinderGeometry args={[0.018, 0.018, 1, 8]} />
          <meshStandardMaterial color="#6d7a6f" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}

      {/* counterweight */}
      <group ref={cwt} position={[0, 1.6, -0.35]}>
        <RoundedBox args={[0.55, 0.95, 0.3]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color={GREEN_DEEP} metalness={0.5} roughness={0.5} />
        </RoundedBox>
        {[-0.28, -0.14, 0, 0.14, 0.28].map((yy) => (
          <mesh key={yy} position={[0, yy, 0.16]}>
            <boxGeometry args={[0.5, 0.05, 0.02]} />
            <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* the elevator car */}
      <group ref={car} position={[0, Y_BOTTOM, 0]}>
        {/* cabin shell */}
        <RoundedBox args={[1.5, 1.7, 1.5]} radius={0.07} smoothness={4}>
          <meshStandardMaterial color={BRASS} metalness={0.82} roughness={0.32} />
        </RoundedBox>
        {/* recessed front frame */}
        <mesh position={[0, 0, 0.76]}>
          <boxGeometry args={[1.02, 1.34, 0.02]} />
          <meshStandardMaterial color={GREEN_DEEP} metalness={0.4} roughness={0.6} />
        </mesh>
        {/* two doors (part on arrival) */}
        <mesh ref={doorL} position={[-0.2, 0, 0.79]}>
          <boxGeometry args={[0.4, 1.24, 0.03]} />
          <meshStandardMaterial color={PAPER} metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh ref={doorR} position={[0.2, 0, 0.79]}>
          <boxGeometry args={[0.4, 1.24, 0.03]} />
          <meshStandardMaterial color={PAPER} metalness={0.3} roughness={0.5} />
        </mesh>
        {/* cabin light strip */}
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[1.3, 0.08, 1.3]} />
          <meshStandardMaterial color={BRASS_LIGHT} emissive={BRASS_LIGHT} emissiveIntensity={0.6} />
        </mesh>
        {/* roller guides */}
        {[
          [-0.78, 0.78],
          [0.78, 0.78],
          [-0.78, -0.78],
          [0.78, -0.78],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.7, z]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color={INK} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function ElevatorScene({ p }: { p: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [4.2, 0.6, 8.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 6]} intensity={1.6} color="#fff6e6" />
      <directionalLight position={[-6, 2, -4]} intensity={0.5} color={GREEN} />
      <pointLight position={[0, 0, 4]} intensity={18} distance={12} color={BRASS_LIGHT} />
      <ElevatorRig p={p} />
    </Canvas>
  );
}
