import { Reveal } from "./motion";

/**
 * Floor landing: every section opens like a floor line on an elevation
 * drawing — a strong rule carrying a brass floor plate and a mono label.
 */
export default function SectionHeading({
  floor,
  label,
  title,
  subtitle,
}: {
  floor: string;
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <div className="landing">
        <span className="floor-plate">{floor}</span>
        <span className="landing-label">{label}</span>
      </div>
      <h2 className="display mt-6 text-4xl md:text-6xl">{title}</h2>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
