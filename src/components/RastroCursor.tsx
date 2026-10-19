"use client";

import { useEffect, useRef } from "react";

/** Quanto tempo (ms) cada pegada leva para sumir. */
const DURACAO = 900;
/** Distância (px) entre uma pegada e outra, para o rastro sair contínuo. */
const PASSO = 3;
/** Raio (px) de cada pegada. */
const RAIO = 11;
/** Opacidade de cada pegada recém-feita. Somadas, dão uma sombra bem leve. */
const FORCA = 0.05;

type Pegada = { x: number; y: number; t: number };

/**
 * "Pegada" do mouse: por onde o cursor passa, o fundo escurece de leve e volta ao normal.
 * O canvas usa mix-blend-mode: multiply, então a marca acompanha a cor de baixo
 * (cinza no fundo claro, azul mais fundo no marinho).
 * Só roda em computador com mouse e quando a pessoa não pediu menos movimento.
 */
export function RastroCursor() {
  const tela = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!comMouse.matches || semMovimento.matches) return;

    const canvas = tela.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pegadas: Pegada[] = [];
    let ultima: { x: number; y: number } | null = null;
    let quadro = 0;

    const ajustarTamanho = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const desenhar = () => {
      const agora = performance.now();
      while (pegadas.length && agora - pegadas[0].t > DURACAO) pegadas.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of pegadas) {
        const vida = 1 - (agora - p.t) / DURACAO;
        if (vida <= 0) continue;
        // Pegada redonda e de borda macia: some aos poucos e encolhe um pouco.
        const raio = RAIO * (0.6 + 0.4 * vida);
        const sombra = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, raio);
        sombra.addColorStop(0, `rgba(6, 10, 22, ${FORCA * vida})`);
        sombra.addColorStop(1, "rgba(6, 10, 22, 0)");
        ctx.fillStyle = sombra;
        ctx.beginPath();
        ctx.arc(p.x, p.y, raio, 0, Math.PI * 2);
        ctx.fill();
      }

      // Só continua animando enquanto houver pegada na tela.
      quadro = pegadas.length ? requestAnimationFrame(desenhar) : 0;
    };

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const agora = performance.now();
      const x = e.clientX;
      const y = e.clientY;

      // Preenche o caminho entre um evento e outro, para não sobrar buraco nem ponto solto.
      if (ultima) {
        const dist = Math.hypot(x - ultima.x, y - ultima.y);
        const passos = Math.min(Math.floor(dist / PASSO), 60);
        for (let i = 1; i <= passos; i++) {
          const k = i / (passos + 1);
          pegadas.push({ x: ultima.x + (x - ultima.x) * k, y: ultima.y + (y - ultima.y) * k, t: agora });
        }
      }
      pegadas.push({ x, y, t: agora });
      ultima = { x, y };

      if (!quadro) quadro = requestAnimationFrame(desenhar);
    };

    const sair = () => {
      ultima = null;
    };

    ajustarTamanho();
    window.addEventListener("resize", ajustarTamanho);
    window.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerleave", sair);
    return () => {
      window.removeEventListener("resize", ajustarTamanho);
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", sair);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return <canvas ref={tela} className="rastro" aria-hidden="true" />;
}
