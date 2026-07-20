"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

const Elevator3D = dynamic(() => import("./Elevator3D"), { ssr: false });

/**
 * A bright, contained "presentation stage" that holds the studio-lit 3D
 * elevator. Rounded + overflow-hidden so it can never overlap other content.
 * Light and airy to read as premium/professional, not a game.
 */
export default function ElevatorStage({ p }: { p: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const capable =
      typeof navigator === "undefined" || !("hardwareConcurrency" in navigator) || navigator.hardwareConcurrency > 4;
    const bigEnough = window.innerWidth >= 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!capable || !bigEnough || reduced) return;
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
    // no card/box — the elevator floats directly on the page background
    <div ref={ref} className="relative aspect-[4/5] w-full">
      {/* poster / fallback (also shown on phones + reduced motion) */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`} aria-hidden>
        <Poster />
      </div>

      {mount && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Elevator3D p={p} />
        </div>
      )}

      <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]/70">
        Scroll to ascend ↓
      </span>
    </div>
  );
}

function Poster() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 220 320" className="h-[72%]" fill="none" aria-hidden>
        <defs>
          <linearGradient id="es-steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9c0b8" />
            <stop offset="0.5" stopColor="#e7ebe6" />
            <stop offset="1" stopColor="#b9c0b8" />
          </linearGradient>
        </defs>
        <rect x="60" y="40" width="100" height="240" rx="6" fill="url(#es-steel)" stroke="#a7afa7" />
        <rect x="68" y="48" width="42" height="224" fill="#eef1ec" opacity="0.6" />
        <line x1="110" y1="48" x2="110" y2="272" stroke="#a7afa7" strokeWidth="1.5" />
        {[64, 68].map((x) => (
          <rect key={x} x={60} y="150" width="4" height="30" fill="#b8912f" />
        ))}
        <rect x="90" y="26" width="40" height="12" rx="2" fill="#123b2d" />
      </svg>
    </div>
  );
}
