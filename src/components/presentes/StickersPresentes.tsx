import type { ReactNode } from "react";
import {
  BRANCO,
  Brilho,
  CREME,
  coracao,
  desenhos as desenhosMural,
  Faixa,
  Folha,
  OURO,
  OURO_ESCURO,
  ROSE,
  ROSE_ESCURO,
  SALVIA,
  SALVIA_ESCURA,
  T,
  traco,
} from "@/components/mural/Stickers";

/**
 * Stickers da lista de presentes: um por tipo de item, no mesmo traço de "flash" de
 * tatuagem dos stickers do mural. Aparecem no card quando o presente é dado.
 */

const ESCURO = "#2f3b4f"; // eletrodoméstico preto, com o traço ainda visível
const VIDRO = "#3d5272";
const CINZA = "#d3d9e0";
const CINZA_MEDIO = "#a9b3bf";
const AZUL = "#dff0fb";
const AGUA = "#a9d3ee";
const MADEIRA = "#d39a62";
const MADEIRA_ESCURA = "#a86f3f";
const CAFE = "#7a5038";

const fino = { stroke: T, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Fumacinha de algo quente subindo. */
function Vapor({ x, y, alt = 16 }: { x: number; y: number; alt?: number }) {
  return (
    <path
      d={`M${x} ${y} q-5 ${-alt / 3} 0 ${(-alt * 2) / 3} q5 ${-alt / 3} 0 ${-alt}`}
      fill="none"
      stroke={T}
      strokeWidth={2.4}
      strokeLinecap="round"
      opacity={0.55}
    />
  );
}

/** Reflexo branco em superfícies lisas. */
function Reflexo({ d }: { d: string }) {
  return <path d={d} fill="none" stroke={BRANCO} strokeWidth={3} strokeLinecap="round" opacity={0.85} />;
}

function Coracaozinho({ x, y, s = 7, cor = ROSE }: { x: number; y: number; s?: number; cor?: string }) {
  return <path d={coracao(x, y, s)} fill={cor} {...traco} strokeWidth={2.2} />;
}

function Olhos({ x, y, d = 12, feliz = true }: { x: number; y: number; d?: number; feliz?: boolean }) {
  return (
    <g>
      <circle cx={x - d / 2} cy={y} r={2.6} fill={T} />
      <circle cx={x + d / 2} cy={y} r={2.6} fill={T} />
      {feliz && <path d={`M${x - 5} ${y + 6} Q${x} ${y + 11} ${x + 5} ${y + 6}`} fill="none" {...fino} strokeWidth={2.2} />}
    </g>
  );
}

const desenhos: Record<string, ReactNode> = {
  geladeira: (
    <g>
      <rect x={32} y={8} width={56} height={102} rx={9} fill={ESCURO} {...traco} />
      <path d="M32 44 H88" {...traco} />
      <rect x={78} y={18} width={4} height={16} rx={2} fill={CINZA} {...fino} />
      <rect x={78} y={54} width={4} height={26} rx={2} fill={CINZA} {...fino} />
      <Reflexo d="M40 16 V36 M40 52 V96" />
      {/* ímã de coração e um bilhetinho */}
      <Coracaozinho x={50} y={24} s={7} />
      <rect x={46} y={60} width={20} height={22} rx={1.5} fill={OURO} {...fino} transform="rotate(-6 56 71)" />
      <path d="M50 67 H62 M50 72 H60 M50 77 H58" stroke={T} strokeWidth={1.4} opacity={0.6} transform="rotate(-6 56 71)" />
      <rect x={36} y={108} width={10} height={5} rx={2} fill={T} />
      <rect x={74} y={108} width={10} height={5} rx={2} fill={T} />
      <Brilho x={102} y={22} r={6} />
    </g>
  ),
  fogao: (
    <g>
      {/* panela de brigadeiro em cima */}
      <path d="M38 24 H82 V38 Q82 44 76 44 H44 Q38 44 38 38 Z" fill={CINZA} {...traco} />
      <path d="M38 27 H26 M82 27 H94" {...traco} strokeWidth={4} />
      <ellipse cx={60} cy={24} rx={22} ry={4} fill={CAFE} {...traco} />
      <Vapor x={50} y={16} alt={12} />
      <Vapor x={68} y={16} alt={12} />
      <rect x={14} y={44} width={92} height={10} rx={3} fill={CINZA_MEDIO} {...traco} />
      <rect x={18} y={54} width={84} height={56} rx={5} fill={ESCURO} {...traco} />
      {[30, 46, 62, 78, 92].map((x) => (
        <circle key={x} cx={x} cy={62} r={3.2} fill={CINZA} {...fino} />
      ))}
      <rect x={28} y={70} width={64} height={32} rx={4} fill={VIDRO} {...traco} />
      <path d="M36 66 H84" stroke={CINZA} strokeWidth={3} strokeLinecap="round" />
      <Reflexo d="M34 76 L44 76 M34 82 L40 82" />
      <Brilho x={104} y={30} r={6} />
    </g>
  ),
  maquina: (
    <g>
      <rect x={18} y={12} width={84} height={98} rx={10} fill={ESCURO} {...traco} />
      <path d="M18 32 H102" {...traco} />
      <circle cx={84} cy={22} r={5} fill={CINZA} {...fino} />
      <rect x={28} y={19} width={30} height={6} rx={3} fill={VIDRO} {...fino} />
      <circle cx={60} cy={70} r={30} fill={CINZA} {...traco} />
      <circle cx={60} cy={70} r={22} fill={AZUL} {...traco} />
      <path d="M38 74 Q46 66 54 74 T70 74 T82 72 V80 Q72 92 60 92 Q46 92 39 82 Z" fill={AGUA} />
      <circle cx={60} cy={70} r={22} fill="none" {...traco} />
      {/* meia rodando lá dentro */}
      <path d="M52 64 L58 64 L58 72 L64 76 L61 80 L52 75 Z" fill={ROSE} {...fino} />
      <Reflexo d="M46 56 Q52 52 58 51" />
      {[
        [24, 40, 4],
        [104, 50, 5],
        [98, 100, 3.5],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={BRANCO} {...fino} />
      ))}
    </g>
  ),
  microondas: (
    <g>
      <rect x={8} y={28} width={104} height={68} rx={8} fill={ESCURO} {...traco} />
      <rect x={16} y={36} width={66} height={52} rx={4} fill={VIDRO} {...traco} />
      <rect x={86} y={38} width={20} height={10} rx={2} fill="#9fe0b5" {...fino} />
      {[56, 66, 76].map((y) => (
        <g key={y}>
          <circle cx={91} cy={y} r={2.6} fill={CINZA} {...fino} />
          <circle cx={101} cy={y} r={2.6} fill={CINZA} {...fino} />
        </g>
      ))}
      {/* caneca de café esquentando (de novo) */}
      <path d="M38 60 H58 V78 Q58 82 54 82 H42 Q38 82 38 78 Z" fill={BRANCO} {...traco} />
      <path d="M58 64 Q66 64 66 70 Q66 76 58 76" fill="none" {...traco} />
      <Vapor x={44} y={56} alt={12} />
      <Vapor x={52} y={56} alt={12} />
      <ellipse cx={48} cy={84} rx={20} ry={3} fill="none" stroke={OURO} strokeWidth={2} opacity={0.8} />
      <rect x={14} y={96} width={10} height={5} rx={2} fill={T} />
      <rect x={96} y={96} width={10} height={5} rx={2} fill={T} />
      <Brilho x={104} y={16} r={6} />
    </g>
  ),
  airfryer: (
    <g>
      <rect x={24} y={16} width={64} height={92} rx={22} fill={ESCURO} {...traco} />
      <circle cx={56} cy={34} r={8} fill={CINZA} {...traco} />
      <path d="M56 28 V34" {...fino} />
      <rect x={30} y={56} width={52} height={44} rx={12} fill={VIDRO} {...traco} />
      <rect x={46} y={72} width={20} height={9} rx={4} fill={CINZA} {...traco} />
      {/* caixinha de batata frita, claro */}
      <g transform="rotate(10 96 78)">
        <path d="M82 62 H110 L106 100 H86 Z" fill={ROSE_ESCURO} {...traco} />
        {[86, 91, 96, 101, 106].map((x, i) => (
          <rect key={x} x={x - 2.2} y={44 + (i % 2) * 6} width={4.4} height={22} rx={1.5} fill={OURO} {...fino} />
        ))}
        <path d="M82 62 H110 L109 70 Q96 76 83 70 Z" fill={ROSE_ESCURO} {...traco} />
        <Coracaozinho x={96} y={82} s={5} cor={BRANCO} />
      </g>
      <Brilho x={20} y={20} r={6} />
    </g>
  ),
  gota: (
    <g>
      <path d="M60 10 C60 10 26 52 26 76 A34 34 0 0 0 94 76 C94 52 60 10 60 10 Z" fill={AGUA} {...traco} />
      <path d="M40 66 Q38 80 46 90" fill="none" stroke={BRANCO} strokeWidth={4} strokeLinecap="round" />
      <Olhos x={60} y={74} d={16} />
      <circle cx={46} cy={82} r={3.5} fill={ROSE} opacity={0.8} />
      <circle cx={74} cy={82} r={3.5} fill={ROSE} opacity={0.8} />
      <Brilho x={96} y={28} r={7} />
      <Brilho x={22} y={40} r={4.5} />
    </g>
  ),
  tv: (
    <g>
      <rect x={8} y={14} width={104} height={68} rx={6} fill={ESCURO} {...traco} />
      <rect x={14} y={20} width={92} height={56} rx={3} fill={VIDRO} {...traco} />
      <path d="M52 36 L74 48 L52 60 Z" fill={ROSE} {...traco} />
      <Reflexo d="M20 26 L32 26" />
      <rect x={18} y={88} width={84} height={16} rx={3} fill={MADEIRA} {...traco} />
      <path d="M60 88 V104" {...fino} />
      <circle cx={54} cy={96} r={1.8} fill={T} />
      <circle cx={66} cy={96} r={1.8} fill={T} />
      <path d="M24 104 V110 M96 104 V110" {...traco} />
      {/* pipoquinha */}
      <circle cx={104} cy={12} r={4} fill={CREME} {...fino} />
      <circle cx={110} cy={18} r={3.4} fill={CREME} {...fino} />
    </g>
  ),
  sofa: (
    <g>
      <rect x={20} y={34} width={80} height={40} rx={12} fill={CINZA_MEDIO} {...traco} />
      <path d="M60 36 V70" {...fino} opacity={0.6} />
      <rect x={14} y={66} width={92} height={22} rx={8} fill={CINZA} {...traco} />
      <path d="M60 68 V86" {...fino} opacity={0.6} />
      <rect x={6} y={52} width={18} height={40} rx={8} fill={CINZA_MEDIO} {...traco} />
      <rect x={96} y={52} width={18} height={40} rx={8} fill={CINZA_MEDIO} {...traco} />
      <path d="M18 92 L16 102 M102 92 L104 102" stroke={T} strokeWidth={6} strokeLinecap="round" />
      <path d="M18 92 L16 102 M102 92 L104 102" stroke={MADEIRA} strokeWidth={2.6} strokeLinecap="round" />
      {/* almofada de coração */}
      <path d={coracao(40, 56, 11)} fill={ROSE} {...traco} transform="rotate(-12 40 56)" />
      <Faixa cx={60} cy={20} largura={70} texto="só mais 1 ep." fonte={14} />
    </g>
  ),
  poltrona: (
    <g>
      <rect x={30} y={22} width={60} height={50} rx={14} fill="#8e98a6" {...traco} />
      <rect x={30} y={64} width={60} height={22} rx={8} fill={CINZA_MEDIO} {...traco} />
      <rect x={20} y={48} width={16} height={40} rx={7} fill="#8e98a6" {...traco} />
      <rect x={84} y={48} width={16} height={40} rx={7} fill="#8e98a6" {...traco} />
      <rect x={20} y={88} width={80} height={8} rx={3} fill={MADEIRA} {...traco} />
      <path d="M26 96 L24 108 M94 96 L96 108" stroke={T} strokeWidth={6} strokeLinecap="round" />
      <path d="M26 96 L24 108 M94 96 L96 108" stroke={MADEIRA} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M44 34 Q60 28 76 34" fill="none" stroke={BRANCO} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <Brilho x={104} y={24} r={6} />
    </g>
  ),
  pufe: (
    <g>
      {[
        { cx: 44, top: 46, w: 26, h: 40 },
        { cx: 84, top: 60, w: 21, h: 32 },
      ].map(({ cx, top, w, h }) => (
        <g key={cx}>
          <path d={`M${cx - w} ${top} V${top + h} Q${cx} ${top + h + 12} ${cx + w} ${top + h} V${top} Z`} fill={CINZA_MEDIO} {...traco} />
          <ellipse cx={cx} cy={top} rx={w} ry={9} fill={CINZA} {...traco} />
          <path d={`M${cx - w + 6} ${top + h + 3} L${cx - w + 3} ${top + h + 16} M${cx + w - 6} ${top + h + 3} L${cx + w - 3} ${top + h + 16}`} stroke={T} strokeWidth={6} strokeLinecap="round" />
          <path d={`M${cx - w + 6} ${top + h + 3} L${cx - w + 3} ${top + h + 16} M${cx + w - 6} ${top + h + 3} L${cx + w - 3} ${top + h + 16}`} stroke={MADEIRA} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      ))}
<Brilho x={104} y={34} r={6} />
    </g>
  ),
  mesa: (
    <g>
      {/* balde de pipoca */}
      <path d="M44 22 H76 L72 52 H48 Z" fill={BRANCO} {...traco} />
      <path d="M52 22 L54 52 M60 22 V52 M68 22 L66 52" stroke={ROSE_ESCURO} strokeWidth={4} />
      <path d="M44 22 H76 L72 52 H48 Z" fill="none" {...traco} />
      {[48, 56, 64, 72, 52, 60, 68].map((x, i) => (
        <circle key={i} cx={x} cy={i < 4 ? 20 : 13} r={5} fill={CREME} {...fino} />
      ))}
      <rect x={10} y={54} width={100} height={12} rx={5} fill={MADEIRA} {...traco} />
      <path d="M18 60 H102" stroke={MADEIRA_ESCURA} strokeWidth={1.4} opacity={0.6} />
      <path d="M22 66 L46 104 M46 66 L22 104 M74 66 L98 104 M98 66 L74 104" stroke={T} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M18 104 H50 M70 104 H102" stroke={T} strokeWidth={4.4} strokeLinecap="round" />
      <Brilho x={100} y={26} r={6} />
    </g>
  ),
  planta: (
    <g>
      <path d="M60 80 Q58 60 46 46 M60 80 Q62 56 78 40 M60 80 Q60 54 62 30" fill="none" stroke={SALVIA_ESCURA} strokeWidth={3.4} strokeLinecap="round" />
      {[
        { x: 40, y: 44, r: -30, s: 1 },
        { x: 82, y: 38, r: 30, s: 1 },
        { x: 62, y: 24, r: 0, s: 1.05 },
      ].map(({ x, y, r, s }) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          {/* folha de costela-de-adão com os recortes */}
          <path
            d="M0 20 C-22 14 -26 -8 -12 -18 C-4 -24 4 -24 12 -18 C26 -8 22 14 0 20 Z"
            fill={SALVIA}
            {...traco}
          />
          <path d="M-20 -2 L-9 0 M-17 -12 L-7 -6 M20 -2 L9 0 M17 -12 L7 -6 M-14 10 L-5 6 M14 10 L5 6" stroke={T} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M0 18 V-18" stroke={SALVIA_ESCURA} strokeWidth={2} />
        </g>
      ))}
      <path d="M38 80 H82 L78 108 Q60 114 42 108 Z" fill="#e8dccb" {...traco} />
      <path d="M38 80 H82 V86 H38 Z" fill="#d6c6ae" {...traco} />
      <Brilho x={102} y={70} r={6} />
    </g>
  ),
  ferro: (
    <g>
      {/* tábua de passar */}
      <path d="M8 84 H104 Q114 84 114 90 Q114 96 104 96 H8 Z" fill={BRANCO} {...traco} />
      <path d="M30 96 L52 112 M84 96 L62 112" stroke={MADEIRA_ESCURA} strokeWidth={4} strokeLinecap="round" />
      {/* ferro */}
      <path d="M20 80 Q24 48 60 44 H92 Q100 44 100 54 V80 Z" fill={ROSE} {...traco} />
      <path d="M18 80 H102" stroke={T} strokeWidth={5} strokeLinecap="round" />
      <path d="M18 80 H102" stroke={CINZA} strokeWidth={2} strokeLinecap="round" />
      <path d="M52 44 Q52 28 66 28 H92 Q98 28 98 34 V44" fill="none" {...traco} strokeWidth={5} />
      <path d="M52 44 Q52 28 66 28 H92 Q98 28 98 34 V44" fill="none" stroke={ROSE_ESCURO} strokeWidth={2} />
      <circle cx={78} cy={62} r={6} fill={CREME} {...fino} />
      <Vapor x={30} y={74} alt={14} />
      <Vapor x={40} y={66} alt={12} />
      <Brilho x={14} y={24} r={6} />
    </g>
  ),
  banqueta: (
    <g>
      {[
        { x: 40, y: 24, s: 1 },
        { x: 80, y: 36, s: 0.85 },
      ].map(({ x, y, s }) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M-24 6 Q-24 -10 0 -10 Q24 -10 24 6 Q12 12 0 12 Q-12 12 -24 6 Z" fill={ESCURO} {...traco} />
          <Reflexo d="M-14 -3 Q-6 -6 4 -6" />
          {/* pés de madeira estilo Eiffel */}
          <path d="M-16 10 L-22 82 M16 10 L22 82 M-6 12 L-8 82 M6 12 L8 82" stroke={T} strokeWidth={6} strokeLinecap="round" />
          <path d="M-16 10 L-22 82 M16 10 L22 82 M-6 12 L-8 82 M6 12 L8 82" stroke={MADEIRA} strokeWidth={2.8} strokeLinecap="round" />
          <path d="M-18 46 L18 46 M-13 46 L13 66" stroke={T} strokeWidth={2.2} strokeLinecap="round" />
        </g>
      ))}
      <Brilho x={104} y={16} r={6} />
    </g>
  ),
  temperos: (
    <g>
      <ellipse cx={60} cy={102} rx={46} ry={8} fill={ESCURO} {...traco} />
      <path d="M60 102 V20" stroke={T} strokeWidth={4} />
      <circle cx={60} cy={18} r={5} fill={CINZA} {...fino} />
      {[
        { x: 34, c: ROSE_ESCURO, t: OURO },
        { x: 60, c: SALVIA, t: ROSE },
        { x: 86, c: OURO, t: SALVIA },
      ].map(({ x, c, t }) => (
        <g key={x}>
          <rect x={x - 11} y={58} width={22} height={38} rx={4} fill={AZUL} {...traco} />
          <rect x={x - 9} y={72} width={18} height={22} rx={2} fill={c} />
          <rect x={x - 11} y={58} width={22} height={38} rx={4} fill="none" {...traco} />
          <rect x={x - 12} y={50} width={24} height={9} rx={3} fill={t} {...traco} />
          <Reflexo d={`M${x - 6} 64 V70`} />
        </g>
      ))}
      <Faixa cx={60} cy={34} largura={50} texto="12 potes" fonte={13} />
    </g>
  ),
  ventilador: (
    <g>
      <circle cx={60} cy={44} r={36} fill={AZUL} {...traco} />
      {[0, 120, 240].map((a) => (
        <path key={a} d="M60 44 C52 26 64 14 74 22 C80 28 70 38 60 44 Z" fill={SALVIA} {...traco} strokeWidth={2.4} transform={`rotate(${a} 60 44)`} />
      ))}
      <circle cx={60} cy={44} r={36} fill="none" {...traco} />
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <path key={a} d="M60 9 V79" stroke={T} strokeWidth={1.2} opacity={0.35} transform={`rotate(${a} 60 44)`} />
      ))}
      <circle cx={60} cy={44} r={7} fill={OURO} {...traco} />
      <rect x={56} y={80} width={8} height={22} fill={CINZA} {...traco} />
      <ellipse cx={60} cy={106} rx={26} ry={6} fill={ESCURO} {...traco} />
      <path d="M100 30 H114 M102 44 H116 M100 58 H112" {...fino} strokeWidth={2.6} opacity={0.6} />
    </g>
  ),
  robo: (
    <g>
      <circle cx={60} cy={64} r={42} fill={ESCURO} {...traco} />
      <circle cx={60} cy={64} r={30} fill="none" stroke={CINZA_MEDIO} strokeWidth={2} />
      <path d="M26 82 A42 42 0 0 0 94 82" fill="none" stroke={T} strokeWidth={8} />
      <path d="M26 82 A42 42 0 0 0 94 82" fill="none" stroke={CINZA_MEDIO} strokeWidth={4} />
      <circle cx={50} cy={58} r={7} fill={BRANCO} {...fino} />
      <circle cx={70} cy={58} r={7} fill={BRANCO} {...fino} />
      <circle cx={51} cy={59} r={3} fill={T} />
      <circle cx={71} cy={59} r={3} fill={T} />
      <path d="M52 72 Q60 78 68 72" fill="none" stroke={BRANCO} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={60} cy={34} r={4} fill="#9fe0b5" {...fino} />
      {/* poeirinha fugindo */}
      <circle cx={104} cy={102} r={5} fill={CINZA} {...fino} />
      <circle cx={112} cy={92} r={3} fill={CINZA} {...fino} />
      <Brilho x={22} y={22} r={6} />
    </g>
  ),
  pote: (
    <g>
      <rect x={28} y={34} width={64} height={72} rx={12} fill={AZUL} {...traco} />
      <path d="M31 70 H89 V94 Q89 103 80 103 H40 Q31 103 31 94 Z" fill={OURO} />
      {[40, 52, 64, 76, 46, 58, 70, 82].map((x, i) => (
        <circle key={i} cx={x} cy={i < 4 ? 80 : 92} r={2} fill={OURO_ESCURO} />
      ))}
      <rect x={28} y={34} width={64} height={72} rx={12} fill="none" {...traco} />
      <rect x={24} y={22} width={72} height={16} rx={5} fill={MADEIRA} {...traco} />
      <path d="M30 30 H90" stroke={MADEIRA_ESCURA} strokeWidth={1.4} opacity={0.6} />
      <Reflexo d="M36 46 V62" />
      <rect x={46} y={50} width={28} height={14} rx={2} fill={BRANCO} {...fino} />
      <path d="M51 57 H69" stroke={T} strokeWidth={1.6} opacity={0.5} />
      <Brilho x={104} y={26} r={6} />
    </g>
  ),
  copo: (
    <g>
      {[
        { x: 42, a: -12 },
        { x: 78, a: 12 },
      ].map(({ x, a }) => (
        <g key={x} transform={`rotate(${a} ${x} 104)`}>
          <path d={`M${x - 18} 30 H${x + 18} L${x + 14} 104 H${x - 14} Z`} fill={AZUL} {...traco} />
          <path d={`M${x - 16.6} 56 H${x + 16.6} L${x + 14} 102 H${x - 14} Z`} fill={AGUA} />
          <path d={`M${x - 18} 30 H${x + 18} L${x + 14} 104 H${x - 14} Z`} fill="none" {...traco} />
          <Reflexo d={`M${x - 10} 38 L${x - 8} 70`} />
        </g>
      ))}
      <Brilho x={60} y={16} r={8} />
      <path d="M44 16 L38 10 M76 16 L82 10" {...fino} strokeWidth={2.6} />
      <Faixa cx={60} cy={104} largura={52} texto="1 + 1" />
    </g>
  ),
  caneca: (
    <g>
      {[
        { x: 38, c: ROSE, l: "dele" },
        { x: 82, c: BRANCO, l: "dela" },
      ].map(({ x, c }, i) => (
        <g key={x}>
          <path d={`M${x - 20} 48 H${x + 16} V${94} Q${x + 16} 104 ${x + 6} 104 H${x - 10} Q${x - 20} 104 ${x - 20} 94 Z`} fill={c} {...traco} />
          <path d={i === 0 ? `M${x - 20} 58 Q${x - 32} 58 ${x - 32} 72 Q${x - 32} 84 ${x - 20} 84` : `M${x + 16} 58 Q${x + 28} 58 ${x + 28} 72 Q${x + 28} 84 ${x + 16} 84`} fill="none" {...traco} strokeWidth={5} />
          <ellipse cx={x - 2} cy={48} rx={18} ry={4} fill={CAFE} {...traco} />
          <Vapor x={x - 6} y={38} alt={14} />
          <Vapor x={x + 4} y={38} alt={14} />
        </g>
      ))}
      <Coracaozinho x={38} y={76} s={7} cor={BRANCO} />
      <Coracaozinho x={82} y={76} s={7} cor={ROSE} />
    </g>
  ),
  talheres: (
    <g>
      {/* garfo */}
      <g transform="rotate(-14 34 60)">
        <path d="M24 12 V36 Q24 46 34 48 Q44 46 44 36 V12" fill="none" {...traco} />
        <path d="M30.5 12 V34 M37.5 12 V34" {...traco} />
        <rect x={29} y={46} width={10} height={60} rx={5} fill={CINZA} {...traco} />
      </g>
      {/* colher */}
      <g>
        <ellipse cx={60} cy={28} rx={13} ry={18} fill={CINZA} {...traco} />
        <Reflexo d="M54 18 Q52 28 56 36" />
        <rect x={55} y={44} width={10} height={64} rx={5} fill={CINZA} {...traco} />
      </g>
      {/* faca */}
      <g transform="rotate(14 86 60)">
        <path d="M80 10 Q96 22 92 56 H80 Z" fill={CINZA} {...traco} />
        <rect x={80} y={54} width={12} height={52} rx={5} fill={ESCURO} {...traco} />
      </g>
      <Brilho x={104} y={100} r={6} />
    </g>
  ),
  faca: (
    <g>
      {[
        { x: 44, a: -22 },
        { x: 56, a: -8 },
        { x: 68, a: 6 },
        { x: 80, a: 20 },
      ].map(({ x, a }) => (
        <rect key={x} x={x - 5} y={14} width={10} height={36} rx={4} fill={ESCURO} {...traco} transform={`rotate(${a} ${x} 60)`} />
      ))}
      <path d="M28 52 H92 L100 108 H20 Z" fill={MADEIRA} {...traco} />
      <path d="M34 62 H86 M30 80 H90 M26 98 H94" stroke={MADEIRA_ESCURA} strokeWidth={1.6} opacity={0.6} />
      {/* cenourinha */}
      <path d="M96 30 L112 56 L104 58 Z" fill="#f0a45b" {...traco} strokeWidth={2.4} />
      <path d="M96 30 L92 22 M96 30 L100 21 M96 30 L104 26" stroke={SALVIA_ESCURA} strokeWidth={3} strokeLinecap="round" />
      <Brilho x={14} y={30} r={6} />
    </g>
  ),
  pratos: (
    <g>
      {[96, 86, 76].map((y) => (
        <g key={y}>
          <ellipse cx={60} cy={y} rx={46} ry={11} fill={BRANCO} {...traco} />
        </g>
      ))}
      <ellipse cx={60} cy={66} rx={46} ry={13} fill={BRANCO} {...traco} />
      <ellipse cx={60} cy={65} rx={30} ry={7} fill="none" stroke={CINZA_MEDIO} strokeWidth={2} />
      {/* macarrão de domingo */}
      <path d="M44 62 Q50 50 58 60 Q64 50 70 60 Q76 52 78 62 Q66 70 54 68 Q46 68 44 62 Z" fill={OURO} {...traco} strokeWidth={2.4} />
      <circle cx={54} cy={60} r={3.4} fill={ROSE_ESCURO} {...fino} />
      <circle cx={68} cy={58} r={3} fill={ROSE_ESCURO} {...fino} />
      <path d="M60 52 q-4 -12 4 -20 M60 32 l-3 -8 M60 32 l3 -8" fill="none" stroke={CINZA_MEDIO} strokeWidth={3} strokeLinecap="round" />
      <Vapor x={42} y={46} alt={12} />
      <Vapor x={80} y={46} alt={12} />
      <Brilho x={104} y={30} r={6} />
    </g>
  ),
  panela: (
    <g>
      <path d="M22 54 H98 V92 Q98 106 84 106 H36 Q22 106 22 92 Z" fill={CINZA} {...traco} />
      <path d="M18 54 Q60 36 102 54 Z" fill={ESCURO} {...traco} />
      <path d="M22 70 H8 M98 70 H112" stroke={T} strokeWidth={8} strokeLinecap="round" />
      <path d="M22 70 H8 M98 70 H112" stroke={ESCURO} strokeWidth={4} strokeLinecap="round" />
      <rect x={54} y={36} width={12} height={10} rx={3} fill={ROSE_ESCURO} {...traco} />
      <Vapor x={56} y={30} alt={14} />
      <Vapor x={66} y={28} alt={16} />
      <Reflexo d="M32 64 V92" />
      <Faixa cx={60} cy={86} largura={50} texto="psssh!" fonte={14} />
    </g>
  ),
  cafeteira: (
    <g>
      <path d="M20 14 H80 V30 H72 V96 H80 V108 H20 Z" fill={ESCURO} {...traco} />
      <rect x={22} y={36} width={6} height={56} fill={VIDRO} />
      <path d="M32 46 H70 L66 60 Q70 64 70 74 V92 Q70 98 64 98 H38 Q32 98 32 92 Z" fill={AZUL} {...traco} />
      <path d="M33.6 70 H68.4 V92 Q68.4 96.4 64 96.4 H38 Q33.6 96.4 33.6 92 Z" fill={CAFE} />
      <path d="M32 46 H70 L66 60 Q70 64 70 74 V92 Q70 98 64 98 H38 Q32 98 32 92 Z" fill="none" {...traco} />
      <path d="M70 66 Q80 66 80 76 Q80 86 70 86" fill="none" {...traco} strokeWidth={4.4} />
      <circle cx={30} cy={24} r={3.5} fill="#9fe0b5" {...fino} />
      <Vapor x={92} y={52} alt={16} />
      <Vapor x={102} y={58} alt={14} />
      <Brilho x={100} y={20} r={6} />
    </g>
  ),
  liquidificador: (
    <g>
      <path d="M34 20 H86 L78 80 H42 Z" fill={AZUL} {...traco} />
      <path d="M38.6 46 H81.4 L77.6 78.4 H42.4 Z" fill={ROSE} />
      <path d="M34 20 H86 L78 80 H42 Z" fill="none" {...traco} />
      <path d="M86 30 Q100 30 100 44 Q100 58 84 60" fill="none" {...traco} strokeWidth={4.4} />
      <rect x={32} y={12} width={56} height={10} rx={4} fill={ESCURO} {...traco} />
      <path d="M52 72 L68 68 M52 68 L68 72" {...fino} strokeWidth={2.6} />
      <path d="M38 80 H82 L88 108 H32 Z" fill={ESCURO} {...traco} />
      <circle cx={60} cy={95} r={6} fill={CINZA} {...traco} />
      <Reflexo d="M42 28 L46 58" />
      {[52, 62, 70].map((x, i) => (
        <circle key={x} cx={x} cy={56 + i * 4} r={2.4} fill={ROSE_ESCURO} />
      ))}
      <Brilho x={104} y={16} r={6} />
    </g>
  ),
  batedeira: (
    <g>
      {/* tigela com massa */}
      <path d="M14 72 H106 Q104 108 60 108 Q16 108 14 72 Z" fill={BRANCO} {...traco} />
      <path d="M18 72 Q40 64 60 72 Q80 64 102 72" fill={ROSE} {...traco} strokeWidth={2.4} />
      {/* batedeira */}
      <path d="M32 20 Q32 8 46 8 H88 Q100 8 100 20 V30 Q100 40 88 40 H44 Q32 40 32 30 Z" fill={ESCURO} {...traco} />
      <path d="M58 40 Q60 28 76 28 H92" fill="none" stroke={CINZA} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <path d="M52 40 V70 M68 40 V70" stroke={T} strokeWidth={4} strokeLinecap="round" />
      <path d="M46 56 Q52 74 58 56 M62 56 Q68 74 74 56" fill="none" stroke={CINZA_MEDIO} strokeWidth={3} strokeLinecap="round" />
      <circle cx={92} cy={24} r={4} fill={ROSE} {...fino} />
      <circle cx={18} cy={60} r={3.4} fill={ROSE} {...fino} />
      <circle cx={104} cy={56} r={2.6} fill={ROSE} {...fino} />
    </g>
  ),
  sanduicheira: (
    <g>
      <rect x={14} y={70} width={92} height={28} rx={10} fill={ESCURO} {...traco} />
      {/* sanduíche aparecendo */}
      <path d="M20 66 H100 V74 H20 Z" fill={OURO} {...traco} strokeWidth={2.4} />
      <path d="M30 74 Q34 84 38 74 M70 74 Q74 86 78 74" fill="#f6d58a" {...traco} strokeWidth={2} />
      <path d="M14 66 Q14 38 60 38 Q106 38 106 66 Z" fill={ESCURO} {...traco} />
      <rect x={50} y={30} width={20} height={10} rx={4} fill={CINZA} {...traco} />
      <Reflexo d="M28 56 Q40 46 56 44" />
      <circle cx={92} cy={86} r={3} fill="#f0a45b" />
      <Vapor x={40} y={28} alt={12} />
      <Vapor x={80} y={28} alt={12} />
      <Brilho x={104} y={22} r={6} />
    </g>
  ),
  tabua: (
    <g>
      <path d="M14 40 Q14 30 24 30 H88 Q96 30 98 22 Q100 14 108 16 Q116 18 112 28 Q108 36 108 44 V98 Q108 108 98 108 H24 Q14 108 14 98 Z" fill={MADEIRA} {...traco} />
      <circle cx={106} cy={24} r={3.5} fill={BRANCO} {...fino} />
      <path d="M24 50 H96 M24 72 H96 M24 92 H96" stroke={MADEIRA_ESCURA} strokeWidth={1.4} opacity={0.5} />
      {/* cebola chorando */}
      <path d="M60 46 Q82 50 82 72 Q82 92 60 94 Q38 92 38 72 Q38 50 60 46 Z" fill="#e3c3dc" {...traco} />
      <path d="M60 46 Q50 66 52 92 M60 46 Q70 66 68 92" fill="none" stroke={T} strokeWidth={1.6} opacity={0.5} />
      <path d="M60 46 L56 36 M60 46 L64 36" stroke={SALVIA_ESCURA} strokeWidth={3} strokeLinecap="round" />
      <circle cx={53} cy={72} r={2.4} fill={T} />
      <circle cx={67} cy={72} r={2.4} fill={T} />
      <path d="M55 82 Q60 78 65 82" fill="none" {...fino} />
      <path d="M50 77 q-2 4 0 6 q2 -2 0 -6 Z" fill={AGUA} {...fino} strokeWidth={1.4} />
      <path d="M70 77 q-2 4 0 6 q2 -2 0 -6 Z" fill={AGUA} {...fino} strokeWidth={1.4} />
    </g>
  ),
  batata: (
    <g>
      <path d="M22 64 Q20 34 54 30 Q92 26 100 56 Q106 86 72 96 Q30 102 22 64 Z" fill="#d9a86c" {...traco} />
      {[
        [38, 48],
        [84, 50],
        [72, 84],
        [40, 82],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill={MADEIRA_ESCURA} />
      ))}
      <Olhos x={60} y={60} d={18} />
      <circle cx={46} cy={70} r={4} fill={ROSE} opacity={0.8} />
      <circle cx={76} cy={70} r={4} fill={ROSE} opacity={0.8} />
      {/* descascador */}
      <g transform="rotate(30 100 92)">
        <rect x={94} y={80} width={12} height={30} rx={5} fill={ESCURO} {...traco} />
        <path d="M92 80 H108 V66 Q100 58 92 66 Z" fill={CINZA} {...traco} />
      </g>
      <path d="M14 98 Q22 92 30 100 Q24 106 14 98 Z" fill="#e8c48f" {...fino} />
      <Faixa cx={60} cy={16} largura={56} texto="a única" fonte={14} />
    </g>
  ),
  abridor: (
    <g>
      {/* lata */}
      <path d="M58 40 H100 V100 Q100 108 79 108 Q58 108 58 100 Z" fill={ROSE} {...traco} />
      <ellipse cx={79} cy={40} rx={21} ry={6} fill={CINZA} {...traco} />
      <path d="M58 56 H100 M58 92 H100" stroke={T} strokeWidth={1.6} opacity={0.5} />
      <Coracaozinho x={79} y={72} s={8} cor={BRANCO} />
      {/* abridor */}
      <g transform="rotate(-35 40 56)">
        <path d="M30 10 Q30 2 40 2 Q50 2 50 10 V34 Q50 40 44 42 V96 Q44 102 40 102 Q36 102 36 96 V42 Q30 40 30 34 Z" fill={CINZA} {...traco} />
        <circle cx={40} cy={18} r={5} fill={BRANCO} {...fino} />
      </g>
      <Brilho x={104} y={22} r={6} />
    </g>
  ),
  pano: (
    <g>
      <path d="M22 16 H98 V30 Q98 34 94 34 H26 Q22 34 22 30 Z" fill={MADEIRA} {...traco} />
      <path d="M30 30 H90 L94 104 Q60 112 26 104 Z" fill={BRANCO} {...traco} />
      <path d="M28.6 56 H91.4 M28 64 H92 M27 86 H93" stroke={ROSE_ESCURO} strokeWidth={3} />
      <path d="M30 30 H90 L94 104 Q60 112 26 104 Z" fill="none" {...traco} />
      <path d="M60 34 Q56 70 60 106" fill="none" stroke={CINZA_MEDIO} strokeWidth={2} opacity={0.7} />
      <Coracaozinho x={44} y={74} s={6} />
      <Faixa cx={60} cy={24} largura={46} texto="cadê?" fonte={13} />
    </g>
  ),
  toalha: (
    <g>
      {[
        { y: 82, c: CINZA_MEDIO },
        { y: 64, c: BRANCO },
        { y: 46, c: ROSE },
      ].map(({ y, c }) => (
        <g key={y}>
          <rect x={20} y={y} width={80} height={20} rx={8} fill={c} {...traco} />
          <path d={`M26 ${y + 14} H94`} stroke={T} strokeWidth={1.4} opacity={0.35} />
        </g>
      ))}
      {/* sabonete com bolhas */}
      <rect x={42} y={28} width={36} height={18} rx={8} fill={SALVIA} {...traco} />
      <Reflexo d="M48 34 H60" />
      {[
        [40, 20, 5],
        [52, 14, 3.4],
        [80, 18, 4.4],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={BRANCO} {...fino} />
      ))}
      <Brilho x={104} y={34} r={6} />
    </g>
  ),
  lixeira: (
    <g>
      <path d="M30 40 H90 L84 104 Q84 108 80 108 H40 Q36 108 36 104 Z" fill={CINZA} {...traco} />
      <path d="M48 52 L50 96 M60 52 V96 M72 52 L70 96" stroke={T} strokeWidth={1.6} opacity={0.4} />
      <path d="M26 38 Q26 24 60 24 Q94 24 94 38 Z" fill={MADEIRA} {...traco} />
      <path d="M40 104 L30 110 H22" {...traco} strokeWidth={4} />
      {/* bolinha de papel errando o alvo */}
      <circle cx={100} cy={20} r={8} fill={BRANCO} {...traco} strokeWidth={2.4} />
      <path d="M95 18 L101 22 L104 16" {...fino} strokeWidth={1.4} />
      <path d="M86 12 Q80 8 74 12" fill="none" stroke={T} strokeWidth={2} strokeDasharray="3 4" strokeLinecap="round" />
      <Reflexo d="M40 50 L42 90" />
    </g>
  ),
  cesto: (
    <g>
      <path d="M22 40 H98 L90 106 H30 Z" fill={CINZA} {...traco} />
      {[54, 70, 86].map((y) => (
        <path key={y} d={`M${22 + (y - 40) * 0.12} ${y} H${98 - (y - 40) * 0.12}`} stroke={T} strokeWidth={1.6} opacity={0.4} />
      ))}
      {[40, 52, 64, 76].map((x) => (
        <path key={x} d={`M${x} 42 L${x + (x - 60) * -0.05} 104`} stroke={T} strokeWidth={1.4} opacity={0.3} />
      ))}
      {/* meia pendurada pra fora */}
      <path d="M70 40 L74 62 L86 66 Q92 68 90 74 Q88 78 82 76 L66 70 L62 40 Z" fill={ROSE} {...traco} />
      <path d="M62 46 H72" stroke={BRANCO} strokeWidth={3} />
      <path d="M18 40 Q20 26 60 26 Q100 26 102 40 Z" fill={MADEIRA} {...traco} transform="rotate(-10 60 40)" />
      <Brilho x={16} y={70} r={6} />
    </g>
  ),
  varal: (
    <g>
      <path d="M6 30 Q60 48 114 30" fill="none" stroke={T} strokeWidth={2.6} />
      {/* camiseta */}
      <path d="M24 38 L36 34 Q42 40 48 34 L60 40 L56 52 L50 50 V88 H30 V50 L24 52 L20 42 Z" fill={SALVIA} {...traco} />
      {/* meia */}
      <path d="M72 41 H86 V70 L96 76 Q100 80 96 84 Q92 88 86 84 L72 76 Z" fill={ROSE} {...traco} />
      <path d="M72 46 H86" stroke={BRANCO} strokeWidth={3} />
      {/* prendedores */}
      {[
        [30, 34],
        [46, 37],
        [79, 40],
      ].map(([x, y]) => (
        <rect key={x} x={x - 2.5} y={y - 8} width={5} height={14} rx={1.5} fill={MADEIRA} {...fino} />
      ))}
      <Brilho x={104} y={70} r={6} />
      <Brilho x={60} y={100} r={4.5} />
    </g>
  ),
  balde: (
    <g>
      <path d="M88 8 L64 66" stroke={T} strokeWidth={7} strokeLinecap="round" />
      <path d="M88 8 L64 66" stroke={MADEIRA} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M24 50 H96 L88 106 Q88 110 84 110 H36 Q32 110 32 106 Z" fill={SALVIA} {...traco} />
      <ellipse cx={60} cy={50} rx={36} ry={8} fill={AGUA} {...traco} />
      {/* esfregão do mop */}
      <path d="M50 52 Q56 40 66 44 Q76 46 74 54" fill={CINZA} {...traco} strokeWidth={2.4} />
      <path d="M40 66 H80" stroke={T} strokeWidth={1.6} opacity={0.4} />
      {[
        [24, 34, 5],
        [100, 40, 4],
        [36, 22, 3],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={BRANCO} {...fino} />
      ))}
      <Brilho x={16} y={70} r={6} />
    </g>
  ),
  cama: (
    <g>
      <rect x={14} y={34} width={92} height={44} rx={8} fill={ESCURO} {...traco} />
      <rect x={10} y={66} width={100} height={22} rx={6} fill={BRANCO} {...traco} />
      <rect x={10} y={86} width={100} height={14} rx={4} fill={CINZA_MEDIO} {...traco} />
      <rect x={24} y={52} width={30} height={16} rx={7} fill={BRANCO} {...traco} />
      <rect x={66} y={52} width={30} height={16} rx={7} fill={BRANCO} {...traco} />
      <path d="M50 72 Q80 64 108 74 V86 H50 Z" fill={ROSE} {...traco} strokeWidth={2.6} />
      <path d="M16 100 V108 M104 100 V108" {...traco} strokeWidth={4} />
      <text x={86} y={30} fontFamily="'Caveat Variable', 'Caveat', cursive" fontWeight={700} fontSize={22} fill={T}>
        zzz
      </text>
      <Brilho x={18} y={18} r={6} />
    </g>
  ),
  travesseiro: (
    <g>
      <path d="M16 40 Q14 26 30 28 Q60 20 90 28 Q106 26 104 40 Q110 64 104 84 Q106 98 90 94 Q60 102 30 94 Q14 98 16 84 Q10 64 16 40 Z" fill={BRANCO} {...traco} />
      <path d="M24 40 Q60 32 96 40 Q100 62 96 84 Q60 92 24 84 Q20 62 24 40 Z" fill="none" stroke={T} strokeWidth={1.6} strokeDasharray="3 4" opacity={0.45} />
      {/* carinha dormindo */}
      <path d="M44 60 Q48 64 52 60 M68 60 Q72 64 76 60" fill="none" {...fino} strokeWidth={2.4} />
      <path d="M56 72 Q60 75 64 72" fill="none" {...fino} />
      <circle cx={42} cy={70} r={4} fill={ROSE} opacity={0.7} />
      <circle cx={78} cy={70} r={4} fill={ROSE} opacity={0.7} />
      <Brilho x={104} y={18} r={6} />
      <Brilho x={16} y={106} r={4.5} />
    </g>
  ),
  cobertor: (
    <g>
      <rect x={18} y={64} width={84} height={22} rx={8} fill="#22395a" {...traco} />
      <rect x={14} y={46} width={92} height={22} rx={8} fill="#2e4a73" {...traco} />
      <rect x={20} y={28} width={80} height={22} rx={8} fill="#22395a" {...traco} />
      {[34, 52, 70, 88].map((x, i) => (
        <g key={x} fill={BRANCO} opacity={0.6}>
          <circle cx={x} cy={38} r={1.6} />
          <circle cx={x + 8} cy={56 + (i % 2)} r={1.6} />
          <circle cx={x - 4} cy={74} r={1.6} />
        </g>
      ))}
      <Coracaozinho x={60} y={40} s={7} />
      <Faixa cx={60} cy={100} largura={58} texto="é meu!" />
      <Brilho x={108} y={20} r={6} />
    </g>
  ),
  guardaroupa: (
    <g>
      <rect x={16} y={12} width={88} height={96} rx={5} fill={BRANCO} {...traco} />
      <path d="M38 12 V108 M60 12 V108 M82 12 V108" {...traco} strokeWidth={2.4} />
      {[34, 42, 78, 86].map((x) => (
        <rect key={x} x={x - 1.5} y={52} width={3} height={14} rx={1.5} fill={OURO} {...fino} strokeWidth={1.4} />
      ))}
      <path d="M16 96 H104" stroke={T} strokeWidth={1.6} opacity={0.5} />
      <path d="M20 108 V114 M100 108 V114" {...traco} strokeWidth={4} />
      <Faixa cx={60} cy={30} largura={58} texto="6 × 2" fonte={16} />
    </g>
  ),
  lua: (
    <g>
      <path d="M70 12 A44 44 0 1 0 104 82 A36 36 0 1 1 70 12 Z" fill={OURO} {...traco} />
      <path d="M40 54 Q44 58 48 54" fill="none" {...fino} strokeWidth={2.4} />
      <path d="M44 70 Q48 73 52 70" fill="none" {...fino} />
      <circle cx={36} cy={64} r={4} fill={ROSE} opacity={0.8} />
      <Brilho x={92} y={26} r={7} />
      <Brilho x={106} y={50} r={4.5} />
      <Brilho x={78} y={102} r={5} />
      <text x={76} y={64} fontFamily="'Caveat Variable', 'Caveat', cursive" fontWeight={700} fontSize={18} fill={T}>
        zz
      </text>
    </g>
  ),
  patinha: (
    <g>
      <path d="M60 58 Q82 58 88 80 Q92 98 76 100 Q66 100 60 96 Q54 100 44 100 Q28 98 32 80 Q38 58 60 58 Z" fill={ROSE} {...traco} />
      {[
        [30, 48, -20],
        [48, 30, -6],
        [72, 30, 6],
        [90, 48, 20],
      ].map(([x, y, a]) => (
        <ellipse key={x} cx={x} cy={y} rx={10} ry={13} fill={ROSE} {...traco} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <Coracaozinho x={60} y={78} s={8} cor={BRANCO} />
      <Brilho x={104} y={18} r={6} />
      <Brilho x={14} y={84} r={4.5} />
    </g>
  ),
  jantar: (
    <g>
      <ellipse cx={60} cy={92} rx={50} ry={10} fill={BRANCO} {...traco} />
      <path d="M18 88 Q18 40 60 40 Q102 40 102 88 Z" fill={CINZA} {...traco} />
      <circle cx={60} cy={34} r={6} fill={CINZA_MEDIO} {...traco} />
      <Reflexo d="M30 78 Q30 58 46 50" />
      <Coracaozinho x={60} y={66} s={8} />
      <Vapor x={30} y={30} alt={14} />
      <Vapor x={90} y={30} alt={14} />
      <Faixa cx={60} cy={110} largura={60} texto="sem louça" fonte={13} />
    </g>
  ),
  camera: (
    <g>
      <path d="M24 26 Q12 34 18 48 M96 26 Q108 34 102 48" fill="none" stroke={ROSE_ESCURO} strokeWidth={4} strokeLinecap="round" />
      <rect x={12} y={40} width={96} height={62} rx={10} fill={ESCURO} {...traco} />
      <path d="M40 40 L46 28 H74 L80 40 Z" fill={ESCURO} {...traco} />
      <circle cx={60} cy={70} r={24} fill={CINZA} {...traco} />
      <circle cx={60} cy={70} r={16} fill={VIDRO} {...traco} />
      <circle cx={54} cy={64} r={4} fill={BRANCO} opacity={0.9} />
      <rect x={90} y={48} width={10} height={7} rx={2} fill={OURO} {...fino} />
      <rect x={18} y={50} width={14} height={6} rx={3} fill={ROSE} {...fino} />
      <Brilho x={104} y={18} r={6} />
    </g>
  ),
  aviao: (
    <g>
      <path d="M8 96 Q30 90 40 76" fill="none" stroke={T} strokeWidth={2.4} strokeDasharray="4 6" strokeLinecap="round" />
      <g transform="rotate(-24 64 58)">
        <path d="M20 58 Q20 48 34 48 H96 Q112 48 112 58 Q112 68 96 68 H34 Q20 68 20 58 Z" fill={BRANCO} {...traco} />
        <path d="M58 48 L44 22 H54 L76 48 Z" fill={ROSE} {...traco} />
        <path d="M58 68 L44 94 H54 L76 68 Z" fill={ROSE} {...traco} />
        <path d="M24 52 L18 36 H26 L34 48 Z" fill={ROSE_ESCURO} {...traco} />
        {[66, 76, 86].map((x) => (
          <circle key={x} cx={x} cy={56} r={3} fill={AGUA} {...fino} />
        ))}
        <path d="M100 52 Q106 54 106 58" fill="none" stroke={T} strokeWidth={2} />
      </g>
      <Coracaozinho x={98} y={94} s={8} />
      <Brilho x={20} y={20} r={6} />
    </g>
  ),
  carrinho: (
    <g>
      <path d="M6 24 H20 L34 82 H92" fill="none" {...traco} strokeWidth={4} />
      {/* compras saindo do carrinho */}
      <path d="M44 38 L52 8 L60 12 L54 40 Z" fill={OURO} {...traco} strokeWidth={2.4} />
      <circle cx={70} cy={34} r={9} fill={ROSE_ESCURO} {...traco} strokeWidth={2.4} />
      <path d="M70 25 Q72 18 78 18" fill="none" stroke={SALVIA_ESCURA} strokeWidth={2.6} strokeLinecap="round" />
      <Folha x={82} y={36} ang={-60} tam={10} />
      <Folha x={86} y={38} ang={-100} tam={9} />
      <path d="M24 40 H104 L96 74 H32 Z" fill={CINZA} {...traco} />
      {[50, 64, 78].map((x) => (
        <path key={x} d={`M${x} 40 V74`} stroke={T} strokeWidth={1.6} opacity={0.5} />
      ))}
      <path d="M27 57 H100" stroke={T} strokeWidth={1.6} opacity={0.5} />
      <circle cx={40} cy={96} r={8} fill={ESCURO} {...traco} />
      <circle cx={84} cy={96} r={8} fill={ESCURO} {...traco} />
      <Brilho x={108} y={18} r={6} />
    </g>
  ),
  sacola: (
    <g>
      <path d="M28 40 H92 L98 108 H22 Z" fill="#e3c39a" {...traco} />
      <path d="M28 40 L22 52 H98 L92 40" fill="#d6b080" {...traco} />
      <path d="M44 40 Q44 22 60 22 Q76 22 76 40" fill="none" {...traco} strokeWidth={4} />
      <Coracaozinho x={60} y={78} s={11} />
      <Vapor x={34} y={30} alt={14} />
      <Vapor x={86} y={30} alt={14} />
      <Brilho x={108} y={56} r={6} />
    </g>
  ),
  pizza: (
    <g>
      <path d="M60 110 L18 28 Q60 8 102 28 Z" fill="#f6d58a" {...traco} />
      <path d="M16 26 Q60 2 104 26 Q106 34 100 36 Q60 16 20 36 Q14 34 16 26 Z" fill={OURO_ESCURO} {...traco} />
      {[
        [48, 48, 7],
        [72, 50, 6],
        [60, 74, 6],
        [52, 92, 4],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={ROSE_ESCURO} {...fino} />
      ))}
      <path d="M36 44 Q34 56 38 60 Q42 54 40 44 Z" fill="#f6d58a" {...fino} />
      <Folha x={80} y={70} ang={110} tam={7} />
      <Coracaozinho x={98} y={92} s={8} />
    </g>
  ),
  chapeu: (
    <g>
      <path d="M30 70 Q14 66 16 48 Q18 30 36 32 Q38 14 60 14 Q82 14 84 32 Q102 30 104 48 Q106 66 90 70 Z" fill={BRANCO} {...traco} />
      <path d="M44 52 Q46 62 44 70 M60 46 V70 M76 52 Q74 62 76 70" fill="none" stroke={T} strokeWidth={1.8} opacity={0.4} />
      <rect x={30} y={68} width={60} height={20} rx={4} fill={BRANCO} {...traco} />
      <path d="M30 78 H90" stroke={ROSE} strokeWidth={4} />
      <rect x={30} y={68} width={60} height={20} rx={4} fill="none" {...traco} />
      {/* colher de pau */}
      <g transform="rotate(30 96 96)">
        <ellipse cx={96} cy={80} rx={7} ry={10} fill={MADEIRA} {...traco} />
        <rect x={93} y={88} width={6} height={28} rx={3} fill={MADEIRA} {...traco} />
      </g>
      <Faixa cx={52} cy={104} largura={56} texto="aprendiz" fonte={13} />
    </g>
  ),
  chaveinglesa: (
    <g>
      {/* chuveiro queimando, era questão de tempo */}
      <path d="M14 12 H58 Q68 12 68 22 V30" fill="none" {...traco} strokeWidth={7} />
      <path d="M14 12 H58 Q68 12 68 22 V30" fill="none" stroke={CINZA} strokeWidth={3} />
      <path d="M40 30 H96 Q96 54 68 54 Q40 54 40 30 Z" fill={CINZA} {...traco} />
      <path d="M46 36 H90" stroke={T} strokeWidth={1.6} opacity={0.4} />
      {[52, 62, 72, 82].map((x) => (
        <circle key={x} cx={x} cy={44} r={1.8} fill={T} opacity={0.6} />
      ))}
      {[50, 60, 70, 80, 88].map((x, i) => (
        <path key={x} d={`M${x} 62 l-3 ${10 + (i % 2) * 6}`} stroke={AGUA} strokeWidth={3.4} strokeLinecap="round" />
      ))}
      <path d="M26 46 L14 74 H28 L18 104 L46 64 H32 L42 46 Z" fill={OURO} {...traco} />
      <path d="M90 84 Q100 76 108 84 M94 92 Q100 88 104 92" fill="none" {...fino} opacity={0.6} />
      <Faixa cx={68} cy={104} largura={50} texto="já era" fonte={15} />
    </g>
  ),
};

/** Ids de sticker válidos para presentes: os desenhados aqui e alguns do mural. */
const DO_MURAL = ["bolo", "zoe", "presente"] as const;

export function ehStickerPresente(id: unknown): id is string {
  return typeof id === "string" && (id in desenhos || (DO_MURAL as readonly string[]).includes(id));
}

/** Sticker de presente com a mesma borda branca de adesivo e sombra dos stickers do mural. */
export function StickerPresente({ id, className, titulo }: { id: string; className?: string; titulo?: string }) {
  const desenho = desenhos[id] ?? desenhosMural[id];
  if (!desenho) return null;
  const filtro = `sticker-presente-corte-${id}`;
  return (
    <svg viewBox="-8 -8 136 136" className={className} role="img" aria-label={titulo ? `Sticker: ${titulo}` : "Sticker"}>
      <defs>
        <filter id={filtro} x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="borda" />
          <feGaussianBlur in="borda" stdDeviation="2.4" result="desfoque" />
          <feOffset in="desfoque" dy="3" result="queda" />
          <feFlood floodColor={T} floodOpacity="0.28" />
          <feComposite in2="queda" operator="in" result="sombra" />
          <feFlood floodColor={BRANCO} />
          <feComposite in2="borda" operator="in" result="papel" />
          <feMerge>
            <feMergeNode in="sombra" />
            <feMergeNode in="papel" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${filtro})`}>{desenho}</g>
    </svg>
  );
}

/** Lista para a galeria de conferência (não aparece no site). */
export const IDS_STICKERS_PRESENTES = [...Object.keys(desenhos), ...DO_MURAL];

