import type { Sector } from "@/types/project";

interface Props {
  sector: Sector;
  className?: string;
  variant?: "card" | "marker";
}

// Distinctive blueprint-feeling patterns per sector.
// Tile fills the card; uses currentColor for stroke so we can tint per sector.
export default function SectorPattern({ sector, className = "", variant = "card" }: Props) {
  const tint = SECTOR_TINTS[sector] ?? SECTOR_TINTS.unknown;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: tint.bg, color: tint.stroke }}
    >
      <svg
        className="absolute inset-0 w-full h-full opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`pat-${sector}-${variant}`}
            width={PATTERN_DEFS[sector].size}
            height={PATTERN_DEFS[sector].size}
            patternUnits="userSpaceOnUse"
          >
            {PATTERN_DEFS[sector].content}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pat-${sector}-${variant})`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10" />
    </div>
  );
}

const SECTOR_TINTS: Record<Sector, { bg: string; stroke: string }> = {
  hospitality: { bg: "#EFD9C7", stroke: "#A8331F" },
  "restaurant-bar": { bg: "#E8C9B8", stroke: "#8B2E1C" },
  coffee: { bg: "#D9C5A8", stroke: "#5A3E1F" },
  "commercial-upfit": { bg: "#D8D2C0", stroke: "#3D5142" },
  residential: { bg: "#D7DCC4", stroke: "#3F4F2D" },
  retail: { bg: "#E5D6C2", stroke: "#8C6A3E" },
  millwork: { bg: "#D4C4A8", stroke: "#5A3E1F" },
  unknown: { bg: "#E0DCD0", stroke: "#6B6359" },
};

const PATTERN_DEFS: Record<Sector, { size: number; content: React.ReactNode }> = {
  hospitality: {
    size: 28,
    // Wine-glass-ish diamond grid
    content: (
      <>
        <path d="M14 4 L20 14 L14 24 L8 14 Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </>
    ),
  },
  "restaurant-bar": {
    size: 32,
    // Cocktail / coupe glass
    content: (
      <>
        <path d="M8 6 L24 6 L16 18 Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <line x1="16" y1="18" x2="16" y2="26" stroke="currentColor" strokeWidth="1" />
        <line x1="12" y1="26" x2="20" y2="26" stroke="currentColor" strokeWidth="1" />
      </>
    ),
  },
  coffee: {
    size: 26,
    // Coffee bean grid
    content: (
      <>
        <ellipse cx="13" cy="13" rx="6" ry="4" stroke="currentColor" strokeWidth="1" fill="none" transform="rotate(-30 13 13)" />
        <path d="M9 11 Q13 15 17 11" stroke="currentColor" strokeWidth="0.8" fill="none" transform="rotate(-30 13 13)" />
      </>
    ),
  },
  "commercial-upfit": {
    size: 30,
    // Architectural cross-hatch / blueprint
    content: (
      <>
        <line x1="0" y1="0" x2="30" y2="30" stroke="currentColor" strokeWidth="0.6" />
        <line x1="30" y1="0" x2="0" y2="30" stroke="currentColor" strokeWidth="0.6" />
        <rect x="10" y="10" width="10" height="10" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </>
    ),
  },
  residential: {
    size: 32,
    // Little house gable
    content: (
      <>
        <path d="M6 22 L16 10 L26 22 Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <rect x="12" y="16" width="8" height="6" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </>
    ),
  },
  retail: {
    size: 28,
    // Shop awning stripes
    content: (
      <>
        <line x1="0" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.2" />
        <line x1="0" y1="0" x2="14" y2="14" stroke="currentColor" strokeWidth="0.5" />
        <line x1="14" y1="14" x2="28" y2="0" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="28" x2="14" y2="14" stroke="currentColor" strokeWidth="0.5" />
        <line x1="14" y1="14" x2="28" y2="28" stroke="currentColor" strokeWidth="0.5" />
      </>
    ),
  },
  millwork: {
    size: 24,
    // Wood grain
    content: (
      <>
        <path d="M0 6 Q12 9 24 6" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M0 12 Q12 15 24 12" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M0 18 Q12 21 24 18" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </>
    ),
  },
  unknown: {
    size: 24,
    // Question dots
    content: (
      <>
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
        <circle cx="18" cy="18" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </>
    ),
  },
};
