"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqItem } from "@/lib/types";

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items?.length) return null;
  return (
    <div className="divide-y divide-[var(--line)] rounded-[3px] border border-[var(--line)] bg-[var(--panel)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-medium">{item.q}</span>
              <span
                className={`shrink-0 font-mono text-lg text-[var(--brass)] transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
