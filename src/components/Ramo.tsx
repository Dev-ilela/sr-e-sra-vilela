/** Ramo botânico em traço fino — o único toque de verde da entrada. */
export function Ramo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 20 H232" stroke="var(--ouro)" strokeWidth="0.75" />
      <g stroke="var(--salvia)" strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M120 20 C112 12 104 9 94 9 C100 15 108 19 120 20Z" />
        <path d="M120 20 C128 12 136 9 146 9 C140 15 132 19 120 20Z" />
        <path d="M120 20 C113 26 106 30 97 31 C102 25 110 21 120 20Z" />
        <path d="M120 20 C127 26 134 30 143 31 C138 25 130 21 120 20Z" />
      </g>
      <circle cx="120" cy="20" r="2" fill="var(--ouro)" />
    </svg>
  );
}
