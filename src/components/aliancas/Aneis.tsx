import { useId } from "react";

/**
 * As duas alianças da brincadeira, desenhadas em SVG com ouro amarelo:
 *  - Solitário: aro fino, seis garras altas e um brilhante redondo (o anel dela);
 *  - Aliança lisa: aro mais largo e abaulado (a dele).
 * Vistas de lado e um pouco de cima, como se estivessem caídas numa mesa.
 */

function Ouro({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-ouro`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff1b8" />
        <stop offset="0.28" stopColor="#e6c35c" />
        <stop offset="0.55" stopColor="#b98a24" />
        <stop offset="0.8" stopColor="#e9cc6e" />
        <stop offset="1" stopColor="#9c7316" />
      </linearGradient>
      <linearGradient id={`${id}-fundo`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8f6a17" />
        <stop offset="1" stopColor="#c99f3a" />
      </linearGradient>
      <radialGradient id={`${id}-pedra`} cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#e8f1fb" />
        <stop offset="0.75" stopColor="#b9cbe0" />
        <stop offset="1" stopColor="#8ea6c2" />
      </radialGradient>
    </defs>
  );
}

export function Solitario({ className, brilho = true }: { className?: string; brilho?: boolean }) {
  const id = useId().replace(/:/g, "");
  const ouro = `url(#${id}-ouro)`;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <Ouro id={id} />
      {/* metade de trás do aro (mais escura, passa por trás da pedra) */}
      <path d="M22 78 A38 28 0 0 1 98 78" fill="none" stroke={`url(#${id}-fundo)`} strokeWidth={4} />
      {/* cabeça: garras e pedra (pequena e delicada, como a do anel dela) */}
      <g transform="translate(60 60) scale(0.72) translate(-60 -60)">
        <path d="M50 52 L54 64 H66 L70 52" fill={ouro} stroke="#8f6a17" strokeWidth={0.8} />
        {[
          [45, 30, 49, 54],
          [52, 26, 54, 58],
          [68, 26, 66, 58],
          [75, 30, 71, 54],
        ].map(([x1, y1, x2, y2]) => (
          <path key={x1} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={ouro} strokeWidth={2.6} strokeLinecap="round" />
        ))}
        {/* brilhante redondo: coroa + pavilhão, com as facetas */}
        <path d="M44 36 L50 28 H70 L76 36 L60 52 Z" fill={`url(#${id}-pedra)`} stroke="#7d93ad" strokeWidth={0.8} strokeLinejoin="round" />
        <path d="M44 36 H76 M50 28 L55 36 L60 28 L65 36 L70 28 M55 36 L60 52 L65 36" fill="none" stroke="#7d93ad" strokeWidth={0.6} opacity={0.8} />
        <path d="M51 31 L54 31" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
        {/* garras da frente, por cima da pedra */}
        {[
          [43, 34, 48, 56],
          [77, 34, 72, 56],
        ].map(([x1, y1, x2, y2]) => (
          <path key={x1} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={ouro} strokeWidth={3.2} strokeLinecap="round" />
        ))}
      </g>
      {/* metade da frente do aro, mais grossa e clara */}
      <path d="M22 78 A38 28 0 0 0 98 78" fill="none" stroke={ouro} strokeWidth={6} />
      <path d="M30 88 A30 18 0 0 0 64 105" fill="none" stroke="#fff6d0" strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
      {brilho && (
        <path className="anel__brilho" d="M86 22 l2.4 6.6 6.6 2.4 -6.6 2.4 -2.4 6.6 -2.4 -6.6 -6.6 -2.4 6.6 -2.4 Z" fill="#fff" />
      )}
    </svg>
  );
}

export function AliancaLisa({ className, brilho = true }: { className?: string; brilho?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <Ouro id={id} />
      {/* parte de trás (o "dentro" do aro aparecendo) */}
      <path d="M18 62 A42 26 0 0 1 102 62" fill="none" stroke={`url(#${id}-fundo)`} strokeWidth={9} />
      {/* frente larga e abaulada */}
      <path d="M18 62 A42 26 0 0 0 102 62" fill="none" stroke={`url(#${id}-ouro)`} strokeWidth={14} />
      <path d="M26 72 A36 20 0 0 0 60 86" fill="none" stroke="#fff6d0" strokeWidth={2.4} strokeLinecap="round" opacity={0.85} />
      <path d="M18 62 A42 26 0 0 0 102 62" fill="none" stroke="#8f6a17" strokeWidth={0.8} opacity={0.5} transform="translate(0 7)" />
      {brilho && (
        <path className="anel__brilho" d="M94 36 l2.4 6.6 6.6 2.4 -6.6 2.4 -2.4 6.6 -2.4 -6.6 -6.6 -2.4 6.6 -2.4 Z" fill="#fff" />
      )}
    </svg>
  );
}
