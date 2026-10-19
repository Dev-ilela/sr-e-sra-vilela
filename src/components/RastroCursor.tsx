"use client";

import { useEffect, useRef } from "react";

/** Quanto tempo (ms) cada ponto do rastro leva para sumir. */
const DURACAO = 520;

type Ponto = { x: number; y: number; t: number };

/**
 * Rastro fino em rose gold que segue o mouse e some sozinho.
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

    const pontos: Ponto[] = [];
    let quadro = 0;

    const ajustarTamanho = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const desenhar = () => {
      const agora = performance.now();
      while (pontos.length && agora - pontos[0].t > DURACAO) pontos.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Cada trecho fica mais fino e transparente quanto mais antigo.
      for (let i = 1; i < pontos.length; i++) {
        const a = pontos[i - 1];
        const b = pontos[i];
        const vida = 1 - (agora - b.t) / DURACAO;
        if (vida <= 0) continue;
        ctx.strokeStyle = `rgba(205, 148, 134, ${0.7 * vida})`;
        ctx.lineWidth = 0.6 + 2.2 * vida;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Só continua animando enquanto houver rastro na tela.
      quadro = pontos.length ? requestAnimationFrame(desenhar) : 0;
    };

    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pontos.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!quadro) quadro = requestAnimationFrame(desenhar);
    };

    ajustarTamanho();
    window.addEventListener("resize", ajustarTamanho);
    window.addEventListener("pointermove", mover, { passive: true });
    return () => {
      window.removeEventListener("resize", ajustarTamanho);
      window.removeEventListener("pointermove", mover);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return <canvas ref={tela} className="rastro" aria-hidden="true" />;
}
