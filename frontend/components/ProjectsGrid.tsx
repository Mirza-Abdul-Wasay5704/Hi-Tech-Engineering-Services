"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/types";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-[2px] border px-4 py-1.5 font-mono text-xs tracking-wider transition-colors ${
              active === c
                ? "border-[var(--green)] bg-[var(--green)] text-[var(--paper)]"
                : "border-[var(--line)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--green)] hover:text-[var(--ink)]"
            }`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-[var(--muted)]">No projects in this category yet.</p>
      )}
    </div>
  );
}
