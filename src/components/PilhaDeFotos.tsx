"use client";

import { useRef, useState } from "react";

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

/** Quanto arrastar (px) para contar como troca de foto. */
const LIMIAR_ARRASTO = 50;

/**
 * Pilha de polaroids.
 * Avança: tocar no lado direito, arrastar para a esquerda ou seta →.
 * Volta: tocar no lado esquerdo, arrastar para a direita ou seta ←.
 * Avançar e voltar animam do mesmo jeito, só que espelhados: a foto do centro desliza
 * para um lado e a do outro lado vem para o centro, crescendo e ganhando foco.
 */
export function PilhaDeFotos({ fotos }: { fotos: Foto[] }) {
  const [ordem, setOrdem] = useState(() => fotos.map((_, i) => i));
  const [arrasto, setArrasto] = useState(0);
  const inicioArrasto = useRef<number | null>(null);

  const avancar = () => setOrdem((o) => [...o.slice(1), o[0]]);

  const voltar = () => setOrdem((o) => [o[o.length - 1], ...o.slice(0, -1)]);

  const soltar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inicioArrasto.current === null) return;
    const dx = e.clientX - inicioArrasto.current;
    inicioArrasto.current = null;
    setArrasto(0);

    if (Math.abs(dx) >= LIMIAR_ARRASTO) {
      // Como virar páginas: puxar para a esquerda traz a próxima, para a direita traz a anterior.
      if (dx < 0) avancar();
      else voltar();
      return;
    }
    // Foi um toque: o lado da mesa decide a direção.
    const mesa = e.currentTarget.getBoundingClientRect();
    if (e.clientX >= mesa.left + mesa.width / 2) avancar();
    else voltar();
  };

  const atual = ordem[0];

  return (
    <figure className="pilha">
      <div
        className={`pilha__mesa ${arrasto !== 0 ? "pilha__mesa--arrastando" : ""}`}
        role="group"
        aria-roledescription="galeria"
        aria-label={`Foto ${atual + 1} de ${fotos.length}: ${fotos[atual].alt}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") avancar();
          if (e.key === "ArrowLeft") voltar();
        }}
        onPointerDown={(e) => {
          inicioArrasto.current = e.clientX;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (inicioArrasto.current !== null) setArrasto(e.clientX - inicioArrasto.current);
        }}
        onPointerUp={soltar}
        onPointerCancel={() => {
          inicioArrasto.current = null;
          setArrasto(0);
        }}
      >
        {fotos.map((foto, i) => {
          const pos = ordem.indexOf(i);
          const lugar = lugarDe(pos, fotos.length);
          const classe = `polaroid polaroid--${lugar}`;
          // Enquanto arrasta, a foto do centro acompanha o dedo, inclinando de leve.
          const estilo =
            pos === 0 && arrasto !== 0
              ? { transform: `translateX(${arrasto}px) rotate(${arrasto / 30}deg)` }
              : undefined;
          return (
            <span key={foto.src} className={classe} style={estilo} aria-hidden={pos !== 0}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.src} alt="" draggable={false} loading={lugar === "atras" ? "lazy" : "eager"} />
              <span className="polaroid__legenda">{foto.legenda}</span>
            </span>
          );
        })}
      </div>
      <figcaption className="pilha__dica" aria-live="polite">
        {atual + 1} de {fotos.length}. Arraste ou toque nos lados para passar.
      </figcaption>
    </figure>
  );
}
