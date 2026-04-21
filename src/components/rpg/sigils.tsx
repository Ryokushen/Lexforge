/**
 * Illuminated sigils, heron marks, and corner flourishes.
 * All draw as inline SVG using currentColor so they recolor by palette.
 */

type SigilProps = { size?: number; className?: string };

export function HeronWheel({ size = 40, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="32" r="26" />
      <circle cx="32" cy="32" r="21" strokeDasharray="2 3" opacity=".6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="32"
          y1="32"
          x2={32 + Math.cos((a * Math.PI) / 180) * 21}
          y2={32 + Math.sin((a * Math.PI) / 180) * 21}
          opacity=".35"
        />
      ))}
      <path
        d="M22 40 C 26 36 30 36 32 34 C 34 32 34 28 36 24 C 38 20 42 20 44 22 L 41 24 L 42 27 L 39 26 L 37 30 C 36 33 35 37 34 40 Z"
        fill="currentColor"
        opacity=".9"
      />
      <path d="M44 22 L 52 18" strokeWidth="1.2" />
      <circle cx="42.5" cy="23" r=".8" fill="currentColor" />
    </svg>
  );
}

export function Flame({ size = 36, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path
        d="M24 6 C 28 14 34 16 34 26 C 34 33 29 38 24 38 C 19 38 14 33 14 26 C 14 22 17 18 18 14 C 20 18 22 14 24 6 Z"
        fill="currentColor"
        fillOpacity=".12"
      />
      <path
        d="M24 14 C 26 19 29 20 29 26 C 29 30 27 33 24 33 C 21 33 19 30 19 26 C 19 23 21 22 22 19 C 23 21 23 19 24 14 Z"
        fill="currentColor"
        fillOpacity=".35"
      />
      <circle cx="24" cy="41" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function Star({ size = 36, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <circle cx="24" cy="24" r="17" strokeDasharray="2 3" opacity=".5" />
      <path
        d="M24 6 L 27 21 L 42 24 L 27 27 L 24 42 L 21 27 L 6 24 L 21 21 Z"
        fill="currentColor"
        fillOpacity=".2"
      />
      <path
        d="M24 11 L 26 22 L 37 24 L 26 26 L 24 37 L 22 26 L 11 24 L 22 22 Z"
        fill="currentColor"
        fillOpacity=".4"
      />
      <circle cx="24" cy="24" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function Sun({ size = 36, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
        <line
          key={a}
          x1={24 + Math.cos((a * Math.PI) / 180) * 13}
          y1={24 + Math.sin((a * Math.PI) / 180) * 13}
          x2={24 + Math.cos((a * Math.PI) / 180) * 20}
          y2={24 + Math.sin((a * Math.PI) / 180) * 20}
        />
      ))}
      <circle cx="24" cy="24" r="10" fill="currentColor" fillOpacity=".18" />
      <path
        d="M15 24 Q 24 17 33 24 Q 24 31 15 24 Z"
        fill="currentColor"
        fillOpacity=".5"
      />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function Vine({ size = 36, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M24 8 C 30 14 30 20 24 24 C 18 28 18 34 24 40"
        fill="none"
      />
      <path d="M24 14 C 30 14 34 10 34 8" />
      <path d="M30 14 C 30 10 33 8 36 8" opacity=".5" />
      <ellipse
        cx="31"
        cy="11"
        rx="3"
        ry="1.6"
        transform="rotate(-30 31 11)"
        fill="currentColor"
        fillOpacity=".35"
      />
      <path d="M24 24 C 18 24 14 28 14 30" />
      <ellipse
        cx="16"
        cy="28"
        rx="3"
        ry="1.6"
        transform="rotate(30 16 28)"
        fill="currentColor"
        fillOpacity=".35"
      />
      <path d="M24 34 C 30 34 34 38 34 40" />
      <ellipse
        cx="32"
        cy="37"
        rx="3"
        ry="1.6"
        transform="rotate(-30 32 37)"
        fill="currentColor"
        fillOpacity=".35"
      />
    </svg>
  );
}

export function Sword({ size = 24, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 3.5 L 20.5 3.5 L 20.5 9.5 L 10 20 L 6 20 L 6 16 L 14.5 3.5 Z" />
      <line x1="6" y1="20" x2="3" y2="23" />
      <line x1="10" y1="14" x2="14" y2="18" />
    </svg>
  );
}

export function Scroll({ size = 20, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4 C 5 6 7 6 7 4 L 17 4 C 19 4 19 8 17 8 L 17 20 C 17 21 16 22 15 22 L 7 22 C 5 22 5 20 5 18 Z" />
      <path d="M7 4 C 5 4 5 8 7 8 L 15 8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

export function Tome({ size = 20, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4 L 11 5 L 11 21 L 4 20 Z" />
      <path d="M20 4 L 13 5 L 13 21 L 20 20 Z" />
      <path d="M11 5 L 13 5" />
    </svg>
  );
}

export function Shield({ size = 20, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M12 3 L 20 6 L 20 12 C 20 17 16 20 12 22 C 8 20 4 17 4 12 L 4 6 Z" />
      <path
        d="M12 8 L 14 12 L 12 16 L 10 12 Z"
        fill="currentColor"
        fillOpacity=".3"
      />
    </svg>
  );
}

export function FlameSm({ size = 18, className }: SigilProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
      <path
        d="M12 2 C 14 6 17 8 17 13 C 17 17 15 19 12 19 C 9 19 7 17 7 13 C 7 11 8 9 9 7 C 10 9 11 8 12 2 Z"
        opacity=".9"
      />
    </svg>
  );
}

export function Compass({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 5 L 14 12 L 12 19 L 10 12 Z"
        fill="currentColor"
        fillOpacity=".3"
      />
    </svg>
  );
}

export function Anvil({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9 L 16 9 C 17 11 18 12 21 12 L 18 15 L 6 15 L 4 12 Z" />
      <path d="M10 15 L 10 19 L 14 19 L 14 15" />
      <line x1="6" y1="21" x2="18" y2="21" />
    </svg>
  );
}

export function CornerFlourish({ size = 34, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 2 L 22 2" />
      <path d="M2 2 L 2 22" />
      <path d="M2 2 L 14 14" opacity=".6" />
      <path d="M7 2 Q 10 7 7 10 Q 4 7 7 2" fill="currentColor" fillOpacity=".25" />
      <path d="M2 7 Q 7 10 10 7 Q 7 4 2 7" fill="currentColor" fillOpacity=".25" />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" />
      <path d="M18 2 Q 20 4 22 2" />
      <path d="M2 18 Q 4 20 2 22" />
    </svg>
  );
}

export function HeronMark({ size = 22, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 40 20"
      width={size * 2}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 10 L 10 10" />
      <path d="M30 10 L 38 10" />
      <path d="M12 10 C 14 8 16 6 18 6 C 20 6 21 8 22 10 C 23 12 24 14 26 14 C 28 14 29 12 29 10" />
      <circle cx="29.5" cy="10" r="1.2" fill="currentColor" />
      <path d="M18 6 L 20 2" />
      <path d="M22 10 L 20 14" />
    </svg>
  );
}

export function Check({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12 L 10 17 L 19 7" />
    </svg>
  );
}

export function Cross({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M6 6 L 18 18" />
      <path d="M18 6 L 6 18" />
    </svg>
  );
}

export function ChevronRight({ size = 16, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6 L 15 12 L 9 18" />
    </svg>
  );
}

export function ArrowLeft({ size = 16, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12 L 4 12 M 10 6 L 4 12 L 10 18" />
    </svg>
  );
}

export function Lantern({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2 L 12 4" />
      <path d="M8 4 L 16 4" />
      <path d="M8 4 C 6 8 6 14 8 18 L 16 18 C 18 14 18 8 16 4" />
      <path
        d="M7 18 L 17 18 L 17 20 L 7 20 Z"
        fill="currentColor"
        fillOpacity=".3"
      />
      <circle cx="12" cy="11" r="2.2" fill="currentColor" fillOpacity=".4" />
    </svg>
  );
}

export function RuneEasy({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M6 6 L 12 18 L 18 6" />
    </svg>
  );
}

export function RuneNormal({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M6 4 L 6 20 M 18 4 L 18 20 M 6 12 L 18 12" />
    </svg>
  );
}

export function RuneHard({ size = 18, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4 L 18 12 L 6 20 M 18 4 L 12 12 L 18 20" />
    </svg>
  );
}

export function HeronSilhouette({ size = 120, className }: SigilProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M28 96 C 44 70 62 60 74 44 C 80 36 82 28 90 22 L 102 14" />
      <path d="M90 22 L 108 18" />
      <circle cx="88" cy="24" r="1.6" fill="currentColor" />
      <path d="M60 66 C 52 72 46 80 42 96" />
      <path d="M68 58 C 66 76 64 90 58 104" opacity=".7" />
      <path d="M26 96 L 94 96" />
    </svg>
  );
}

export const Sigil = {
  HeronWheel,
  Flame,
  Star,
  Sun,
  Vine,
  Sword,
  Scroll,
  Tome,
  Shield,
  FlameSm,
  Compass,
  Anvil,
  CornerFlourish,
  HeronMark,
  Check,
  Cross,
  ChevronRight,
  ArrowLeft,
  Lantern,
  RuneEasy,
  RuneNormal,
  RuneHard,
  HeronSilhouette,
};
