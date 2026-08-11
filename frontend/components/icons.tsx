const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ServiceIcon({ icon, className = "h-7 w-7" }: { icon: string; className?: string }) {
  switch (icon) {
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE}>
          <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "cpu":
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE}>
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
          <rect x="10" y="10" width="4" height="4" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
        </svg>
      );
    case "package":
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
        </svg>
      );
    case "tower":
      // new elevator supply & installation — a shaft with a rising car
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE}>
          <path d="M5 21V4a1 1 0 011-1h12a1 1 0 011 1v17" />
          <rect x="9" y="9" width="6" height="7" rx="0.5" />
          <path d="M12 6.5V3.2M10.4 5l1.6-1.8L13.6 5" />
          <path d="M3 21h18" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} {...STROKE}>
          <path d="M14.5 6.5a4.5 4.5 0 01-6 4.24L4 15.24V20h4.76l4.5-4.5a4.5 4.5 0 105.24-9l-2.5 2.5-2-2 2.5-2.5z" />
        </svg>
      );
  }
}
