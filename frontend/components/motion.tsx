"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/** Slide-up reveal on scroll. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered children reveal. */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.65, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Count-up number. Writes straight to the DOM (imperative) so it never triggers
 * a React re-render per frame — smooth even while the 3D hero is initializing.
 */
export function Counter({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = `${value}${suffix}`;
      return;
    }
    if (!inView) return;
    let last = -1;
    const controls = animate(0, value, {
      duration,
      delay: 0.35, // let first paint + the 3D mount settle before counting
      ease: [0.16, 1, 0.3, 1], // easeOutExpo — smooth glide into the final number
      onUpdate(v) {
        const r = Math.round(v);
        if (r !== last) {
          last = r;
          node.textContent = `${r}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {`0${suffix}`}
    </span>
  );
}
