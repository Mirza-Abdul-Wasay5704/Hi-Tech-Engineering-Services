"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Insights" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b-2 border-[var(--line-strong)] bg-[rgba(239,241,238,0.92)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Hi-Tech Engineering Services — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Hi-Tech Engineering Services logo" className="h-10 w-auto" width={44} height={40} />
          <span className="leading-tight">
            <span className="display block text-[16px] tracking-wide">
              HI-TECH <span className="text-[var(--green)]">ENGINEERING</span>
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Elevator Services · Karachi
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors ${
                  active
                    ? "font-semibold text-[var(--green)] underline decoration-[var(--brass)] decoration-2 underline-offset-8"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary !px-4 !py-2 text-sm">
            Request a Quote
          </Link>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`h-[2px] w-5 bg-current transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-[2px] w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-5 bg-current transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--line)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded px-2 py-2.5 text-[15px] text-[var(--ink)] hover:bg-[var(--green-wash)]"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary mt-2 justify-center">
                Request a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Company mark — digitized from the Hi-Tech hexagon "H" plaque.
    variant "light" sits on paper backgrounds, "dark" on enamel green. */
export function LogoMark({ size = 38, variant = "light" }: { size?: number; variant?: "light" | "dark" }) {
  const hexFill = variant === "light" ? "#121d18" : "#eee9d9";
  const keyline = variant === "light" ? "#96793d" : "#123b2d";
  const legLeft = variant === "light" ? "#eee9d9" : "#123b2d";
  const legRight = "#96793d";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <g transform="rotate(8 50 50)">
        <polygon
          points="50,3 90.7,26.5 90.7,73.5 50,97 9.3,73.5 9.3,26.5"
          fill={hexFill}
          stroke={keyline}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* left leg — cream, with the plaque's slanted foot */}
        <polygon points="29,29 43,29 43,60 37,71 29,71" fill={legLeft} />
        {/* crossbar */}
        <polygon points="29,45 71,45 71,55 29,55" fill={legLeft} />
        {/* right leg — brass, with cut shoulder */}
        <polygon points="57,29 71,29 71,71 63,71 57,60" fill={legRight} />
      </g>
    </svg>
  );
}
