/**
 * Static, high-detail SVG illustration of a modern elevator — brass portal,
 * brushed-steel doors parted onto a warm cabin, lit floor indicator.
 * Pure SVG: crisp at any size, no animation, fully responsive.
 */
export default function ElevatorArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 620"
      className={className}
      role="img"
      aria-label="A modern elevator with brushed-steel doors open onto a warm cabin"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="ea-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6c469" />
          <stop offset="0.45" stopColor="#b8912f" />
          <stop offset="1" stopColor="#7c6226" />
        </linearGradient>
        <linearGradient id="ea-brass-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8b24a" />
          <stop offset="1" stopColor="#8a6c2c" />
        </linearGradient>
        <linearGradient id="ea-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#aeb6ae" />
          <stop offset="0.15" stopColor="#d6dad4" />
          <stop offset="0.5" stopColor="#b9c0b8" />
          <stop offset="0.85" stopColor="#d9ddd7" />
          <stop offset="1" stopColor="#a7afa7" />
        </linearGradient>
        <linearGradient id="ea-steel2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a7afa7" />
          <stop offset="0.15" stopColor="#d2d7d0" />
          <stop offset="0.5" stopColor="#b4bcb4" />
          <stop offset="0.85" stopColor="#d6dad4" />
          <stop offset="1" stopColor="#aeb6ae" />
        </linearGradient>
        <linearGradient id="ea-cabin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f0e7" />
          <stop offset="1" stopColor="#d8d5c7" />
        </linearGradient>
        <linearGradient id="ea-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8c4b4" />
          <stop offset="1" stopColor="#a9a594" />
        </linearGradient>
        <radialGradient id="ea-glow" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#f5c96b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f5c96b" stopOpacity="0" />
        </radialGradient>
        <filter id="ea-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#12211b" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* blueprint backdrop */}
      <g stroke="#c9cfc9" strokeWidth="1" opacity="0.5">
        {[60, 120, 180, 240, 300, 360, 420, 480, 540].map((y) => (
          <line key={`h${y}`} x1="20" y1={y} x2="420" y2={y} />
        ))}
        {[80, 160, 240, 320, 400].map((x) => (
          <line key={`v${x}`} x1={x} y1="40" x2={x} y2="560" />
        ))}
      </g>

      {/* soft floor shadow */}
      <ellipse cx="220" cy="566" rx="150" ry="16" fill="#12211b" opacity="0.18" />

      {/* ===== brass portal frame ===== */}
      <g filter="url(#ea-shadow)">
        <rect x="70" y="52" width="300" height="500" rx="8" fill="url(#ea-brass)" />
        <rect x="70" y="52" width="300" height="500" rx="8" fill="none" stroke="#6f571f" strokeWidth="1.5" />
        {/* header indicator panel */}
        <rect x="70" y="52" width="300" height="52" rx="8" fill="#0f2c22" />
        <rect x="70" y="96" width="300" height="8" fill="#0a1f18" />
        {/* floor pips */}
        <g fill="#5a655f">
          {[150, 178, 206, 234].map((x, i) => (
            <rect key={x} x={x} y="72" width="16" height="10" rx="2" fill={i === 3 ? "#f5c96b" : "#3a463f"} />
          ))}
        </g>
        {/* travel direction + floor number */}
        <path d="M300 82 l7 -12 l7 12 z" fill="#f5c96b" />
        <text x="130" y="86" fontFamily="var(--font-plex-mono), monospace" fontSize="20" fontWeight="700" fill="#f5c96b">
          04
        </text>
      </g>

      {/* ===== cabin interior (behind the doors) ===== */}
      <clipPath id="ea-opening">
        <rect x="104" y="120" width="232" height="404" />
      </clipPath>
      <g clipPath="url(#ea-opening)">
        <rect x="104" y="120" width="232" height="404" fill="url(#ea-cabin)" />
        {/* warm ceiling glow */}
        <rect x="104" y="120" width="232" height="404" fill="url(#ea-glow)" />
        {/* back-wall panels */}
        <g stroke="#c3bfae" strokeWidth="1.5" fill="none">
          <rect x="140" y="150" width="70" height="300" rx="3" />
          <rect x="230" y="150" width="70" height="300" rx="3" />
        </g>
        {/* mirror sheen */}
        <rect x="236" y="156" width="58" height="150" rx="3" fill="#eef2ee" opacity="0.5" />
        <line x1="248" y1="164" x2="270" y2="150" stroke="#ffffff" strokeWidth="6" opacity="0.4" strokeLinecap="round" />
        {/* handrail */}
        <rect x="132" y="330" width="176" height="7" rx="3.5" fill="url(#ea-brass-v)" />
        {[136, 304].map((x) => (
          <rect key={x} x={x} y="330" width="6" height="26" rx="2" fill="url(#ea-brass-v)" />
        ))}
        {/* ceiling light */}
        <rect x="150" y="126" width="140" height="12" rx="6" fill="#f7e6b8" opacity="0.85" />
        {/* cabin floor */}
        <rect x="104" y="470" width="232" height="54" fill="url(#ea-floor)" />
        <line x1="104" y1="470" x2="336" y2="470" stroke="#8f8b79" strokeWidth="2" />
      </g>

      {/* threshold sill */}
      <rect x="104" y="520" width="232" height="8" fill="url(#ea-brass-v)" />
      <g stroke="#7c6226" strokeWidth="1">
        {[130, 160, 190, 220, 250, 280, 310].map((x) => (
          <line key={x} x1={x} y1="521" x2={x} y2="527" />
        ))}
      </g>

      {/* ===== the two doors, parted ===== */}
      {/* left door */}
      <g>
        <rect x="104" y="120" width="70" height="400" fill="url(#ea-steel)" />
        <rect x="104" y="120" width="70" height="400" fill="none" stroke="#8f968f" strokeWidth="1" />
        <line x1="140" y1="128" x2="140" y2="512" stroke="#9aa19a" strokeWidth="1" opacity="0.7" />
        <rect x="160" y="300" width="6" height="44" rx="3" fill="#8b928b" />
      </g>
      {/* right door */}
      <g>
        <rect x="266" y="120" width="70" height="400" fill="url(#ea-steel2)" />
        <rect x="266" y="120" width="70" height="400" fill="none" stroke="#8f968f" strokeWidth="1" />
        <line x1="300" y1="128" x2="300" y2="512" stroke="#9aa19a" strokeWidth="1" opacity="0.7" />
        <rect x="274" y="300" width="6" height="44" rx="3" fill="#8b928b" />
      </g>
      {/* door leading-edge shadows into the opening */}
      <rect x="174" y="120" width="10" height="400" fill="#12211b" opacity="0.16" />
      <rect x="256" y="120" width="10" height="400" fill="#12211b" opacity="0.16" />

      {/* ===== call panel on the wall ===== */}
      <g filter="url(#ea-shadow)">
        <rect x="386" y="300" width="30" height="66" rx="8" fill="#122a20" />
        <path d="M401 316 l9 12 h-18 z" fill="#f5c96b" />
        <path d="M401 350 l-9 -12 h18 z" fill="#8a9a8f" />
      </g>

      {/* section tag, like a drawing callout */}
      <text
        x="70"
        y="574"
        fontFamily="var(--font-plex-mono), monospace"
        fontSize="11"
        letterSpacing="3"
        fill="#5a655f"
      >
        PASSENGER CAR · TYPE MRL
      </text>
    </svg>
  );
}
