"use client";

import { useState } from "react";

export type Foto = { src: string; alt: string; legenda: string; foco?: string };

/** Ângulos fixos (não aleatórios) para o servidor e o navegador desenharem igual. */
const GIROS = [-4, 3, -2, 5, -6, 2, -3, 4];
/** No desktop as fotos de baixo ficam espalhadas pela "mesa", à esquerda e à direita. */
const LADOS = [0, -1, 1, -0.55, 0.55, 0, 0, 0];

/**
 * Pilha de fotos impressas. Tocar na de cima manda ela para o fundo da pilha.
 */
export function PilhaDeFotos({ fotos }: { fotos: Foto[] }) {
  const [ordem, setOrdem] = useState(() => fotos.map((_, i) => i));
  const [saindo, setSaindo] = useState<number | null>(null);

  const passar = () => {
    if (saindo !== null) return;
    const topo = ordem[0];
    setSaindo(topo);
    window.setTimeout(() => {
      setOrdem((o) => [...o.slice(1), o[0]]);
      setSaindo(null);
    }, 420);
  };

  const atual = fotos[ordem[0]];

  return (
    <figure className="pilha">
      <button
        type="button"
        className="pilha__mesa"
        onClick={passar}
        aria-label={`Foto ${fotos.indexOf(atual) + 1} de ${fotos.length}: ${atual.alt}. Toque para ver a próxima.`}
      >
        {fotos.map((foto, i) => {
          const pos = ordem.indexOf(i);
          const giro = GIROS[i % GIROS.length];
          return (
            <span
              key={foto.src}
              className={`pilha__foto ${saindo === i ? "pilha__foto--saindo" : ""}`}
              style={
                {
                  zIndex: fotos.length - pos,
                  "--giro": `${pos === 0 ? 0 : giro}deg`,
                  "--profundidade": pos,
                  "--lado": LADOS[Math.min(pos, LADOS.length - 1)],
                } as React.CSSProperties
              }
              aria-hidden={pos !== 0}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto.src}
                alt=""
                loading={pos < 2 ? "eager" : "lazy"}
                style={{ objectPosition: foto.foco ?? "center" }}
              />
            </span>
          );
        })}
      </button>
      <figcaption className="pilha__legenda" aria-live="polite">
        <span>{atual.legenda}</span>
        <span className="pilha__dica">
          {fotos.indexOf(atual) + 1} de {fotos.length}, toque para passar
        </span>
      </figcaption>
    </figure>
  );
}
