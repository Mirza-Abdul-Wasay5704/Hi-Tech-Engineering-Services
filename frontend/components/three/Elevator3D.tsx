"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const STEEL = "#c6ccc6";
const STEEL_DARK = "#9aa19a";
const BRASS = "#b8912f";
const GREEN_DEEP = "#123b2d";
const WOOD = "#6f5334";

const RISE_END = 0.5;
const DOOR_START = 0.5;
const DOOR_END = 0.82;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Nameplate: logo + auto-fit wordmark, drawn onto one canvas texture. */
function useNameplate() {
  return useMemo(() => {
    const W = 960;
    const H = 220;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    ctx.fillStyle = "#0f2c22";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = BRASS;
    ctx.fillRect(0, H - 14, W, 14);
    ctx.fillRect(0, 0, W, 6);

    const textX = 250;
    ctx.textAlign = "left";
    let fs = 92;
    ctx.font = `800 ${fs}px Arial, sans-serif`;
    while (ctx.measureText("HI-TECH ENGINEERING").width > W - textX - 45 && fs > 18) {
      fs -= 2;
      ctx.font = `800 ${fs}px Arial, sans-serif`;
    }
    ctx.fillStyle = "#f1ede1";
    ctx.fillText("HI-TECH ENGINEERING", textX, 108);
    ctx.fillStyle = "#c8b986";
    ctx.font = "700 30px 'Courier New', monospace";
    ctx.fillText("ELEVATOR SERVICES · KARACHI", textX, 156);

    const img = new Image();
    img.onload = () => {
      const lh = 150;
      const lw = lh * (img.width / img.height);
      ctx.drawImage(img, 60, (H - lh) / 2, lw, lh);
      tex.needsUpdate = true;
    };
    img.src = "/logo.png";
    return tex;
  }, []);
}

function Elevator({ p }: { p: MotionValue<number> }) {
  const cabin = useRef<THREE.Group>(null);
  const follow = useRef<THREE.Group>(null);
  const doorL = useRef<THREE.Mesh>(null);
  const doorR = useRef<THREE.Mesh>(null);
  const ceil = useRef<THREE.MeshStandardMaterial>(null);
  const warmLight = useRef<THREE.PointLight>(null);
  const camPos = useMemo(() => new THREE.Vector3(3.4, 1.3, 5.6), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);

  const logo = useTexture("/logo.png");
  logo.colorSpace = THREE.SRGBColorSpace;
  const logoImg = logo.image as HTMLImageElement | undefined;
  const logoAspect = logoImg && logoImg.height ? logoImg.width / logoImg.height : 1;
  const nameplate = useNameplate();

  const markers = useMemo(() => Array.from({ length: 11 }, (_, i) => -6 + i * 1.25), []);

  useFrame((state, delta) => {
    const prog = p.get();
    const rise = smooth(clamp01(prog / RISE_END));
    const y = lerp(0, 2.6, rise);
    const openP = smooth(clamp01((prog - DOOR_START) / (DOOR_END - DOOR_START)));
    const open = openP * 0.34;
    const t = state.clock.elapsedTime;

    if (cabin.current) cabin.current.position.y = y + Math.sin(t * 1.0) * 0.015;
    if (follow.current) follow.current.position.y = y * 0.7;
    if (doorL.current) doorL.current.position.x = -0.37 - open;
    if (doorR.current) doorR.current.position.x = 0.37 + open;
    if (ceil.current) ceil.current.emissiveIntensity = 0.5 + openP * 1.8;
    if (warmLight.current) warmLight.current.intensity = 1.2 + openP * 6;

    const zoom = lerp(5.6, 4.1, smooth(clamp01((prog - 0.35) / 0.65)));
    const orbit = lerp(0, -0.4, rise);
    const px = state.pointer.x * 0.35;
    const py = state.pointer.y * 0.22;
    camPos.set(Math.cos(orbit) * (zoom * 0.55) + px, 1.1 + y * 0.55 - py, Math.sin(orbit) * 0.8 + zoom);
    state.camera.position.lerp(camPos, 1 - Math.pow(0.0015, delta));
    camTarget.set(0, y + 0.2 - openP * 0.25, 0);
    state.camera.lookAt(camTarget);
  });

  return (
    <group>
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 4, 2]} scale={[8, 4, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[-4, 1, 3]} scale={[3, 6, 1]} color="#eef3ef" />
        <Lightformer intensity={0.9} position={[4, 0, 3]} scale={[3, 6, 1]} color="#fff4df" />
        <Lightformer intensity={0.6} position={[0, -3, 2]} scale={[8, 3, 1]} color="#dfe6e0" />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 7, 5]} intensity={1.05} color="#fff8ee" />

      {/* rendered once (frames=1) — a soft static ground shadow, no per-frame cost */}
      <ContactShadows position={[0, -1.35, 0]} opacity={0.38} scale={9} blur={2.8} far={4} resolution={256} frames={1} color={GREEN_DEEP} />

      <group ref={follow}>
        {markers.map((my) => (
          <group key={my} position={[0, my, -0.5]}>
            {[-1.5, 1.5].map((mx) => (
              <mesh key={mx} position={[mx, 0, 0]}>
                <boxGeometry args={[0.6, 0.015, 0.015]} />
                <meshStandardMaterial color={STEEL_DARK} metalness={0.4} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {[-1.25, 1.25].map((x) => (
        <mesh key={x} position={[x, 0, -0.55]}>
          <boxGeometry args={[0.05, 16, 0.05]} />
          <meshStandardMaterial color={STEEL_DARK} metalness={0.9} roughness={0.35} />
        </mesh>
      ))}

      {/* ================= CABIN ================= */}
      <group ref={cabin}>
        {/* warm interior light */}
        <pointLight ref={warmLight} position={[0, 0.55, 0.1]} intensity={1.2} distance={2.6} decay={2} color="#ffd7a0" />

        {/* base + roof */}
        <RoundedBox args={[1.8, 0.14, 1.8]} radius={0.03} position={[0, -1.13, 0]}>
          <meshStandardMaterial color={STEEL_DARK} metalness={0.9} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[1.8, 0.16, 1.8]} radius={0.03} position={[0, 1.14, 0]}>
          <meshStandardMaterial color={STEEL} metalness={0.95} roughness={0.22} />
        </RoundedBox>

        {/* brass corner posts */}
        {[
          [-0.8, -0.8],
          [0.8, -0.8],
          [-0.8, 0.8],
          [0.8, 0.8],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.05, 0.05, 2.28, 20]} />
            <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.22} />
          </mesh>
        ))}

        {/* scenic glass side walls — cheap glassy look (reflection + transparency,
            no per-frame refraction pass) so it stays fast on phones */}
        {[-0.79, 0.79].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.03, 2.0, 1.5]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.24}
              roughness={0.04}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.06}
              ior={1.4}
              color="#dfeae4"
              envMapIntensity={1.3}
            />
          </mesh>
        ))}

        {/* polished back wall (env-reflected, cheap) + logo */}
        <mesh position={[0, 0.05, -0.75]}>
          <planeGeometry args={[1.42, 1.9]} />
          <meshStandardMaterial color="#c2cac4" metalness={1} roughness={0.14} envMapIntensity={1.4} />
        </mesh>
        <mesh position={[0, 0.32, -0.72]}>
          <planeGeometry args={[0.72 * logoAspect, 0.72]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>

        {/* marble floor + brass inlay */}
        <mesh position={[0, -1.03, 0]}>
          <boxGeometry args={[1.52, 0.05, 1.52]} />
          <meshStandardMaterial color="#ece8dc" metalness={0.3} roughness={0.14} />
        </mesh>
        {[
          [-0.56, 0, 0.02, 1.14],
          [0.56, 0, 0.02, 1.14],
          [0, -0.56, 1.14, 0.02],
          [0, 0.56, 1.14, 0.02],
        ].map(([x, z, w, d], i) => (
          <mesh key={i} position={[x, -1.0, z]}>
            <boxGeometry args={[w, 0.012, d]} />
            <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}

        {/* warm wood wainscot on lower side walls */}
        {[-0.76, 0.76].map((x) => (
          <mesh key={x} position={[x, -0.62, 0]}>
            <boxGeometry args={[0.02, 0.75, 1.4]} />
            <meshStandardMaterial color={WOOD} metalness={0.1} roughness={0.55} />
          </mesh>
        ))}

        {/* ceiling diffuser + recessed spots + brass trim */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.28, 0.05, 1.28]} />
          <meshStandardMaterial ref={ceil} color="#fff3d6" emissive="#ffe4b0" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
        {[
          [-0.4, -0.4],
          [0.4, -0.4],
          [-0.4, 0.4],
          [0.4, 0.4],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.98, z]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
            <meshBasicMaterial color="#fff1cf" toneMapped={false} />
          </mesh>
        ))}
        {[
          [0, -0.64, 1.32, 0.04],
          [0, 0.64, 1.32, 0.04],
          [-0.64, 0, 0.04, 1.32],
          [0.64, 0, 0.04, 1.32],
        ].map(([x, z, w, d], i) => (
          <mesh key={i} position={[x, 0.95, z]}>
            <boxGeometry args={[w, 0.03, d]} />
            <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}

        {/* handrails on three walls */}
        <mesh position={[0, -0.18, -0.68]}>
          <boxGeometry args={[1.3, 0.045, 0.05]} />
          <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.26} />
        </mesh>
        {[-0.68, 0.68].map((x) => (
          <mesh key={x} position={[x, -0.18, 0]}>
            <boxGeometry args={[0.05, 0.045, 1.3]} />
            <meshStandardMaterial color={BRASS} metalness={0.95} roughness={0.26} />
          </mesh>
        ))}

        {/* control panel on right wall */}
        <group position={[0.72, 0.12, 0.22]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.42, 0.72, 0.02]} />
            <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.25, 0.02]}>
            <boxGeometry args={[0.3, 0.12, 0.01]} />
            <meshStandardMaterial color={GREEN_DEEP} emissive="#0e3327" emissiveIntensity={0.5} toneMapped={false} />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((b) => (
            <mesh key={b} position={[(b % 2) * 0.16 - 0.08, 0.02 - Math.floor(b / 2) * 0.14, 0.02]}>
              <sphereGeometry args={[0.028, 14, 14]} />
              <meshStandardMaterial color={BRASS} metalness={0.9} roughness={0.3} emissive={BRASS} emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>

        {/* brushed-steel doors */}
        <mesh ref={doorL} position={[-0.37, 0, 0.79]}>
          <boxGeometry args={[0.72, 2.0, 0.05]} />
          <meshStandardMaterial color={STEEL} metalness={0.92} roughness={0.26} />
        </mesh>
        <mesh ref={doorR} position={[0.37, 0, 0.79]}>
          <boxGeometry args={[0.72, 2.0, 0.05]} />
          <meshStandardMaterial color={STEEL} metalness={0.92} roughness={0.26} />
        </mesh>
        {[-0.55, -0.2, 0.2, 0.55].map((x) => (
          <mesh key={x} position={[x, 0, 0.82]}>
            <boxGeometry args={[0.012, 1.9, 0.01]} />
            <meshStandardMaterial color={STEEL_DARK} metalness={0.8} roughness={0.4} />
          </mesh>
        ))}

        {/* ===== EXTERIOR BRANDING: header nameplate ===== */}
        <group position={[0, 1.3, 0.72]}>
          <RoundedBox args={[1.72, 0.46, 0.12]} radius={0.03}>
            <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.066]}>
            <planeGeometry args={[1.62, 0.372]} />
            <meshBasicMaterial map={nameplate} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function Elevator3D({ p }: { p: MotionValue<number> }) {
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  return (
    <Canvas
      dpr={coarse ? [1, 1.15] : [1, 1.5]}
      camera={{ position: [3.4, 1.3, 5.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Elevator p={p} />
      </Suspense>
    </Canvas>
  );
}
