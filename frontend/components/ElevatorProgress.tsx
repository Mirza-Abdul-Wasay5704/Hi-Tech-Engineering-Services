"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Elevator position indicator fixed to the right edge: a brass car
 * travels down a rail as you scroll, and the floor readout ticks G→8.
 */
export default function ElevatorProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const y = useTransform(smooth, [0, 1], ["84%", "0%"]);
  const [floor, setFloor] = useState("G");
  const reduce = useReducedMotion();

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const f = Math.min(8, Math.floor(v * 9));
      setFloor(f === 0 ? "G" : String(f));
    });
  }, [scrollYProgress]);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex"
    >
      <span className="font-mono text-[10px] tracking-widest text-[var(--muted)]">FLR</span>
      <span className="floor-plate">{floor}</span>
      <div className="relative h-40 w-px bg-[var(--line)]">
        <motion.div
          style={{ top: y }}
          className="absolute -left-[3px] h-6 w-[7px] rounded-[1px] bg-[var(--brass)]"
        />
      </div>
    </div>
  );
}
