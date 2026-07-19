"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Counter } from "./motion";
import ElevatorCanvas from "./three/ElevatorCanvas";
import type { SiteSettings } from "@/lib/types";

/* Car geometry (SVG coords): car top Y at each served floor. */
const CAR_STOPS = [484, 392, 300, 208, 116]; // G, 1, 2, 3, 4
const FLOOR_LABELS = ["G", "1", "2", "3", "4"];
const TRAVEL_END = 0.88; // car reaches floor 4 here; doors open after

export default function HomeHero({ settings }: { settings: SiteSettings }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  const words = settings.hero_title.split(" ");

  return (
    <div ref={ref} className={reduce ? "" : "lg:h-[280vh]"}>
      <section className="relative min-h-screen pt-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-5 py-12 lg:h-[calc(100vh-4rem)] lg:min-h-0 lg:grid-cols-[1.05fr_0.95fr]">
          <HeroCopy settings={settings} words={words} p={p} reduce={!!reduce} />
          <div className="relative hidden h-[82vh] max-h-[660px] lg:block">
            {reduce ? <ShaftSection p={p} reduce /> : <ElevatorCanvas p={p} />}
          </div>
        </div>

        {/* scroll cue */}
        {!reduce && (
          <motion.div
            style={{ opacity: useTransform(p, [0, 0.1], [1, 0]) }}
            className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
            aria-hidden
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
              Scroll to ride
            </span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="text-[var(--brass)]"
            >
              ↓
            </motion.span>
          </motion.div>
        )}
      </section>
    </div>
  );
}

function HeroCopy({
  settings,
  words,
  p,
  reduce,
}: {
  settings: SiteSettings;
  words: string[];
  p: MotionValue<number>;
  reduce: boolean;
}) {
  const y = useTransform(p, [0, 1], [0, -48]);
  return (
    <motion.div style={reduce ? undefined : { y }}>
      <div className="landing max-w-xl">
        <FloorReadout p={p} reduce={reduce} />
        <span className="landing-label">Est. {settings.founded} — Karachi, Pakistan</span>
      </div>

      <h1 className="display mt-8 text-6xl sm:text-7xl md:text-8xl">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 align-top">
            <motion.span
              className={`inline-block ${i >= words.length - 1 ? "text-[var(--green)]" : ""}`}
              initial={reduce ? false : { y: "108%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.09, ease: [0.22, 0.7, 0.3, 1] }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </h1>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--muted)] md:text-base"
      >
        {settings.hero_subtitle}
      </motion.p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.62 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <Link href="/contact" className="btn-primary">
          Request a Quote <span aria-hidden>→</span>
        </Link>
        <Link href="/projects" className="btn-ghost">
          View Our Projects
        </Link>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.74 }}
        className="plate-static mt-12 grid max-w-lg grid-cols-2 divide-[var(--line)] sm:grid-cols-4 sm:divide-x"
      >
        {settings.stats.map((s) => (
          <div key={s.label} className="px-4 py-4">
            <div className="display text-3xl text-[var(--green)]">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/** Brass floor plate that ticks G → 4 as the scroll-elevator climbs. */
function FloorReadout({ p, reduce }: { p: MotionValue<number>; reduce: boolean }) {
  const [floor, setFloor] = useState("G");
  useMotionValueEvent(p, "change", (v) => {
    const idx = Math.min(4, Math.floor((v / TRAVEL_END) * 5));
    setFloor(FLOOR_LABELS[Math.max(0, idx)]);
  });
  return <span className="floor-plate">{reduce ? "G" : floor}</span>;
}

/* ================= The section drawing ================= */

function ShaftSection({ p, reduce }: { p: MotionValue<number>; reduce: boolean }) {
  // car: G → 4 over [0, TRAVEL_END]
  const carTop = useTransform(p, [0, TRAVEL_END], [CAR_STOPS[0], CAR_STOPS[4]], { clamp: true });
  const carShift = useTransform(carTop, (v) => v - CAR_STOPS[0]);
  // counterweight opposes the car
  const cwtShift = useTransform(carShift, (v) => -v * 0.92);
  // sheave spins with travel
  const sheaveRot = useTransform(p, [0, 1], [0, 620]);
  // doors part on arrival at 4
  const doorSlide = useTransform(p, [TRAVEL_END + 0.02, 1], [0, 19], { clamp: true });
  const doorSlideNeg = useTransform(doorSlide, (v) => -v);
  // arrival lamp
  const lampOpacity = useTransform(p, [TRAVEL_END + 0.04, TRAVEL_END + 0.1], [0.15, 1], { clamp: true });
  // dimension lines draw themselves early
  const dimDraw = useTransform(p, [0.02, 0.3], [0, 1], { clamp: true });

  if (reduce) {
    // static drawing, car resting at ground
    return <StaticFrame />;
  }

  return (
    <svg
      viewBox="0 0 380 600"
      className="h-full w-full"
      fill="none"
      role="img"
      aria-label="Section drawing of a building — scrolling drives the elevator up the shaft"
    >
      <defs>
        <clipPath id="hoistway">
          <rect x="158" y="100" width="64" height="460" />
        </clipPath>
        <clipPath id="car-door-clip">
          <rect x="166" y="0" width="48" height="74" />
        </clipPath>
      </defs>

      {/* ground + hatching */}
      <line x1="16" y1="560" x2="364" y2="560" stroke="var(--ink)" strokeWidth="3" />
      <g stroke="var(--muted)" strokeWidth="1" opacity="0.55">
        {[36, 76, 116, 268, 308, 348].map((x) => (
          <line key={x} x1={x} y1="560" x2={x - 11} y2="573" />
        ))}
      </g>

      {/* building body + machine room */}
      <rect x="70" y="100" width="240" height="460" stroke="var(--ink)" strokeWidth="2.2" />
      <rect x="140" y="40" width="100" height="60" stroke="var(--ink)" strokeWidth="2.2" />
      <text x="248" y="60" fontFamily="var(--font-plex-mono)" fontSize="10" letterSpacing="2" fill="var(--brass)">
        MR
      </text>

      {/* digital hall indicator on the machine room wall */}
      <HallIndicator p={p} />

      {/* dimension line, drawing itself as you scroll */}
      <motion.line
        x1="330"
        y1="100"
        x2="330"
        y2="560"
        stroke="var(--brass)"
        strokeWidth="1.2"
        style={{ pathLength: dimDraw }}
      />
      <motion.g style={{ opacity: dimDraw }}>
        <line x1="324" y1="100" x2="336" y2="100" stroke="var(--brass)" strokeWidth="1.2" />
        <line x1="324" y1="560" x2="336" y2="560" stroke="var(--brass)" strokeWidth="1.2" />
        <text
          x="342"
          y="336"
          fontFamily="var(--font-plex-mono)"
          fontSize="9"
          letterSpacing="1.5"
          fill="var(--brass)"
          transform="rotate(90 342 336)"
        >
          TRAVEL 26 YRS
        </text>
      </motion.g>

      {/* floor slabs, plates and windows */}
      {[
        { slab: 192, label: "4" },
        { slab: 284, label: "3" },
        { slab: 376, label: "2" },
        { slab: 468, label: "1" },
      ].map((f) => (
        <g key={f.label}>
          <line x1="70" y1={f.slab} x2="310" y2={f.slab} stroke="var(--line)" strokeWidth="1.5" />
          <FloorPlate y={f.slab} label={f.label} at={(Number(f.label) / 4) * TRAVEL_END} p={p} />
        </g>
      ))}
      <FloorPlate y={560} label="G" at={0} p={p} />

      {/* windows light up as the car passes their floor */}
      {[
        { y: 500, band: 0 },
        { y: 408, band: 1 },
        { y: 316, band: 2 },
        { y: 224, band: 3 },
        { y: 124, band: 4 },
      ].map((row) => (
        <WindowRow key={row.y} y={row.y} band={row.band} p={p} />
      ))}

      {/* hoistway */}
      <rect x="158" y="100" width="64" height="460" stroke="var(--green)" strokeWidth="1.6" />
      <line x1="166" y1="102" x2="166" y2="558" stroke="var(--green)" strokeWidth="1" strokeDasharray="4 6" opacity="0.7" />
      <line x1="214" y1="102" x2="214" y2="558" stroke="var(--green)" strokeWidth="1" strokeDasharray="4 6" opacity="0.7" />

      {/* traction sheave — spins as you scroll */}
      <motion.g style={{ rotate: sheaveRot, transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="182" cy="70" r="17" stroke="var(--brass)" strokeWidth="2.4" />
        <line x1="182" y1="55" x2="182" y2="85" stroke="var(--brass)" strokeWidth="1.4" />
        <line x1="167" y1="70" x2="197" y2="70" stroke="var(--brass)" strokeWidth="1.4" />
        <line x1="171.4" y1="59.4" x2="192.6" y2="80.6" stroke="var(--brass)" strokeWidth="1.2" />
        <line x1="192.6" y1="59.4" x2="171.4" y2="80.6" stroke="var(--brass)" strokeWidth="1.2" />
      </motion.g>
      <circle cx="182" cy="70" r="4.5" fill="var(--brass)" />

      {/* moving machinery */}
      <g clipPath="url(#hoistway)">
        {/* car cable — follows the car */}
        <motion.line x1="182" y1="87" x2="182" y2={carTop} stroke="var(--muted)" strokeWidth="1.4" />
        {/* counterweight + its cable */}
        <motion.g style={{ y: cwtShift }}>
          <line x1="212" y1="-380" x2="212" y2="150" stroke="var(--muted)" strokeWidth="1" />
          <rect x="207" y="150" width="10" height="46" fill="var(--ink)" fillOpacity="0.8" />
          {[161, 173, 185].map((y) => (
            <line key={y} x1="207" y1={y} x2="217" y2={y} stroke="var(--paper)" strokeWidth="1.5" />
          ))}
        </motion.g>

        {/* the car */}
        <motion.g style={{ y: carShift }}>
          <g transform={`translate(0 ${CAR_STOPS[0]})`}>
            {/* cab shell */}
            <rect x="164" y="0" width="52" height="74" fill="var(--panel)" stroke="var(--brass)" strokeWidth="2.4" />
            {/* lit interior strip */}
            <rect x="168" y="4" width="44" height="6" fill="var(--brass)" opacity="0.55" />
            {/* doors — part on arrival */}
            <g clipPath="url(#car-door-clip)">
              <motion.rect x="166" y="12" width="24" height="60" fill="var(--green-wash)" stroke="var(--green)" strokeWidth="1.2" style={{ x: doorSlideNeg }} />
              <motion.rect x="190" y="12" width="24" height="60" fill="var(--green-wash)" stroke="var(--green)" strokeWidth="1.2" style={{ x: doorSlide }} />
            </g>
            <line x1="190" y1="12" x2="190" y2="72" stroke="var(--green)" strokeWidth="0.8" opacity="0.6" />
            {/* roller guides */}
            <circle cx="164" cy="8" r="3" fill="var(--ink)" />
            <circle cx="216" cy="8" r="3" fill="var(--ink)" />
            <circle cx="164" cy="66" r="3" fill="var(--ink)" />
            <circle cx="216" cy="66" r="3" fill="var(--ink)" />
          </g>
        </motion.g>
      </g>

      {/* arrival lamp above the top landing */}
      <motion.circle cx="146" cy="182" r="5" fill="var(--brass)" style={{ opacity: lampOpacity }} />
      <text x="132" y="171" fontFamily="var(--font-plex-mono)" fontSize="8" letterSpacing="1" fill="var(--muted)">
        UP
      </text>

      {/* title block */}
      <g fontFamily="var(--font-plex-mono)" fontSize="9" letterSpacing="1.5" fill="var(--muted)">
        <rect x="236" y="514" width="112" height="34" fill="var(--panel)" stroke="var(--ink)" strokeWidth="1.2" />
        <text x="244" y="528">SECTION A—A</text>
        <text x="244" y="540">SCALE NTS · HTES</text>
      </g>
    </svg>
  );
}

/** Brass plate beside each floor slab; glows while the car is at that floor. */
function FloorPlate({ y, label, at, p }: { y: number; label: string; at: number; p: MotionValue<number> }) {
  const glow = useTransform(p, [at - 0.07, at, at + 0.07], [0.35, 1, 0.35], { clamp: true });
  return (
    <motion.g style={{ opacity: glow }}>
      <rect x="28" y={y - 11} width="26" height="18" rx="2" stroke="var(--brass)" strokeWidth="1.4" />
      <text
        x="41"
        y={y + 2.5}
        textAnchor="middle"
        fontFamily="var(--font-plex-mono)"
        fontSize="11"
        fontWeight="600"
        fill="var(--brass)"
      >
        {label}
      </text>
    </motion.g>
  );
}

/** A row of windows that lights up as the car reaches its floor. */
function WindowRow({ y, band, p }: { y: number; band: number; p: MotionValue<number> }) {
  const at = (band / 4) * TRAVEL_END;
  const lit = useTransform(p, [at - 0.05, at + 0.02], [0, 0.35], { clamp: true });
  return (
    <g>
      {[88, 120, 232, 264].map((x) => (
        <g key={x}>
          <motion.rect x={x} y={y} width="24" height="34" fill="var(--brass)" style={{ opacity: lit }} />
          <rect x={x} y={y} width="24" height="34" stroke="var(--line)" strokeWidth="1.2" />
        </g>
      ))}
    </g>
  );
}

/** Segment-display floor indicator mounted beside the machine room. */
function HallIndicator({ p }: { p: MotionValue<number> }) {
  const [floor, setFloor] = useState("G");
  useMotionValueEvent(p, "change", (v) => {
    const idx = Math.min(4, Math.floor((v / TRAVEL_END) * 5));
    setFloor(FLOOR_LABELS[Math.max(0, idx)]);
  });
  return (
    <g>
      <rect x="252" y="52" width="46" height="30" rx="2" fill="var(--green-deep)" stroke="var(--ink)" strokeWidth="1.4" />
      <text
        x="275"
        y="73"
        textAnchor="middle"
        fontFamily="var(--font-plex-mono)"
        fontSize="16"
        fontWeight="700"
        fill="#f5c96b"
      >
        ▲{floor}
      </text>
    </g>
  );
}

/** Motionless fallback for prefers-reduced-motion. */
function StaticFrame() {
  return (
    <svg viewBox="0 0 380 600" className="h-full w-full" fill="none" aria-hidden>
      <line x1="16" y1="560" x2="364" y2="560" stroke="var(--ink)" strokeWidth="3" />
      <rect x="70" y="100" width="240" height="460" stroke="var(--ink)" strokeWidth="2.2" />
      <rect x="140" y="40" width="100" height="60" stroke="var(--ink)" strokeWidth="2.2" />
      <rect x="158" y="100" width="64" height="460" stroke="var(--green)" strokeWidth="1.6" />
      <circle cx="182" cy="70" r="17" stroke="var(--brass)" strokeWidth="2.4" />
      {[192, 284, 376, 468].map((y) => (
        <line key={y} x1="70" y1={y} x2="310" y2={y} stroke="var(--line)" strokeWidth="1.5" />
      ))}
      <rect x="164" y="484" width="52" height="74" fill="var(--panel)" stroke="var(--brass)" strokeWidth="2.4" />
    </svg>
  );
}
