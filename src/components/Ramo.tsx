/** Filete em rose gold com um ramo em traço fino — o toque de verde e de rose da entrada. */
export function Ramo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 40" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="filete-rose" gradientUnits="userSpaceOnUse" x1="8" x2="232" y1="20" y2="20">
          <stop offset="0" stopColor="var(--rose-escuro)" stopOpacity="0" />
          <stop offset="0.3" stopColor="var(--rose)" />
          <stop offset="0.5" stopColor="#f3d2c4" />
          <stop offset="0.7" stopColor="var(--rose)" />
          <stop offset="1" stopColor="var(--rose-escuro)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M8 20 H232" stroke="url(#filete-rose)" strokeWidth="0.9" />
      <g stroke="var(--salvia)" strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M120 20 C112 12 104 9 94 9 C100 15 108 19 120 20Z" />
        <path d="M120 20 C128 12 136 9 146 9 C140 15 132 19 120 20Z" />
        <path d="M120 20 C113 26 106 30 97 31 C102 25 110 21 120 20Z" />
        <path d="M120 20 C127 26 134 30 143 31 C138 25 130 21 120 20Z" />
      </g>
      <circle cx="120" cy="20" r="2.2" fill="var(--rose)" />
    </svg>
  );
}
