"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Counter } from "./motion";
import ElevatorStage from "./three/ElevatorStage";
import type { SiteSettings } from "@/lib/types";

const CAPABILITIES = [
  { label: "Next-generation MRL & gearless systems" },
  { label: "Sigma control specialists" },
  { label: "Turnkey supply & installation" },
];

export default function HomeHero({ settings }: { settings: SiteSettings }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });
  const words = settings.hero_title.split(" ");

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 0.7, 0.3, 1] as const },
  });

  return (
    // tall scroll track drives the ascent on desktop; normal flow on mobile
    <div ref={ref} className={reduce ? "" : "lg:h-[240vh]"}>
      {/* sticks BELOW the navbar (top-16) so it never overlaps the menu */}
      <section className="relative overflow-x-clip pt-24 md:pt-28 lg:sticky lg:top-16 lg:flex lg:min-h-[calc(100vh-4rem)] lg:items-center lg:py-8 lg:pt-8">
        <div className="pointer-events-none absolute -right-40 top-0 hidden h-[520px] w-[520px] rounded-full bg-[var(--green)] opacity-[0.05] blur-[120px] lg:block" aria-hidden />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-12 sm:gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 lg:pb-0">
          {/* ---------------- copy (first on mobile) ---------------- */}
          <div className="order-1 min-w-0">
            <motion.div {...fade(0)} className="landing max-w-xl">
              <span className="floor-plate">G</span>
              <span className="landing-label truncate">Est. {settings.founded} — Karachi, Pakistan</span>
            </motion.div>

            <motion.h1
              {...fade(0.08)}
              className="display mt-4 break-words text-[2.15rem] leading-[0.95] text-[var(--ink)] sm:text-5xl md:text-6xl lg:text-[3.4rem] xl:text-[3.8rem]"
            >
              {words.slice(0, -1).join(" ")} <span className="text-[var(--green)]">{words.slice(-1)}</span>
            </motion.h1>

            <motion.p {...fade(0.16)} className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-[var(--muted)] md:text-[15px]">
              {settings.hero_subtitle}
            </motion.p>

            {/* capability list — one item per row, so it can never misalign */}
            <motion.ul
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={{ hidden: {}, show: { transition: { delayChildren: 0.32, staggerChildren: 0.08 } } }}
              className="mt-5 max-w-xl space-y-1.5"
            >
              {CAPABILITIES.map((c) => (
                <motion.li
                  key={c.label}
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 0.7, 0.3, 1] } },
                  }}
                  className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--muted)]"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[var(--brass)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m3 8.5 3.2 3.2L13 5" />
                  </svg>
                  <span>{c.label}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div {...fade(0.24)} className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/contact" className="btn-primary">
                Request a Quote <span aria-hidden>→</span>
              </Link>
              <Link href="/projects" className="btn-ghost">
                View Our Projects
              </Link>
            </motion.div>

            <motion.div
              {...fade(0.32)}
              className="glass mt-6 grid max-w-xl grid-cols-2 overflow-hidden rounded-[6px] sm:grid-cols-4"
            >
              {settings.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-3 py-3.5 sm:px-4 sm:py-4 ${i % 2 === 1 ? "border-l border-[var(--line)]" : ""} ${
                    i >= 2 ? "border-t border-[var(--line)] sm:border-t-0" : ""
                  } sm:border-l`}
                >
                  <div className="display text-2xl text-[var(--green)] sm:text-[1.7rem]">
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase leading-tight tracking-wider text-[var(--muted)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ---------------- 3D elevator stage (below on mobile) ---------------- */}
          <div className="order-2 mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px]">
            <ElevatorStage p={p} />
          </div>
        </div>
      </section>
    </div>
  );
}
