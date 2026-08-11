"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Counter } from "./motion";

const CAPABILITIES = [
  {
    title: "Machine-Room-Less (MRL)",
    text: "Compact gearless machines that live inside the shaft — no machine room, less civil cost, a quieter ride.",
  },
  {
    title: "VVVF Gearless Drives",
    text: "Variable-frequency control for glass-smooth acceleration, precise floor leveling and materially lower energy use.",
  },
  {
    title: "Destination Dispatch",
    text: "Smart group control that assigns each passenger a car before they board — shorter waits in busy towers.",
  },
  {
    title: "Touchless & Access-Card",
    text: "Contactless calls and card/biometric integration for hospitals, corporate towers and secure buildings.",
  },
];

const SIGMA_POINTS = [
  "Parameter adjustment & drive tuning",
  "SSD PCB and relay-type panels",
  "Board-level diagnostics & rectification",
  "Genuine Sigma/LG parts sourcing",
];

export default function NextGenSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 26, restDelta: 0.001 });

  // scroll-linked motion
  const railFill = useTransform(p, [0.12, 0.72], ["0%", "100%"]);
  const carY = useTransform(p, [0.12, 0.72], ["88%", "0%"]);
  const glowOpacity = useTransform(p, [0.1, 0.45, 0.85], [0, 0.5, 0.15]);
  const headingY = useTransform(p, [0, 1], [40, -40]);
  const panelY = useTransform(p, [0, 1], [60, -30]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-70px" },
    transition: { duration: 0.7, delay, ease: [0.22, 0.7, 0.3, 1] as const },
  });

  return (
    <section ref={ref} className="enamel relative overflow-hidden">
      {/* scroll-reactive ambient glow */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { opacity: glowOpacity }}
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--green)] blur-[140px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-24">
        <motion.div style={reduce ? undefined : { y: headingY }}>
          <div className="landing">
            <span className="floor-plate">NG</span>
            <span className="landing-label">Next-generation systems</span>
          </div>
          <h2 className="display mt-6 max-w-3xl text-4xl md:text-6xl">
            Legacy Machines to <span className="text-[var(--brass)]">Next-Generation</span> Elevators
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#a9bcb0]">
            We service the elevators Pakistan already runs on — and supply, install and commission the ones it&apos;s
            moving to. Machine-room-less gearless systems, VVVF drives and smart controls, delivered by engineers
            who have maintained every generation of this technology since 1997.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* capability rail — items reveal as the car climbs */}
          <div className="relative pl-12">
            {/* the shaft rail */}
            <div className="absolute bottom-2 left-4 top-2 w-[3px] rounded-full bg-[rgba(233,238,233,0.16)]">
              <motion.div
                aria-hidden
                style={reduce ? { height: "100%" } : { height: railFill }}
                className="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-[var(--brass)] to-[var(--green)]"
              />
              {/* the travelling car */}
              {!reduce && (
                <motion.span
                  aria-hidden
                  style={{ top: carY }}
                  className="absolute -left-[7px] h-7 w-[17px] rounded-[3px] border border-[var(--brass)] bg-[var(--green-deep)] shadow-[0_0_18px_rgba(220,181,103,0.55)]"
                />
              )}
            </div>

            <div className="space-y-7">
              {CAPABILITIES.map((c, i) => (
                <motion.div key={c.title} {...rise(i * 0.08)} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[34px] top-2 h-2.5 w-2.5 rounded-full bg-[var(--brass)] ring-4 ring-[rgba(220,181,103,0.18)]"
                  />
                  <h3 className="font-sans text-lg font-semibold text-[#eef4f0]">{c.title}</h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#a9bcb0]">{c.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sigma specialist panel */}
          <motion.aside style={reduce ? undefined : { y: panelY }}>
            <motion.div
              {...rise(0.12)}
              className="glass-dark sticky top-24 rounded-[4px] p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--brass)]">
                Specialisation
              </p>
              <h3 className="display mt-3 text-3xl text-[#eef4f0]">
                Sigma <span className="text-[var(--brass)]">Specialists</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#a9bcb0]">
                Sigma/LG control systems are our deepest expertise — the panels most contractors refuse to touch, we
                diagnose to board level and rectify.
              </p>
              <ul className="mt-5 space-y-2.5">
                {SIGMA_POINTS.map((pt, i) => (
                  <motion.li
                    key={pt}
                    {...rise(0.18 + i * 0.06)}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-[#c6d4cb]"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--brass)]" aria-hidden />
                    {pt}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[rgba(233,238,233,0.16)] pt-5">
                <div>
                  <div className="display text-2xl text-[var(--brass)]">
                    <Counter value={26} suffix="+" />
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#a9bcb0]">
                    Years on Sigma
                  </div>
                </div>
                <div>
                  <div className="display text-2xl text-[var(--brass)]">
                    <Counter value={4} />
                  </div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#a9bcb0]">
                    Korea trainings
                  </div>
                </div>
              </div>

              <Link href="/services/elevator-supply-installation" className="btn-primary mt-6 w-full justify-center">
                New Elevator Enquiry →
              </Link>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
