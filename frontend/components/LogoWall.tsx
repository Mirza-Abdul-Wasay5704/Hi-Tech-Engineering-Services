/* eslint-disable @next/next/no-img-element */
import { mediaUrl } from "@/lib/api";
import type { Project } from "@/lib/types";
import { RevealGroup, RevealItem } from "./motion";

function LogoTile({ project }: { project: Project }) {
  const label = project.client_name || project.name;
  return (
    <RevealItem>
      <div className="group relative flex h-28 items-center justify-center overflow-hidden rounded-[4px] border border-[var(--line)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--green)] hover:shadow-[0_6px_20px_-8px_rgba(18,59,45,0.35)]">
        {/* brass corner tick — machine-plate detail */}
        <span className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[var(--brass)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[var(--brass)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {project.logo_url ? (
          <img
            src={mediaUrl(project.logo_url)}
            alt={`${label} logo`}
            className="max-h-16 max-w-[78%] object-contain transition-transform duration-300 group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <span className="px-4 text-center font-mono text-[11px] font-semibold uppercase leading-snug tracking-[0.12em] text-[var(--ink)]">
            {label}
          </span>
        )}
      </div>
    </RevealItem>
  );
}

/** Full client wall — every client on its own white plate, so no logo can
    blend into the page. Logos lead; text-plates (no logo yet) follow. */
export default function LogoWall({ projects }: { projects: Project[] }) {
  const clients = projects.filter((p) => p.show_logo);
  if (clients.length === 0) return null;
  const sorted = [...clients].sort((a, b) => Number(Boolean(b.logo_url)) - Number(Boolean(a.logo_url)));

  return (
    <div className="mx-auto max-w-6xl px-5" aria-label="Clients we serve">
      <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sorted.map((p) => (
          <LogoTile key={p.id} project={p} />
        ))}
      </RevealGroup>
      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
        {sorted.length} buildings under care across Karachi
      </p>
    </div>
  );
}
