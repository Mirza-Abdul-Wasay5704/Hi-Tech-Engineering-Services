"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const ITEMS = ["MAINTENANCE", "OVERHAULING", "MODERNIZATION", "SPARE PARTS", "RETROFITTING"];

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/** Velocity-reactive signage marquee — big outlined display type that drifts
    left and surges with your scroll speed. */
export default function ScrollMarquee() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { damping: 50, stiffness: 380 });
  const boost = useTransform(smoothV, [-1200, 0, 1200], [-1.6, 0, 1.6], { clamp: false });
  const x = useTransform(baseX, (v) => `${v}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * -0.9 * (delta / 1000); // base drift %/s
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    move += dir.current * Math.abs(b) * (delta / 1000) * -1;
    baseX.set(wrap(-50, 0, baseX.get() + move));
  });

  const row = (
    <>
      {ITEMS.map((item) => (
        <span key={item} className="inline-flex items-center whitespace-nowrap">
          <span className="px-7 font-mono text-[12px] uppercase tracking-[0.34em] text-[var(--muted)] md:text-[13px]">
            {item}
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--brass)]" aria-hidden />
        </span>
      ))}
    </>
  );

  return (
    <div
      className="overflow-hidden border-y border-[var(--line)] bg-[var(--panel)] py-3.5"
      aria-label="Maintenance, overhauling, modernization, spare parts, retrofitting"
    >
      <motion.div className="flex w-max" style={reduce ? undefined : { x }}>
        <span className="flex shrink-0">{row}</span>
        <span className="flex shrink-0" aria-hidden>
          {row}
        </span>
      </motion.div>
    </div>
  );
}
