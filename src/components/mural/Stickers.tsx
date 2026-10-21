import type { ReactNode } from "react";

/**
 * Coleção de stickers do casamento, no traço de "flash" de tatuagem:
 * contorno grosso em marinho, cores chapadas e borda branca de adesivo recortado.
 * Os noivos escolhem um ao aprovar cada post-it.
 */

const T = "#14233b"; // traço
const ROSE = "#e2b3a3";
const ROSE_ESCURO = "#b97a74";
const OURO = "#e7c46f";
const OURO_ESCURO = "#c2a15f";
const SALVIA = "#8fac90";
const SALVIA_ESCURA = "#6e8f71";
const CREME = "#fff7e8";
const BRANCO = "#ffffff";
const PELE = "#f6d3bb";
const PELE_SOMBRA = "#e6b394";

const traco = { stroke: T, strokeWidth: 3.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Faixinha de tatuagem com texto. */
function Faixa({
  cx,
  cy,
  largura,
  texto,
  cor = CREME,
  fonte = 15,
}: {
  cx: number;
  cy: number;
  largura: number;
  texto: string;
  cor?: string;
  fonte?: number;
}) {
  const e = cx - largura / 2;
  const d = cx + largura / 2;
  return (
    <g>
      <path d={`M${e + 4} ${cy - 3} H${e - 13} L${e - 7} ${cy + 5} L${e - 13} ${cy + 13} H${e + 4} Z`} fill={ROSE_ESCURO} {...traco} />
      <path d={`M${d - 4} ${cy - 3} H${d + 13} L${d + 7} ${cy + 5} L${d + 13} ${cy + 13} H${d - 4} Z`} fill={ROSE_ESCURO} {...traco} />
      <path
        d={`M${e} ${cy - 9} Q${cx} ${cy - 14} ${d} ${cy - 9} V${cy + 8} Q${cx} ${cy + 3} ${e} ${cy + 8} Z`}
        fill={cor}
        {...traco}
      />
      {/* Centro vertical da faixa (ela é curva, então fica um pouco acima do meio). */}
      <text
        x={cx}
        y={cy + 1.2}
        textAnchor="middle"
        fontFamily="'Caveat Variable', 'Caveat', cursive"
        fontWeight={700}
        fontSize={fonte}
        fill={T}
      >
        {texto}
      </text>
    </g>
  );
}

function Brilho({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  const q = r * 0.28;
  return (
    <path
      d={`M${x} ${y - r} Q${x + q} ${y - q} ${x + r} ${y} Q${x + q} ${y + q} ${x} ${y + r} Q${x - q} ${y + q} ${x - r} ${y} Q${x - q} ${y - q} ${x} ${y - r} Z`}
      fill={BRANCO}
      stroke={T}
      strokeWidth={2.2}
      strokeLinejoin="round"
    />
  );
}

function coracao(cx: number, cy: number, s: number) {
  // Coração de tatuagem com ponta em (cx, cy + s).
  return `M${cx} ${cy + s} C${cx - s * 1.05} ${cy + s * 0.35}, ${cx - s * 1.25} ${cy - s * 0.35}, ${cx - s * 0.95} ${cy - s * 0.75}
    C${cx - s * 0.65} ${cy - s * 1.15}, ${cx - s * 0.15} ${cy - s * 1.05}, ${cx} ${cy - s * 0.6}
    C${cx + s * 0.15} ${cy - s * 1.05}, ${cx + s * 0.65} ${cy - s * 1.15}, ${cx + s * 0.95} ${cy - s * 0.75}
    C${cx + s * 1.25} ${cy - s * 0.35}, ${cx + s * 1.05} ${cy + s * 0.35}, ${cx} ${cy + s} Z`;
}

/** Cobertura de bolo escorrendo ao longo de uma borda reta. */
function cobertura(x0: number, x1: number, y: number) {
  const passo = (x1 - x0) / 6;
  let d = `M${x0} ${y - 2} H${x1} V${y + 4}`;
  for (let i = 6; i > 0; i--) {
    const fim = x1 - passo * (7 - i);
    const meio = fim + passo / 2;
    const fundo = y + (i % 2 ? 10 : 6);
    d += ` Q${meio + passo / 2} ${fundo} ${meio} ${fundo} Q${fim} ${fundo} ${fim} ${y + 4}`;
  }
  return d + " Z";
}

/** Flor de cinco pétalas. */
function Flor({ cx, cy, r, cor, miolo }: { cx: number; cy: number; r: number; cor: string; miolo: string }) {
  const petalas = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return <circle key={i} cx={cx + Math.cos(a) * r * 0.55} cy={cy + Math.sin(a) * r * 0.55} r={r * 0.52} fill={cor} {...traco} />;
  });
  return (
    <g>
      {petalas}
      <circle cx={cx} cy={cy} r={r * 0.3} fill={miolo} {...traco} />
    </g>
  );
}

function Folha({ x, y, ang, tam = 9 }: { x: number; y: number; ang: number; tam?: number }) {
  return (
    <path
      d={`M0 0 Q${tam * 0.6} ${-tam * 0.55} ${tam * 1.6} 0 Q${tam * 0.6} ${tam * 0.55} 0 0 Z`}
      transform={`translate(${x} ${y}) rotate(${ang})`}
      fill={SALVIA}
      {...traco}
      strokeWidth={2.4}
    />
  );
}

function Taca({ x, y, ang }: { x: number; y: number; ang: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <ellipse cx={0} cy={0} rx={12} ry={3.5} fill={CREME} {...traco} />
      <path d="M0 -3 V-26" {...traco} fill="none" strokeWidth={4} />
      <path d="M-10 -78 H10 L7 -34 Q0 -24 -7 -34 Z" fill={BRANCO} {...traco} />
      <path d="M-9.2 -64 H9.2 L7 -34 Q0 -25.5 -7 -34 Z" fill={OURO} />
      <path d="M-9.2 -64 H9.2" stroke={T} strokeWidth={2} />
      <path d="M-10 -78 H10 L7 -34 Q0 -24 -7 -34 Z" fill="none" {...traco} />
      <circle cx={-2} cy={-50} r={1.8} fill={BRANCO} />
      <circle cx={3} cy={-42} r={1.4} fill={BRANCO} />
      <circle cx={0} cy={-57} r={1.2} fill={BRANCO} />
      <path d="M-5 -74 V-68" stroke={BRANCO} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

/** Um punho de lado, com os nós dos dedos virados para a direita (o outro é o espelho). */
function Soquinho() {
  return (
    <g>
      {/* manga */}
      <rect x={2} y={48} width={18} height={30} rx={4} fill={SALVIA} {...traco} />
      {/* mão fechada: dedos dobrados formando os nós arredondados à direita */}
      <path
        d="M28 38 H50 Q58 38 58 43.5 Q58 48 51 48.5 Q58 49 58 54 Q58 58.5 51 59 Q58 59.5 58 64 Q58 68.5 51 69 Q58 69.5 58 74 Q58 80 50 80 H28 Q16 80 16 69 V49 Q16 38 28 38 Z"
        fill={PELE}
        {...traco}
      />
      <path d="M44 48.5 H51 M44 59 H51 M44 69 H51" stroke={T} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

const desenhos: Record<string, ReactNode> = {
  aliancas: (
    <g>
      {/* aliança de trás */}
      <circle cx={74} cy={60} r={22} fill="none" stroke={T} strokeWidth={15} />
      <circle cx={74} cy={60} r={22} fill="none" stroke={OURO} strokeWidth={8.6} />
      <path d="M62 46 A19 19 0 0 1 82 42" fill="none" stroke={BRANCO} strokeWidth={2.4} strokeLinecap="round" />
      {/* aliança da frente */}
      <circle cx={48} cy={66} r={22} fill="none" stroke={T} strokeWidth={15} />
      <circle cx={48} cy={66} r={22} fill="none" stroke={OURO} strokeWidth={8.6} />
      <path d="M34 54 A19 19 0 0 1 46 46" fill="none" stroke={BRANCO} strokeWidth={2.4} strokeLinecap="round" />
      {/* trecho da de trás passando por cima: entrelaça as duas */}
      <path d="M52.7 49.6 A22 22 0 0 1 60 42.6" fill="none" stroke={T} strokeWidth={15} />
      <path d="M52.7 49.6 A22 22 0 0 1 60 42.6" fill="none" stroke={OURO} strokeWidth={8.6} />
      {/* pedra */}
      <path d="M74 22 L84 30 L74 42 L64 30 Z" fill="#dff0fb" {...traco} />
      <path d="M64 30 H84 M70 30 L74 42 L78 30 M70 30 L74 22 L78 30" fill="none" stroke={T} strokeWidth={1.6} />
      <Brilho x={96} y={28} r={7} />
      <Brilho x={22} y={36} r={5} />
      <Faixa cx={60} cy={102} largura={46} texto="sim!" />
    </g>
  ),
  coracao: (
    <g>
      <path d={coracao(60, 52, 42)} fill={ROSE} {...traco} />
      <path d={`M60 94 C${60 + 44} ${52 + 15}, ${60 + 53} ${52 - 15}, ${60 + 40} ${52 - 31.5} C${60 + 40} ${52}, ${60 + 22} ${52 + 30}, 60 94 Z`} fill={ROSE_ESCURO} opacity={0.55} />
      <path d={coracao(60, 52, 42)} fill="none" {...traco} />
      <path d="M30 28 Q24 36 27 46" fill="none" stroke={BRANCO} strokeWidth={4} strokeLinecap="round" />
      <Faixa cx={60} cy={58} largura={78} texto="amo vocês" />
      <Brilho x={100} y={18} r={6} />
    </g>
  ),
  pomba: (
    <g>
      {/* corpo */}
      <path
        d="M24 56 C30 44 46 44 58 52 C70 58 84 58 98 50 L94 60 L108 62 L94 68 L100 76 C86 80 72 80 62 78 C46 76 30 70 24 56 Z"
        fill={BRANCO}
        {...traco}
      />
      {/* asa levantada */}
      <path
        d="M52 54 C46 36 58 18 86 12 C80 22 82 26 76 32 C86 32 84 40 74 44 C82 46 76 54 64 58 Z"
        fill={BRANCO}
        {...traco}
      />
      <path d="M62 50 C64 40 70 32 80 26 M66 54 C70 48 74 44 80 40" fill="none" stroke={T} strokeWidth={1.8} strokeLinecap="round" />
      {/* bico e olho */}
      <path d="M25 54 L14 59 L25 61 Z" fill={OURO} {...traco} strokeWidth={2.4} />
      <circle cx={32} cy={53} r={2.2} fill={T} />
      {/* ramo de oliveira no bico */}
      <path d="M16 60 Q12 76 24 92" fill="none" {...traco} strokeWidth={2.6} />
      <Folha x={14} y={70} ang={160} />
      <Folha x={15} y={78} ang={20} />
      <Folha x={19} y={86} ang={170} />
      <Folha x={22} y={90} ang={40} tam={8} />
      <circle cx={25} cy={94} r={3} fill={SALVIA_ESCURA} {...traco} strokeWidth={2} />
      <path d="M40 66 Q56 72 74 70" fill="none" stroke={T} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
      <Brilho x={104} y={30} r={6} />
    </g>
  ),
  bolo: (
    <g>
      <ellipse cx={60} cy={104} rx={48} ry={6} fill="#d6dbe1" {...traco} />
      <rect x={20} y={76} width={80} height={27} rx={3} fill={CREME} {...traco} />
      <path d={cobertura(20, 100, 76)} fill={ROSE} {...traco} strokeWidth={2.4} />
      <rect x={31} y={54} width={58} height={23} rx={3} fill={CREME} {...traco} />
      <path d={cobertura(31, 89, 54)} fill={ROSE} {...traco} strokeWidth={2.4} />
      <rect x={42} y={34} width={36} height={21} rx={3} fill={CREME} {...traco} />
      <path d={cobertura(42, 78, 34)} fill={ROSE} {...traco} strokeWidth={2.4} />
      {[28, 44, 60, 76, 92].map((x) => (
        <circle key={x} cx={x} cy={96} r={2.6} fill={OURO} stroke={T} strokeWidth={1.6} />
      ))}
      {[40, 52, 68, 80].map((x) => (
        <circle key={x} cx={x} cy={71} r={2.3} fill={OURO} stroke={T} strokeWidth={1.6} />
      ))}
      <path d={coracao(60, 22, 9)} fill={ROSE_ESCURO} {...traco} strokeWidth={2.6} />
      <Brilho x={96} y={28} r={6} />
      <Brilho x={24} y={46} r={4.5} />
    </g>
  ),
  buque: (
    <g>
      <path d="M60 104 L48 62 M60 104 L60 48 M60 104 L74 62" stroke={SALVIA_ESCURA} strokeWidth={3.4} fill="none" />
      <Folha x={44} y={66} ang={200} tam={11} />
      <Folha x={78} y={64} ang={-20} tam={11} />
      <Folha x={34} y={50} ang={215} tam={9} />
      <Folha x={88} y={48} ang={-35} tam={9} />
      <Flor cx={40} cy={48} r={17} cor={ROSE} miolo={OURO} />
      <Flor cx={82} cy={48} r={17} cor={OURO} miolo={ROSE_ESCURO} />
      <Flor cx={61} cy={30} r={18} cor={BRANCO} miolo={OURO} />
      <path d="M46 78 H76 L66 108 H56 Z" fill={CREME} {...traco} />
      <path d="M50 80 L58 106 M70 80 L64 106" stroke={T} strokeWidth={1.4} opacity={0.35} />
      {/* laço */}
      <path d="M61 84 C50 74 40 78 44 86 C47 92 56 88 61 84 Z" fill={ROSE_ESCURO} {...traco} />
      <path d="M61 84 C72 74 82 78 78 86 C75 92 66 88 61 84 Z" fill={ROSE_ESCURO} {...traco} />
      <path d="M58 86 L50 100 M64 86 L72 100" stroke={T} strokeWidth={6} strokeLinecap="round" />
      <path d="M58 86 L50 100 M64 86 L72 100" stroke={ROSE_ESCURO} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={61} cy={84} r={4} fill={ROSE} {...traco} strokeWidth={2.4} />
    </g>
  ),
  biblia: (
    <g>
      {/* luz */}
      {[-60, -35, -10, 10, 35, 60].map((a) => (
        <path key={a} d="M0 -27 V-37" transform={`translate(60 46) rotate(${a})`} stroke={OURO_ESCURO} strokeWidth={3} strokeLinecap="round" />
      ))}
      <path d="M57 8 H63 V18 H71 V24 H63 V40 H57 V24 H49 V18 H57 Z" fill={OURO} {...traco} strokeWidth={2.6} />
      {/* capa */}
      <path d="M12 52 Q36 42 60 54 Q84 42 108 52 V104 Q84 94 60 106 Q36 94 12 104 Z" fill="#22395a" {...traco} />
      {/* páginas */}
      <path d="M60 52 C48 42 30 42 17 48 V96 C30 90 48 90 60 98 Z" fill={CREME} {...traco} />
      <path d="M60 52 C72 42 90 42 103 48 V96 C90 90 72 90 60 98 Z" fill={CREME} {...traco} />
      <path d="M60 52 V98" stroke={T} strokeWidth={2.4} />
      {[58, 66, 74, 82].map((y) => (
        <g key={y} stroke={T} strokeWidth={1.6} strokeLinecap="round" opacity={0.45}>
          <path d={`M25 ${y - 2} Q38 ${y - 5} 52 ${y}`} fill="none" />
          <path d={`M68 ${y} Q82 ${y - 5} 95 ${y - 2}`} fill="none" />
        </g>
      ))}
      {/* marcador */}
      <path d="M66 96 V112 L70 108 L74 112 V95" fill={ROSE_ESCURO} {...traco} strokeWidth={2.2} />
    </g>
  ),
  brinde: (
    <g>
      <Taca x={42} y={106} ang={-16} />
      <Taca x={78} y={106} ang={16} />
      <Brilho x={60} y={18} r={8} />
      <path d="M46 16 L40 10 M74 16 L80 10 M60 6 V2" stroke={T} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={30} cy={22} r={2.6} fill={OURO} stroke={T} strokeWidth={1.6} />
      <circle cx={94} cy={26} r={2} fill={OURO} stroke={T} strokeWidth={1.6} />
    </g>
  ),
  palavra: (
    <g>
      {/* luz atrás */}
      {[-70, -45, -20, 20, 45, 70].map((a) => (
        <path key={a} d="M0 -46 V-56" transform={`translate(60 58) rotate(${a})`} stroke={OURO_ESCURO} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* páginas na lateral e embaixo */}
      <path d="M38 14 H88 Q92 14 92 18 V88 Q92 92 88 92 H38 Z" fill={CREME} {...traco} />
      <path d="M86 20 V86 M82 20 V86" stroke={T} strokeWidth={1.2} opacity={0.35} />
      {/* capa */}
      <rect x={28} y={10} width={58} height={78} rx={5} fill="#22395a" {...traco} />
      <path d="M36 10 V88" stroke={T} strokeWidth={2.4} />
      <rect x={30.5} y={12.5} width={53} height={73} rx={3.5} fill="none" stroke={OURO} strokeWidth={1.4} opacity={0.7} />
      <path d="M57 26 H63 V36 H71 V42 H63 V62 H57 V42 H49 V36 H57 Z" fill={OURO} {...traco} strokeWidth={2.4} />
      {/* marcador */}
      <path d="M74 86 V100 L78 96 L82 100 V86" fill={ROSE_ESCURO} {...traco} strokeWidth={2.2} />
      <Faixa cx={60} cy={100} largura={86} texto="Palavra de Deus" fonte={13.5} />
    </g>
  ),
  oracao: (
    <g>
      {/* brilho do alto */}
      {[-50, -25, 0, 25, 50].map((a) => (
        <path key={a} d="M0 -48 V-56" transform={`translate(60 62) rotate(${a})`} stroke={OURO_ESCURO} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* mangas */}
      <path d="M38 82 H60 V98 H34 Z" fill={SALVIA} {...traco} />
      <path d="M82 82 H60 V98 H86 Z" fill={SALVIA} {...traco} />
      {/* mão de trás (esquerda) e da frente (direita), palmas juntas */}
      <path d="M60 12 C52 20 44 38 41 56 C39 68 40 78 42 84 H60 Z" fill={PELE_SOMBRA} {...traco} />
      <path d="M60 12 C68 20 76 38 79 56 C81 68 80 78 78 84 H60 Z" fill={PELE} {...traco} />
      {/* dedos */}
      <path d="M64 24 C68 32 71 42 72 52 M61 34 C64 42 66 50 66 58" fill="none" stroke={T} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M56 24 C52 32 49 42 48 52" fill="none" stroke={T} strokeWidth={1.8} strokeLinecap="round" opacity={0.6} />
      {/* polegar da frente */}
      <path d="M60 62 C63 56 70 56 70 64 C70 70 66 76 60 77" fill={PELE} {...traco} strokeWidth={2.6} />
      <Brilho x={92} y={22} r={6} />
      <Brilho x={26} y={30} r={4.5} />
      <Faixa cx={60} cy={104} largura={60} texto="Oração" />
    </g>
  ),
  joia: (
    <g>
      {/* punho */}
      <rect x={14} y={54} width={18} height={36} rx={4} fill={SALVIA} {...traco} />
      <rect x={28} y={50} width={36} height={44} rx={10} fill={PELE} {...traco} />
      {/* polegar para cima */}
      <path d="M36 52 C33 38 36 24 46 16 C53 11 61 16 58 26 C56 34 54 42 56 52 Z" fill={PELE} {...traco} />
      {/* dedos dobrados */}
      {[50, 61, 72, 83].map((y, i) => (
        <rect key={y} x={52} y={y} width={i === 3 ? 30 : 36} height={11} rx={5.5} fill={PELE} {...traco} strokeWidth={2.8} />
      ))}
      <Brilho x={96} y={28} r={7} />
      <Brilho x={80} y={14} r={4.5} />
      <Faixa cx={60} cy={106} largura={52} texto="joia!" />
    </g>
  ),
  tmj: (
    <g>
      {/* estalo do encontro */}
      <path d="M60 30 V20 M50 33 L44 25 M70 33 L76 25" stroke={OURO_ESCURO} strokeWidth={3.2} strokeLinecap="round" />
      <Brilho x={30} y={24} r={5} />
      <Brilho x={92} y={22} r={6} />
      <g transform="translate(0 -2)">
        <Soquinho />
      </g>
      <g transform="translate(120 -2) scale(-1 1)">
        <Soquinho />
      </g>
      <Faixa cx={60} cy={100} largura={46} texto="TMJ" fonte={16} />
    </g>
  ),
  gravata: (
    <g>
      {/* gola da camisa */}
      <path d="M60 24 L34 12 L38 36 Z" fill={BRANCO} {...traco} />
      <path d="M60 24 L86 12 L82 36 Z" fill={BRANCO} {...traco} />
      {/* corpo da gravata */}
      <path d="M55 38 H65 L74 92 L60 110 L46 92 Z" fill="#2f4a72" {...traco} />
      <path d="M54.5 54 L65.5 46 M52.5 66 L67.5 58 M50.5 78 L69.5 70 M48.5 90 L71.5 82" stroke={ROSE} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M55 38 H65 L74 92 L60 110 L46 92 Z" fill="none" {...traco} />
      {/* nó */}
      <path d="M51 22 H69 L65 39 H55 Z" fill="#3c5c8a" {...traco} />
      <path d="M56 26 L58 35" stroke={BRANCO} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      <Brilho x={92} y={44} r={6} />
      <Brilho x={26} y={52} r={4.5} />
    </g>
  ),
  controle: (
    <g transform="rotate(-8 60 64)">
      <path d="M26 44 Q34 34 46 38 H74 Q86 34 94 44 Q108 62 102 86 Q98 98 86 92 L76 80 H44 L34 92 Q22 98 18 86 Q12 62 26 44 Z" fill="#e9edf2" {...traco} />
      <path d="M34 54 h8 v-8 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 Z" fill={T} transform="translate(-4 4) scale(.85) translate(6 2)" />
      <circle cx={84} cy={50} r={4.6} fill={ROSE} {...traco} strokeWidth={2} />
      <circle cx={93} cy={59} r={4.6} fill={OURO} {...traco} strokeWidth={2} />
      <circle cx={84} cy={68} r={4.6} fill={SALVIA} {...traco} strokeWidth={2} />
      <circle cx={75} cy={59} r={4.6} fill="#bfe3f5" {...traco} strokeWidth={2} />
      <circle cx={50} cy={76} r={6} fill="#2f4a72" {...traco} strokeWidth={2.4} />
      <circle cx={70} cy={76} r={6} fill="#2f4a72" {...traco} strokeWidth={2.4} />
      <path d="M54 48 H66" stroke={T} strokeWidth={2.4} strokeLinecap="round" />
      <Brilho x={100} y={26} r={6} />
    </g>
  ),
  oculos: (
    <g>
      <path d="M8 46 L16 44 M112 46 L104 44" stroke={T} strokeWidth={4} strokeLinecap="round" />
      <path d="M14 44 H54 Q57 44 56 48 L53 70 Q51 80 40 80 H30 Q21 80 19 70 L13 48 Q12 44 14 44 Z" fill="#22395a" {...traco} strokeWidth={4} />
      <path d="M106 44 H66 Q63 44 64 48 L67 70 Q69 80 80 80 H90 Q99 80 101 70 L107 48 Q108 44 106 44 Z" fill="#22395a" {...traco} strokeWidth={4} />
      <path d="M56 50 Q60 44 64 50" fill="none" stroke={T} strokeWidth={4} strokeLinecap="round" />
      <path d="M22 52 L30 66 M28 50 L34 60" stroke={ROSE} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      <path d="M74 52 L82 66 M80 50 L86 60" stroke={ROSE} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
      <Brilho x={94} y={26} r={7} />
      <Brilho x={24} y={30} r={4.5} />
    </g>
  ),
  teclado: (
    <g transform="rotate(-10 60 66)">
      <rect x={12} y={42} width={96} height={50} rx={7} fill="#22395a" {...traco} />
      <path d="M16 46 H104" stroke="#3c5c8a" strokeWidth={2} />
          <rect x={18.0} y={50.0} width={7.6} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={27.6} y={50.0} width={7.6} height={7.6} rx={1.6} fill={OURO} stroke={T} strokeWidth={1.4} />
          <rect x={37.2} y={50.0} width={7.6} height={7.6} rx={1.6} fill={SALVIA} stroke={T} strokeWidth={1.4} />
          <rect x={46.8} y={50.0} width={7.6} height={7.6} rx={1.6} fill={"#bfe3f5"} stroke={T} strokeWidth={1.4} />
          <rect x={56.4} y={50.0} width={7.6} height={7.6} rx={1.6} fill={ROSE_ESCURO} stroke={T} strokeWidth={1.4} />
          <rect x={66.0} y={50.0} width={7.6} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={75.6} y={50.0} width={7.6} height={7.6} rx={1.6} fill={OURO} stroke={T} strokeWidth={1.4} />
          <rect x={85.2} y={50.0} width={7.6} height={7.6} rx={1.6} fill={SALVIA} stroke={T} strokeWidth={1.4} />
          <rect x={94.8} y={50.0} width={7.6} height={7.6} rx={1.6} fill={"#bfe3f5"} stroke={T} strokeWidth={1.4} />
          <rect x={18.0} y={59.6} width={7.6} height={7.6} rx={1.6} fill={SALVIA} stroke={T} strokeWidth={1.4} />
          <rect x={27.6} y={59.6} width={7.6} height={7.6} rx={1.6} fill={"#bfe3f5"} stroke={T} strokeWidth={1.4} />
          <rect x={37.2} y={59.6} width={7.6} height={7.6} rx={1.6} fill={ROSE_ESCURO} stroke={T} strokeWidth={1.4} />
          <rect x={46.8} y={59.6} width={7.6} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={56.4} y={59.6} width={7.6} height={7.6} rx={1.6} fill={OURO} stroke={T} strokeWidth={1.4} />
          <rect x={66.0} y={59.6} width={7.6} height={7.6} rx={1.6} fill={SALVIA} stroke={T} strokeWidth={1.4} />
          <rect x={75.6} y={59.6} width={7.6} height={7.6} rx={1.6} fill={"#bfe3f5"} stroke={T} strokeWidth={1.4} />
          <rect x={85.2} y={59.6} width={7.6} height={7.6} rx={1.6} fill={ROSE_ESCURO} stroke={T} strokeWidth={1.4} />
          <rect x={94.8} y={59.6} width={7.6} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={18.0} y={69.2} width={7.6} height={7.6} rx={1.6} fill={ROSE_ESCURO} stroke={T} strokeWidth={1.4} />
          <rect x={27.6} y={69.2} width={7.6} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={37.2} y={69.2} width={7.6} height={7.6} rx={1.6} fill={OURO} stroke={T} strokeWidth={1.4} />
          <rect x={46.8} y={69.2} width={7.6} height={7.6} rx={1.6} fill={SALVIA} stroke={T} strokeWidth={1.4} />
          <rect x={56.4} y={69.2} width={7.6} height={7.6} rx={1.6} fill={"#bfe3f5"} stroke={T} strokeWidth={1.4} />
          <rect x={66.0} y={69.2} width={7.6} height={7.6} rx={1.6} fill={ROSE_ESCURO} stroke={T} strokeWidth={1.4} />
          <rect x={75.6} y={69.2} width={7.6} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={85.2} y={69.2} width={7.6} height={7.6} rx={1.6} fill={OURO} stroke={T} strokeWidth={1.4} />
          <rect x={94.8} y={69.2} width={7.6} height={7.6} rx={1.6} fill={SALVIA} stroke={T} strokeWidth={1.4} />
          <rect x={27.6} y={78.8} width={45} height={7.6} rx={1.6} fill={CREME} stroke={T} strokeWidth={1.4} />
          <rect x={75.6} y={78.8} width={17.2} height={7.6} rx={1.6} fill={ROSE} stroke={T} strokeWidth={1.4} />
          <rect x={18} y={78.8} width={7.6} height={7.6} rx={1.6} fill={OURO} stroke={T} strokeWidth={1.4} />
      <path d="M100 42 Q104 30 96 24 Q88 18 94 10" fill="none" stroke={T} strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  halter: (
    <g transform="rotate(-22 60 60)">
      <rect x={26} y={55} width={68} height={10} rx={3} fill="#cfd6de" {...traco} strokeWidth={2.6} />
      <rect x={12} y={36} width={12} height={48} rx={4} fill="#2f4a72" {...traco} />
      <rect x={24} y={42} width={9} height={36} rx={3} fill={ROSE_ESCURO} {...traco} strokeWidth={2.6} />
      <rect x={96} y={36} width={12} height={48} rx={4} fill="#2f4a72" {...traco} />
      <rect x={87} y={42} width={9} height={36} rx={3} fill={ROSE_ESCURO} {...traco} strokeWidth={2.6} />
      <path d="M15 42 V60 M99 42 V60" stroke={BRANCO} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      <Brilho x={60} y={34} r={6} />
    </g>
  ),
  zoe: (
    <g>
      {/* orelhas peludas */}
      <path d="M30 34 Q12 40 14 66 Q14 86 26 92 Q34 80 34 64 Z" fill="#6b5a4d" {...traco} />
      <path d="M90 34 Q108 40 106 66 Q106 86 94 92 Q86 80 86 64 Z" fill="#6b5a4d" {...traco} />
      {/* cabeça */}
      <path d="M60 18 Q86 18 92 44 Q96 70 84 86 Q72 98 60 98 Q48 98 36 86 Q24 70 28 44 Q34 18 60 18 Z" fill="#9a8878" {...traco} />
      {/* faixa branca da testa e focinho */}
      <path d="M54 20 Q60 17 66 20 L64 50 Q74 54 76 66 Q74 84 60 86 Q46 84 44 66 Q46 54 56 50 Z" fill="#f4ede4" />
      <path d="M38 70 Q46 92 60 94 Q74 92 82 70" fill="none" stroke="#f4ede4" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
      <path d="M60 18 Q86 18 92 44 Q96 70 84 86 Q72 98 60 98 Q48 98 36 86 Q24 70 28 44 Q34 18 60 18 Z" fill="none" {...traco} />
      {/* olhos */}
      <circle cx={44} cy={52} r={7.5} fill="#1a1412" {...traco} strokeWidth={2} />
      <circle cx={76} cy={52} r={7.5} fill="#1a1412" {...traco} strokeWidth={2} />
      <circle cx={46.5} cy={49.5} r={2.4} fill={BRANCO} />
      <circle cx={78.5} cy={49.5} r={2.4} fill={BRANCO} />
      {/* nariz e boquinha */}
      <ellipse cx={60} cy={68} rx={7.5} ry={5.5} fill="#1a1412" {...traco} strokeWidth={2} />
      <circle cx={57.5} cy={66.5} r={1.5} fill={BRANCO} opacity={0.7} />
      <path d="M60 73.5 V78 M53 79 Q60 84 67 79" fill="none" stroke={T} strokeWidth={2} strokeLinecap="round" />
      <path d="M57 81 Q60 88 63 81 Z" fill="#f29aa0" stroke={T} strokeWidth={1.4} />
      {/* lacinho */}
      <path d="M60 18 L48 10 Q44 18 48 24 Z M60 18 L72 10 Q76 18 72 24 Z" fill={ROSE} {...traco} strokeWidth={2.4} />
      <circle cx={60} cy={18} r={4} fill={ROSE_ESCURO} {...traco} strokeWidth={2.2} />
      <Faixa cx={60} cy={106} largura={40} texto="Zoe" />
    </g>
  ),
  notebook: (
    <g>
      <rect x={24} y={24} width={72} height={50} rx={5} fill="#22395a" {...traco} />
      <rect x={30} y={30} width={60} height={38} rx={2} fill="#d3ecfb" />
      <path d="M36 38 H52 M36 45 H60 M42 52 H56 M36 59 H48" stroke="#2f4a72" strokeWidth={2.4} strokeLinecap="round" />
      <path d={coracao(76, 48, 7)} fill={ROSE} stroke={T} strokeWidth={1.8} />
      <path d="M12 78 H108 L102 90 Q100 92 96 92 H24 Q20 92 18 90 Z" fill="#cfd6de" {...traco} />
      <path d="M50 78 H70 V81 H50 Z" fill="#9aa5b1" />
      <Brilho x={102} y={22} r={6} />
    </g>
  ),
  presente: (
    <g>
      <rect x={26} y={56} width={68} height={48} rx={3} fill={ROSE} {...traco} />
      <rect x={22} y={44} width={76} height={16} rx={3} fill={ROSE_ESCURO} {...traco} />
      <rect x={54} y={44} width={12} height={60} fill={OURO} {...traco} strokeWidth={2.6} />
      <path d="M60 44 C46 26 28 32 36 42 C40 47 52 46 60 44 Z" fill={OURO} {...traco} strokeWidth={2.6} />
      <path d="M60 44 C74 26 92 32 84 42 C80 47 68 46 60 44 Z" fill={OURO} {...traco} strokeWidth={2.6} />
      <circle cx={60} cy={44} r={4.5} fill={OURO_ESCURO} {...traco} strokeWidth={2.4} />
      <Brilho x={98} y={30} r={6} />
      <Brilho x={20} y={34} r={4.5} />
    </g>
  ),
  girassol: (
    <g>
      <path d="M60 64 Q58 90 62 112" fill="none" stroke={SALVIA_ESCURA} strokeWidth={5} strokeLinecap="round" />
      <Folha x={60} y={92} ang={-30} tam={13} />
      <Folha x={61} y={100} ang={205} tam={12} />
      <g>
        <ellipse key={0} cx={60} cy={24} rx={7} ry={15} transform="rotate(0.0 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={1} cx={60} cy={24} rx={7} ry={15} transform="rotate(25.7 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={2} cx={60} cy={24} rx={7} ry={15} transform="rotate(51.4 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={3} cx={60} cy={24} rx={7} ry={15} transform="rotate(77.1 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={4} cx={60} cy={24} rx={7} ry={15} transform="rotate(102.9 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={5} cx={60} cy={24} rx={7} ry={15} transform="rotate(128.6 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={6} cx={60} cy={24} rx={7} ry={15} transform="rotate(154.3 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={7} cx={60} cy={24} rx={7} ry={15} transform="rotate(180.0 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={8} cx={60} cy={24} rx={7} ry={15} transform="rotate(205.7 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={9} cx={60} cy={24} rx={7} ry={15} transform="rotate(231.4 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={10} cx={60} cy={24} rx={7} ry={15} transform="rotate(257.1 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={11} cx={60} cy={24} rx={7} ry={15} transform="rotate(282.9 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={12} cx={60} cy={24} rx={7} ry={15} transform="rotate(308.6 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
        <ellipse key={13} cx={60} cy={24} rx={7} ry={15} transform="rotate(334.3 60 46)" fill={OURO} {...traco} strokeWidth={2.4} />
      </g>
      <circle cx={60} cy={46} r={14} fill="#6b4a2e" {...traco} />
      <g fill="#3d2a1a">{[[64.0,46.0],[62.0,49.5],[58.0,49.5],[56.0,46.0],[58.0,42.5],[62.0,42.5],[68.1,48.5],[65.1,52.8],[60.1,54.5],[55.1,52.9],[52.0,48.7],[51.9,43.5],[54.9,39.2],[59.9,37.5],[64.9,39.1],[68.0,43.3]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} />
      ))}</g>
    </g>
  ),
  bicicleta: (
    <g>
      {/* rodas */}
      <circle cx={28} cy={86} r={20} fill="none" stroke={T} strokeWidth={6} />
      <circle cx={92} cy={86} r={20} fill="none" stroke={T} strokeWidth={6} />
      <circle cx={28} cy={86} r={15.5} fill="none" stroke="#3cc6b0" strokeWidth={2.4} />
      <circle cx={92} cy={86} r={15.5} fill="none" stroke="#3cc6b0" strokeWidth={2.4} />
      <path d="M43.0 86.0 L13.0 86.0 M42.3 90.6 L13.7 81.4 M40.1 94.8 L15.9 77.2 M36.8 98.1 L19.2 73.9 M32.6 100.3 L23.4 71.7 M28.0 101.0 L28.0 71.0 M23.4 100.3 L32.6 71.7 M19.2 98.1 L36.8 73.9 M15.9 94.8 L40.1 77.2 M13.7 90.6 L42.3 81.4" stroke={T} strokeWidth={0.8} opacity={0.6} />
      <path d="M107.0 86.0 L77.0 86.0 M106.3 90.6 L77.7 81.4 M104.1 94.8 L79.9 77.2 M100.8 98.1 L83.2 73.9 M96.6 100.3 L87.4 71.7 M92.0 101.0 L92.0 71.0 M87.4 100.3 L96.6 71.7 M83.2 98.1 L100.8 73.9 M79.9 94.8 L104.1 77.2 M77.7 90.6 L106.3 81.4" stroke={T} strokeWidth={0.8} opacity={0.6} />
      {/* para-lamas creme */}
      <path d="M8 82 A21 21 0 0 1 44 70" fill="none" stroke={T} strokeWidth={6.5} strokeLinecap="round" />
      <path d="M8 82 A21 21 0 0 1 44 70" fill="none" stroke="#f2e6c9" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M74 70 A21 21 0 0 1 112 82" fill="none" stroke={T} strokeWidth={6.5} strokeLinecap="round" />
      <path d="M74 70 A21 21 0 0 1 112 82" fill="none" stroke="#f2e6c9" strokeWidth={3.5} strokeLinecap="round" />
      {/* quadro turquesa, modelo feminino */}
      <path d="M38 50 Q42 82 58 88 L92 86 M58 88 L68 52 M68 56 L92 86 M38 50 L28 86 M66 56 H98" fill="none" stroke={T} strokeWidth={6.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 50 Q42 82 58 88 L92 86 M58 88 L68 52 M68 56 L92 86 M38 50 L28 86 M66 56 H98" fill="none" stroke="#3cc6b0" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={58} cy={88} r={4} fill="#5b4a3a" stroke={T} strokeWidth={1.6} />
      {/* guidão creme */}
      <path d="M38 50 L36 40 Q40 34 48 36" fill="none" stroke={T} strokeWidth={6} strokeLinecap="round" />
      <path d="M38 50 L36 40 Q40 34 48 36" fill="none" stroke="#f2e6c9" strokeWidth={3} strokeLinecap="round" />
      <path d="M46 35 L52 37" stroke={T} strokeWidth={5} strokeLinecap="round" />
      {/* banco preto */}
      <path d="M58 48 Q66 44 76 48 Q74 52 66 52 Q60 52 58 48 Z" fill="#1d2a3e" {...traco} strokeWidth={2} />
      {/* cadeirinha cinza */}
      <path d="M76 56 Q74 42 82 40 L88 40 Q92 20 102 14 Q108 20 104 36 Q100 50 98 58 Q92 66 84 64 Q78 62 76 56 Z" fill="#9aa5ad" {...traco} />
      <path d="M86 44 Q94 42 98 30" fill="none" stroke={T} strokeWidth={1.6} opacity={0.5} />
    </g>
  ),
  salto: (
    <g>
      {/* scarpin branco de lado: bico à esquerda, salto fino à direita */}
      <path
        d="M12 92 Q14 80 32 80 Q48 78 62 70 Q80 58 90 34 L98 30 Q104 32 102 40 Q100 56 98 64 L97 108 H91 L89 70 Q70 84 50 94 Q32 100 18 99 Q10 98 12 92 Z"
        fill={BRANCO}
        {...traco}
      />
      {/* forro rose aparecendo na abertura */}
      <path d="M32 82 Q50 78 64 72 Q80 62 90 40 L97 34 Q94 52 82 66 Q62 82 32 85 Z" fill={ROSE} stroke={T} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M89 72 L98 72" stroke={T} strokeWidth={1.8} />
      <path d="M20 92 Q34 90 46 86" fill="none" stroke={T} strokeWidth={1.4} opacity={0.35} strokeLinecap="round" />
      <Brilho x={30} y={52} r={7} />
      <Brilho x={60} y={34} r={4.5} />
    </g>
  ),
  carta: (
    <g>
      <path d={coracao(34, 22, 9)} fill={ROSE} {...traco} strokeWidth={2.4} transform="rotate(-14 34 22)" />
      <path d={coracao(84, 16, 7)} fill={ROSE_ESCURO} {...traco} strokeWidth={2.2} transform="rotate(12 84 16)" />
      <rect x={14} y={38} width={92} height={62} rx={5} fill={CREME} {...traco} />
      <path d="M16 98 L50 68 M104 98 L70 68" stroke={T} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M15 41 L60 76 L105 41" fill={BRANCO} {...traco} />
      <circle cx={60} cy={74} r={13} fill={ROSE_ESCURO} {...traco} />
      <path d={coracao(60, 74, 6.5)} fill={ROSE} stroke={T} strokeWidth={1.8} />
      <Brilho x={100} y={34} r={6} />
    </g>
  ),
};

export const STICKERS = [
  { id: "aliancas", nome: "Alianças" },
  { id: "coracao", nome: "Amo vocês" },
  { id: "pomba", nome: "Pomba da paz" },
  { id: "bolo", nome: "Bolo" },
  { id: "buque", nome: "Buquê" },
  { id: "biblia", nome: "Bíblia aberta" },
  { id: "palavra", nome: "Palavra de Deus" },
  { id: "oracao", nome: "Oração" },
  { id: "joia", nome: "Joia" },
  { id: "tmj", nome: "TMJ" },
  { id: "gravata", nome: "Gravata" },
  { id: "controle", nome: "Videogame" },
  { id: "oculos", nome: "Óculos de sol" },
  { id: "teclado", nome: "Teclado gamer" },
  { id: "halter", nome: "Academia" },
  { id: "zoe", nome: "Zoe" },
  { id: "notebook", nome: "Notebook" },
  { id: "presente", nome: "Presente" },
  { id: "girassol", nome: "Girassol" },
  { id: "bicicleta", nome: "Bicicleta" },
  { id: "salto", nome: "Salto alto" },
  { id: "brinde", nome: "Brinde" },
  { id: "carta", nome: "Cartinha" },
] as const;

export type IdSticker = (typeof STICKERS)[number]["id"];

export function ehSticker(id: unknown): id is IdSticker {
  return typeof id === "string" && STICKERS.some((s) => s.id === id);
}

/** Um sticker com borda branca de adesivo e sombra leve. */
export function Sticker({ id, className, titulo }: { id: IdSticker; className?: string; titulo?: string }) {
  // Filtros com o mesmo id são idênticos, então repetir o id na página não causa problema.
  const filtro = `sticker-corte-${id}`;
  const nome = titulo ?? STICKERS.find((s) => s.id === id)?.nome;
  return (
    <svg viewBox="-8 -8 136 136" className={className} role="img" aria-label={`Sticker: ${nome}`}>
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
      <g filter={`url(#${filtro})`}>{desenhos[id]}</g>
    </svg>
  );
}
