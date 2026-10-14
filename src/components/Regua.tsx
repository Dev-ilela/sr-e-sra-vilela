"use client";

import { useEffect, useState } from "react";

export type Marco = { data: string; titulo: string };

/** "26.11.2021" → Date (meio-dia, para não escorregar de dia por fuso). */
function lerData(d: string) {
  const [dia, mes, ano] = d.split(".").map(Number);
  return new Date(ano, mes - 1, dia, 12);
}

/**
 * Régua do tempo: cada marco fica na posição proporcional à sua data,
 * com traços por mês, traços maiores por ano e um marcador de "hoje".
 */
export function Regua({ marcos }: { marcos: Marco[] }) {
  const inicio = lerData(marcos[0].data).getTime();
  const fim = lerData(marcos[marcos.length - 1].data).getTime();
  const posicao = (t: number) => Math.min(1, Math.max(0, (t - inicio) / (fim - inicio)));

  const primeiroAno = new Date(inicio).getFullYear();
  const ultimoAno = new Date(fim).getFullYear();

  const meses: { p: number; ano?: number }[] = [];
  for (let a = primeiroAno; a <= ultimoAno; a++) {
    for (let m = 0; m < 12; m++) {
      const t = new Date(a, m, 1).getTime();
      if (t < inicio || t > fim) continue;
      meses.push({ p: posicao(t), ano: m === 0 ? a : undefined });
    }
  }

  // "Hoje" só é calculado no navegador, para não ficar preso à data do build.
  const [hoje, setHoje] = useState<number | null>(null);
  useEffect(() => {
    setHoje(Math.min(1, Math.max(0, (Date.now() - inicio) / (fim - inicio))));
  }, [inicio, fim]);

  return (
    <div className="regua" role="list" aria-label="Nossa linha do tempo">
      <div className="regua__trilho" aria-hidden="true">
        {hoje !== null && <span className="regua__andado" style={{ "--p": hoje } as React.CSSProperties} />}
        {meses.map((m, i) => (
          <span
            key={i}
            className={m.ano ? "regua__traco regua__traco--ano" : "regua__traco"}
            style={{ "--p": m.p } as React.CSSProperties}
          >
            {m.ano && <span className="regua__ano">{m.ano}</span>}
          </span>
        ))}
        {hoje !== null && hoje < 1 && (
          <span className="regua__hoje" style={{ "--p": hoje } as React.CSSProperties}>
            hoje
          </span>
        )}
      </div>

      {marcos.map((m, i) => (
        <div
          key={m.data}
          role="listitem"
          className={`regua__marco regua__marco--${i % 2 === 0 ? "cima" : "baixo"} ${
            i === marcos.length - 1 ? "regua__marco--fim" : ""
          }`}
          style={{ "--p": posicao(lerData(m.data).getTime()) } as React.CSSProperties}
        >
          <span className="regua__data">{m.data}</span>
          <span className="regua__titulo">{m.titulo}</span>
        </div>
      ))}
    </div>
  );
}
