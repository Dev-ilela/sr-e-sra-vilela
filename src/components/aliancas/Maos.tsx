import { forwardRef, useId } from "react";
import { PELE, PELE_SOMBRA, ROSE, T, traco } from "@/components/mural/Stickers";

/**
 * Cena das mãos: uma mão (à esquerda, palma para baixo) recebe a aliança no anelar;
 * a outra (à direita) chega segurando a aliança entre o indicador e o polegar.
 * A segunda cena é a mesma, espelhada: quem recebe vira quem dá.
 *
 * Os grupos `dando` e `anel` começam deslocados e são animados de fora (Cerimonia).
 */

const MARINHO = "#1d3150";
const CAMISA = "#f7f4ef";
const VESTIDO = "#fbf7f4";

export type QuemRecebe = "ela" | "ele";

/** Quanto a mão que dá começa afastada, com a aliança na ponta do dedo. */
export const DESLOCAMENTO_INICIAL = 88;

type Refs = { dando: React.Ref<SVGGElement>; anel: React.Ref<SVGGElement> };

function Manga({ x, larg, cor, renda }: { x: number; larg: number; cor: string; renda: boolean }) {
  return (
    <g>
      <rect x={x} y={64} width={larg} height={96} rx={10} fill={cor} {...traco} />
      {renda ? (
        // Punho do vestido: rendinha rose
        <path d={`M${x + larg - 6} 66 q5 6 0 12 q5 6 0 12 q5 6 0 12 q5 6 0 12 q5 6 0 12 q5 6 0 12 q5 6 0 12 q5 6 0 10`} fill="none" stroke={ROSE} strokeWidth={3} />
      ) : (
        // Punho do terno: camisa branca aparecendo e uma abotoadura
        <>
          <rect x={x + larg - 14} y={68} width={12} height={88} rx={4} fill={CAMISA} {...traco} strokeWidth={2} />
          <circle cx={x + larg - 8} cy={112} r={3} fill="#e0c06a" stroke={T} strokeWidth={1.2} />
        </>
      )}
    </g>
  );
}

/** Mão que recebe: vinda da esquerda, palma para baixo, dedos para a direita. */
function MaoRecebe({ quem }: { quem: QuemRecebe }) {
  const dedos = [
    { y: 74, h: 18, fim: 228 },
    { y: 94, h: 18, fim: 242 },
    { y: 114, h: 17, fim: 234 },
    { y: 133, h: 15, fim: 214 },
  ];
  return (
    <g>
      <g transform="rotate(32 120 148)">
        <rect x={104} y={140} width={58} height={17} rx={8.5} fill={PELE} {...traco} />
      </g>
      {dedos.map((d) => (
        <rect key={d.y} x={130} y={d.y} width={d.fim - 130} height={d.h} rx={d.h / 2} fill={PELE} {...traco} />
      ))}
      {/* unhas */}
      {dedos.map((d) => (
        <path key={`u${d.y}`} d={`M${d.fim - 11} ${d.y + 4} q7 ${d.h / 2 - 4} 0 ${d.h - 8}`} fill="none" stroke={PELE_SOMBRA} strokeWidth={1.6} strokeLinecap="round" />
      ))}
      <rect x={62} y={70} width={92} height={82} rx={24} fill={PELE} {...traco} />
      {/* juntas dos dedos */}
      <path d="M150 83 v2 M152 103 v2 M152 122 v2 M150 140 v2" stroke={PELE_SOMBRA} strokeWidth={2} strokeLinecap="round" />
      <Manga x={-30} larg={96} cor={quem === "ela" ? VESTIDO : MARINHO} renda={quem === "ela"} />
    </g>
  );
}

/** Mão que dá: vinda da direita, segurando a aliança em pinça. */
function MaoDa({ quem }: { quem: QuemRecebe }) {
  // Quem dá é o outro.
  const daEla = quem === "ele";
  return (
    <g>
      {/* polegar por baixo do anelar, inclinado até a aliança */}
      <g transform="rotate(12 224 148)">
        <rect x={170} y={141} width={56} height={14} rx={7} fill={PELE} {...traco} />
      </g>
      {/* dedos fechados (punho) */}
      <rect x={194} y={110} width={40} height={42} rx={16} fill={PELE} {...traco} />
      <path d="M200 124 h10 M200 137 h10" stroke={PELE_SOMBRA} strokeWidth={2} strokeLinecap="round" />
      {/* indicador por cima do anelar: segura a aliança junto com o polegar */}
      <rect x={168} y={96} width={66} height={14} rx={7} fill={PELE} {...traco} />
      <rect x={212} y={86} width={66} height={70} rx={24} fill={PELE} {...traco} />
      <path d="M220 104 v2" stroke={PELE_SOMBRA} strokeWidth={2} strokeLinecap="round" />
      <g transform="translate(560 0) scale(-1 1)">
        <Manga x={190} larg={110} cor={daEla ? VESTIDO : MARINHO} renda={daEla} />
      </g>
    </g>
  );
}

/** A aliança "vestida" no dedo, vista de cima: um aro em volta do anelar. */
function AnelNoDedo({ solitario }: { solitario: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-o`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a87d1e" />
          <stop offset="0.45" stopColor="#f6dc86" />
          <stop offset="1" stopColor="#b18624" />
        </linearGradient>
      </defs>
      <rect x={solitario ? 162 : 160} y={110} width={solitario ? 7 : 10} height={25} rx={3} fill={`url(#${id}-o)`} stroke={T} strokeWidth={1.6} />
      {solitario && (
        <g>
          <circle cx={165.5} cy={122.5} r={5.6} fill="#e9f1fb" stroke="#7d93ad" strokeWidth={1.2} />
          <path d="M163 120.5 l2 -1" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" />
          {[
            [160.5, 118],
            [170.5, 118],
            [160.5, 127],
            [170.5, 127],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1.3} fill="#d9b54c" />
          ))}
        </g>
      )}
    </g>
  );
}

export const CenaMaos = forwardRef<SVGSVGElement, { quem: QuemRecebe; refs: Refs; className?: string }>(function CenaMaos(
  { quem, refs, className },
  ref,
) {
  // A cena é desenhada com quem recebe à esquerda; na vez dele, espelhamos tudo.
  const espelho = quem === "ele" ? "translate(360 0) scale(-1 1)" : undefined;
  return (
    <svg ref={ref} viewBox="0 0 360 220" className={className} aria-hidden="true">
      <g transform={espelho}>
        <MaoRecebe quem={quem} />
        <g ref={refs.anel} style={{ transform: `translateX(${DESLOCAMENTO_INICIAL}px)` }}>
          <AnelNoDedo solitario={quem === "ela"} />
        </g>
        <g ref={refs.dando} style={{ transform: `translateX(${DESLOCAMENTO_INICIAL}px)` }}>
          <MaoDa quem={quem} />
        </g>
      </g>
    </svg>
  );
});
