"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Reading-progress rail fixed to the right edge — a slim brass marker that
 * travels as you scroll, echoing an elevator position indicator.
 */
export default function ElevatorProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const y = useTransform(smooth, [0, 1], ["84%", "0%"]);
  const reduce = useReducedMotion();

  if (reduce) return null;

  // A quiet reading-progress rail. Keeps the elevator metaphor without the
  // gadget look — no labels, just a slim brass marker travelling the rail.
  return (
    <div
      aria-hidden
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative h-48 w-px bg-[color-mix(in_srgb,var(--line)_75%,transparent)]">
        <motion.div
          style={{ top: y }}
          className="absolute -left-[1.5px] h-8 w-[4px] rounded-full bg-[var(--brass)]"
        />
      </div>
    </div>
  );
}
