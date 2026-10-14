"use client";

import { useState } from "react";

export type Foto = { src: string; alt: string; legenda: string };

type Lugar = "centro" | "direita" | "esquerda" | "atras";

/**
 * Lugar de cada polaroid na mesa, pela posição na fila:
 * a primeira fica no centro, a próxima espera à direita,
 * a última (a que acabou de passar) fica à esquerda e o resto atrás.
 */
function lugarDe(pos: number, total: number): Lugar {
  if (pos === 0) return "centro";
  if (pos === 1) return "direita";
  if (pos === total - 1) return "esquerda";
  return "atras";
}

const ERGUER_MS = 260;

/**
 * Pilha de polaroids. Ao tocar, a de cima é erguida e vai para o fim da pilha,
 * e a próxima vem do lado para o centro, crescendo e ganhando foco.
 */
export function PilhaDeFotos({ fotos }: { fotos: Foto[] }) {
  const [ordem, setOrdem] = useState(() => fotos.map((_, i) => i));
  const [erguendo, setErguendo] = useState(false);

  const passar = () => {
    if (erguendo) return;
    setErguendo(true);
    window.setTimeout(() => {
      setOrdem((o) => [...o.slice(1), o[0]]);
      setErguendo(false);
    }, ERGUER_MS);
  };

  const atual = ordem[0];

  return (
    <figure className="pilha">
      <button
        type="button"
        className="pilha__mesa"
        onClick={passar}
        aria-label={`Foto ${atual + 1} de ${fotos.length}: ${fotos[atual].alt}. Toque para ver a próxima.`}
      >
        {fotos.map((foto, i) => {
          const pos = ordem.indexOf(i);
          const lugar = lugarDe(pos, fotos.length);
          const classe = [
            "polaroid",
            `polaroid--${lugar}`,
            erguendo && pos === 0 ? "polaroid--erguida" : "",
          ].join(" ");
          return (
            <span key={foto.src} className={classe} aria-hidden={pos !== 0}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.src} alt="" loading={lugar === "atras" ? "lazy" : "eager"} />
              <span className="polaroid__legenda">{foto.legenda}</span>
            </span>
          );
        })}
      </button>
      <figcaption className="pilha__dica" aria-live="polite">
        {atual + 1} de {fotos.length}. Toque na foto para passar.
      </figcaption>
    </figure>
  );
}
