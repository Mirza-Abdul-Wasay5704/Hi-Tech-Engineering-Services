"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Counter } from "./motion";
import ElevatorViewport from "./three/ElevatorViewport";
import type { SiteSettings } from "@/lib/types";

export default function HomeHero({ settings }: { settings: SiteSettings }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const words = settings.hero_title.split(" ");

  return (
    // tall scroll track on desktop drives the ascent; normal flow on mobile
    <div ref={ref} className={reduce ? "" : "lg:h-[220vh]"}>
      <section className="relative pt-24 md:pt-28 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden lg:pt-0">
        <div className="pointer-events-none absolute -right-32 -top-24 h-[520px] w-[520px] rounded-full bg-[var(--green)] opacity-[0.06] blur-[120px]" aria-hidden />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-0">
          {/* ---- copy ---- */}
          <div className="order-2 lg:order-1">
            <div className="landing max-w-xl">
              <span className="floor-plate">G</span>
              <span className="landing-label">Est. {settings.founded} — Karachi, Pakistan</span>
            </div>

            <h1 className="display mt-6 text-5xl sm:text-6xl md:text-7xl">
              {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 align-top">
                  <motion.span
                    className={`inline-block ${i >= words.length - 1 ? "text-[var(--green)]" : ""}`}
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1 + i * 0.08, ease: [0.22, 0.7, 0.3, 1] }}
                  >
                    {word}
                  </motion.span>
                  {i < words.length - 1 && <span>&nbsp;</span>}
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--muted)] md:text-base"
            >
              {settings.hero_subtitle}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-7 flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/contact" className="btn-primary">
                Request a Quote <span aria-hidden>→</span>
              </Link>
              <Link href="/projects" className="btn-ghost">
                View Our Projects
              </Link>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="plate-static mt-10 grid max-w-lg grid-cols-2 divide-y divide-[var(--line)] sm:grid-cols-4 sm:divide-x sm:divide-y-0"
            >
              {settings.stats.map((s) => (
                <div key={s.label} className="px-4 py-4">
                  <div className="display text-2xl text-[var(--green)] sm:text-3xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ---- 3D elevator viewport ---- */}
          <div className="order-1 mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:order-2 lg:max-w-[440px]">
            <ElevatorViewport p={p} />
          </div>
        </div>
      </section>
    </div>
  );
}
