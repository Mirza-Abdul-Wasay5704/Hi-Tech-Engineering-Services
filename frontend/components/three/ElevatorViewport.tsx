"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

const FuturisticElevator = dynamic(() => import("./FuturisticElevator"), { ssr: false });

/**
 * A self-contained "shaft window": a dark gradient panel with a futuristic HUD
 * frame that holds the WebGL elevator. Rounded + overflow-hidden so the 3D can
 * never spill onto surrounding content. Lazy-loads; shows a poster until ready.
 */
export default function ElevatorViewport({ p }: { p: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enoughPower =
      typeof navigator === "undefined" ||
      !("hardwareConcurrency" in navigator) ||
      navigator.hardwareConcurrency > 4;
    const bigEnough = window.innerWidth >= 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enoughPower || !bigEnough || reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!mount) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [mount]);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-[#204636] shadow-[0_30px_80px_-40px_rgba(10,30,22,0.8)]"
      style={{ background: "radial-gradient(120% 90% at 50% 15%, #1b3b2c 0%, #0b1f18 45%, #071310 100%)" }}
    >
      {/* poster / fallback */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`} aria-hidden>
        <Poster />
      </div>

      {mount && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <FuturisticElevator p={p} />
        </div>
      )}

      {/* HUD frame overlay (pure CSS/SVG, adds detail without 3D cost) */}
      <div className="pointer-events-none absolute inset-0">
        {/* corner brackets */}
        {[
          "left-3 top-3 border-l-2 border-t-2",
          "right-3 top-3 border-r-2 border-t-2",
          "left-3 bottom-3 border-l-2 border-b-2",
          "right-3 bottom-3 border-r-2 border-b-2",
        ].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-[#d8b24a]/70 ${c}`} />
        ))}
        <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#e7d6a0]/80">
          ◢ Ascent
        </span>
        <span className="absolute right-4 top-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7fd6b0]/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#33c98d]" /> Live
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#9fb3a8]/70">
          Traction · MRL · 26 yrs
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#9fb3a8]/70">
          Scroll ↓
        </span>
        {/* top/bottom vignette */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#071310] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#071310] to-transparent" />
      </div>
    </div>
  );
}

function Poster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 200 300" className="h-[70%]" fill="none" aria-hidden>
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d8b24a" />
            <stop offset="1" stopColor="#33c98d" />
          </linearGradient>
        </defs>
        {[40, 90, 140, 190, 240].map((y) => (
          <ellipse key={y} cx="100" cy={y} rx="70" ry="12" stroke="#1f4a39" strokeWidth="1.5" />
        ))}
        <rect x="66" y="118" width="68" height="86" rx="10" stroke="url(#pg)" strokeWidth="2" />
        <rect x="78" y="128" width="44" height="66" rx="4" fill="#f3e3b0" opacity="0.12" />
        <circle cx="100" cy="112" r="4" fill="#d8b24a" />
      </svg>
    </div>
  );
}
