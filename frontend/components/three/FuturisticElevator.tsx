"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/* ---------- palette ---------- */
const BRASS = new THREE.Color("#d8b24a");
const GREEN = new THREE.Color("#33c98d");
const GREEN_DEEP = new THREE.Color("#123b2d");
const CHROME = "#c9d0ca";
const CREAM = "#eae7dc";

const TRAVEL_END = 0.82;
const POD_BOTTOM = -3.4;
const POD_TOP = 3.1;
const RING_COUNT = 20;
const RING_STEP = 1.55;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Soft radial sprite texture for fake-bloom glows. */
function useGlowTexture() {
  return useMemo(() => {
    const s = 128;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Glow({ color, size = 1, opacity = 1, position = [0, 0, 0] as [number, number, number], tex }: { color: THREE.Color | string; size?: number; opacity?: number; position?: [number, number, number]; tex: THREE.Texture }) {
  return (
    <sprite position={position} scale={[size, size, size]}>
      <spriteMaterial map={tex} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

/** Floor number rendered to a canvas texture (no external fonts). */
function useFloorTexture() {
  const data = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const draw = (label: string) => {
      ctx.clearRect(0, 0, 256, 128);
      ctx.fillStyle = "#0c241b";
      ctx.fillRect(0, 0, 256, 128);
      ctx.font = "700 74px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#f5c96b";
      ctx.shadowColor = "#f5c96b";
      ctx.shadowBlur = 22;
      ctx.fillText(label, 128, 68);
      tex.needsUpdate = true;
    };
    draw("G");
    return { tex, draw };
  }, []);
  return data;
}

function Rig({ p, glowTex }: { p: MotionValue<number>; glowTex: THREE.Texture }) {
  const rig = useRef<THREE.Group>(null);
  const pod = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const beacon = useRef<THREE.Mesh>(null);
  const doorL = useRef<THREE.Mesh>(null);
  const doorR = useRef<THREE.Mesh>(null);
  const ringGroup = useRef<THREE.Group>(null);
  const cam = useRef<THREE.Group>(null);
  const prevFloor = useRef("G");
  const { tex: floorTex, draw: drawFloor } = useFloorTexture();

  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => ({
        y: -12 + i * RING_STEP,
        color: i % 2 === 0 ? BRASS : GREEN,
      })),
    [],
  );

  useFrame((state, delta) => {
    const prog = p.get();
    const t = clamp01(prog / TRAVEL_END);
    const eased = t * t * (3 - 2 * t);
    const podY = lerp(POD_BOTTOM, POD_TOP, eased);
    const time = state.clock.elapsedTime;

    if (pod.current) {
      pod.current.position.y = podY + Math.sin(time * 1.3) * 0.03;
    }
    if (halo.current) halo.current.rotation.z = time * 0.6;
    if (beacon.current) {
      const m = beacon.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.5 + Math.sin(time * 3) * 0.3;
    }
    if (ringGroup.current) ringGroup.current.rotation.y = time * 0.05;

    // doors part on arrival
    const open = clamp01((prog - TRAVEL_END - 0.02) / (1 - TRAVEL_END)) * 0.34;
    if (doorL.current) doorL.current.position.x = -0.19 - open;
    if (doorR.current) doorR.current.position.x = 0.19 + open;

    // rings brighten near the pod
    ringGroup.current?.children.forEach((child) => {
      const ringY = child.position.y;
      const mesh = child.children[0] as THREE.Mesh | undefined;
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const d = Math.abs(ringY - podY);
        mat.emissiveIntensity = 1.4 + Math.max(0, 2.2 - d) * 1.1;
      }
      const sprite = child.children[1] as THREE.Sprite | undefined;
      if (sprite) {
        const d = Math.abs(ringY - podY);
        (sprite.material as THREE.SpriteMaterial).opacity = 0.25 + Math.max(0, 1.6 - d) * 0.35;
      }
    });

    // floor readout
    const floors = ["G", "1", "2", "3", "4", "5"];
    const idx = Math.min(floors.length - 1, Math.floor((prog / TRAVEL_END) * floors.length));
    const label = floors[Math.max(0, idx)];
    if (label !== prevFloor.current) {
      prevFloor.current = label;
      drawFloor(label);
    }

    // camera crane + mouse parallax
    if (cam.current) {
      const camY = podY * 0.5 + 0.7;
      const px = state.pointer.x * 0.6;
      const py = state.pointer.y * 0.3;
      cam.current.position.set(3.1 + px, camY - py, 6.4);
      state.camera.position.lerp(cam.current.position, 0.08);
      state.camera.lookAt(0, podY + 0.1, 0);
    }
  });

  return (
    <group ref={rig}>
      <group ref={cam} />

      {/* ambient particles */}
      <Particles glowTex={glowTex} />

      {/* light-ring tunnel */}
      <group ref={ringGroup}>
        {rings.map((r, i) => (
          <group key={i} position={[0, r.y, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.1, 0.03, 12, 60]} />
              <meshStandardMaterial color={r.color} emissive={r.color} emissiveIntensity={1.6} toneMapped={false} />
            </mesh>
            <Glow color={r.color} size={5.4} opacity={0.28} tex={glowTex} />
          </group>
        ))}
      </group>

      {/* destination portal above */}
      <group position={[0, 8.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.9, 48]} />
          <meshBasicMaterial color={CREAM} transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <Glow color={BRASS} size={11} opacity={0.5} tex={glowTex} />
      </group>

      {/* guide beams */}
      {[-1.55, 1.55].map((x) => (
        <mesh key={x} position={[x, 0, -0.2]}>
          <boxGeometry args={[0.03, 26, 0.03]} />
          <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      ))}

      {/* ===== the pod ===== */}
      <group ref={pod}>
        {/* rotating holographic halo */}
        <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.02, 8, 64]} />
          <meshBasicMaterial color={GREEN} transparent opacity={0.8} toneMapped={false} />
        </mesh>

        {/* chrome frame */}
        <RoundedBox args={[1.62, 2.02, 1.62]} radius={0.09} smoothness={4}>
          <meshStandardMaterial color={CHROME} metalness={1} roughness={0.18} />
        </RoundedBox>
        {/* glass cabin (slightly inset) */}
        <RoundedBox args={[1.44, 1.86, 1.44]} radius={0.07} smoothness={4}>
          <meshStandardMaterial color={GREEN_DEEP} metalness={0.2} roughness={0.05} transparent opacity={0.32} />
        </RoundedBox>
        {/* warm interior core */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.9, 1.5, 0.9]} />
          <meshBasicMaterial color={"#f3e3b0"} transparent opacity={0.5} toneMapped={false} />
        </mesh>

        {/* brass edge light-strips */}
        {[
          [-0.79, 0.79],
          [0.79, 0.79],
          [-0.79, -0.79],
          [0.79, -0.79],
        ].map(([x, z], i) => (
          <group key={i}>
            <mesh position={[x, 0, z]}>
              <boxGeometry args={[0.05, 1.9, 0.05]} />
              <meshStandardMaterial color={BRASS} emissive={BRASS} emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <Glow color={BRASS} size={1.1} opacity={0.4} position={[x, 0, z]} tex={glowTex} />
          </group>
        ))}

        {/* front doors */}
        <mesh ref={doorL} position={[-0.19, -0.05, 0.74]}>
          <boxGeometry args={[0.38, 1.6, 0.04]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh ref={doorR} position={[0.19, -0.05, 0.74]}>
          <boxGeometry args={[0.38, 1.6, 0.04]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.15} />
        </mesh>
        {/* light spilling from the doors when open */}
        <Glow color={CREAM} size={1.6} opacity={0.35} position={[0, -0.05, 0.7]} tex={glowTex} />

        {/* holographic floor display above the doors */}
        <group position={[0, 1.16, 0.66]}>
          <mesh>
            <planeGeometry args={[0.7, 0.36]} />
            <meshBasicMaterial map={floorTex} transparent toneMapped={false} />
          </mesh>
          <Glow color={BRASS} size={1.3} opacity={0.3} tex={glowTex} />
        </group>

        {/* roof beacon */}
        <mesh ref={beacon} position={[0, 1.12, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={BRASS} transparent opacity={0.8} toneMapped={false} />
        </mesh>
        <Glow color={BRASS} size={1.3} opacity={0.5} position={[0, 1.12, 0]} tex={glowTex} />
      </group>

      {/* cables up to the portal */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 5.5, -0.1]}>
          <boxGeometry args={[0.015, 7, 0.015]} />
          <meshStandardMaterial color={BRASS} emissive={BRASS} emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Particles({ glowTex }: { glowTex: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 220;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial map={glowTex} color={"#e6d9a8"} size={0.09} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function FuturisticElevator({ p }: { p: MotionValue<number> }) {
  const glowTex = useGlowTexture();
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [3.1, 0.7, 6.4], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <fog attach="fog" args={["#0b1f18", 6, 20]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 1, 4]} intensity={30} distance={16} color={"#ffe6a8"} />
      <pointLight position={[-3, -1, 2]} intensity={18} distance={14} color={"#2fae82"} />
      <directionalLight position={[4, 6, 5]} intensity={0.6} color="#ffffff" />
      <Rig p={p} glowTex={glowTex} />
    </Canvas>
  );
}
