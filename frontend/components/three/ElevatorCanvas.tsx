"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

const ElevatorScene = dynamic(() => import("./ElevatorScene"), { ssr: false });

/**
 * Lazy 3D mount: shows a crisp CSS poster instantly (LCP-safe), then fades in
 * the WebGL elevator once it's on screen. Contained to its box so it can never
 * overlap the copy or the section below.
 */
export default function ElevatorCanvas({ p }: { p: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lowPower =
      typeof navigator !== "undefined" &&
      "hardwareConcurrency" in navigator &&
      navigator.hardwareConcurrency <= 2;
    if (lowPower) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!show) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [show]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* poster: technical elevation, visible instantly + as fallback */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden
      >
        <Poster />
      </div>
      {show && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <ElevatorScene p={p} />
        </div>
      )}
    </div>
  );
}

function Poster() {
  return (
    <svg viewBox="0 0 200 320" className="h-[78%] max-h-[440px]" fill="none" aria-hidden>
      <rect x="40" y="12" width="120" height="296" stroke="#c9cfc9" strokeWidth="1.5" />
      <line x1="72" y1="12" x2="72" y2="308" stroke="#1e5c46" strokeWidth="1" opacity="0.5" />
      <line x1="128" y1="12" x2="128" y2="308" stroke="#1e5c46" strokeWidth="1" opacity="0.5" />
      {[70, 130, 190, 250].map((y) => (
        <line key={y} x1="40" y1={y} x2="160" y2={y} stroke="#c9cfc9" strokeWidth="0.75" />
      ))}
      <rect x="76" y="150" width="48" height="60" rx="3" fill="#b8912f" fillOpacity="0.25" stroke="#b8912f" strokeWidth="2" />
      <circle cx="100" cy="34" r="12" stroke="#96793d" strokeWidth="2" />
      <line x1="100" y1="46" x2="100" y2="150" stroke="#6d7a6f" strokeWidth="1" />
    </svg>
  );
}
