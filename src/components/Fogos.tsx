"use client";

import { useEffect, useRef } from "react";

const CORES = ["#e2b3a3", "#f3d2c4", "#fafbfc", "#c2a15f", "#b97a74"];

type Faisca = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
  cor: string;
};

/**
 * Fogos discretos em rose gold, desenhados num canvas por cima do fundo.
 * Algumas explosões por alguns segundos e depois para — é um momento, não um efeito em loop.
 */
export function Fogos({ duracaoMs = 9000 }: { duracaoMs?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ajustar = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    window.addEventListener("resize", ajustar);

    const faiscas: Faisca[] = [];
    const explodir = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = w * (0.15 + Math.random() * 0.7);
      const y = h * (0.12 + Math.random() * 0.35);
      const cor = CORES[Math.floor(Math.random() * CORES.length)];
      const n = 70;
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n;
        const vel = 1.6 + Math.random() * 2.2;
        faiscas.push({ x, y, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel, vida: 1, cor });
      }
    };

    const inicio = performance.now();
    let proxima = inicio;
    let raf = 0;

    const quadro = (t: number) => {
      const ativo = t - inicio < duracaoMs;
      if (ativo && t >= proxima) {
        explodir();
        proxima = t + 500 + Math.random() * 700;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = faiscas.length - 1; i >= 0; i--) {
        const f = faiscas[i];
        f.vx *= 0.985;
        f.vy = f.vy * 0.985 + 0.025;
        f.x += f.vx;
        f.y += f.vy;
        f.vida -= 0.011;
        if (f.vida <= 0) {
          faiscas.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = f.vida;
        ctx.fillStyle = f.cor;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (ativo || faiscas.length) raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", ajustar);
    };
  }, [duracaoMs]);

  return <canvas ref={ref} className="fogos" aria-hidden="true" />;
}
