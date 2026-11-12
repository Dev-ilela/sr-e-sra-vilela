"use client";

import { useRef } from "react";
import { AliancaLisa, Solitario } from "@/components/aliancas/Aneis";
import { EVENTO_REVER, useEstadoAliancas } from "@/lib/aliancas";

/**
 * Depois que a brincadeira termina, as duas alianças ganham um cantinho só delas na lista,
 * entre a casa nova e os Pix. Clicar nelas mostra a cerimônia de novo.
 */
export function AliancasJuntas() {
  const estado = useEstadoAliancas();
  const par = useRef<HTMLButtonElement>(null);
  if (estado !== "unidas") return null;

  const rever = () => {
    const r = par.current!.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent(EVENTO_REVER, { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
  };

  return (
    <section className="aliancas-juntas" aria-label="As alianças juntas">
      <button ref={par} type="button" className="aliancas-juntas__par" onClick={rever} aria-label="Ver as alianças se encontrando de novo">
        <AliancaLisa className="aliancas-juntas__lisa" />
        <Solitario className="aliancas-juntas__solitaria" />
      </button>
      <div className="aliancas-juntas__texto">
        <p className="aliancas-juntas__frase">Juntinhas, do jeito que tem que ser.</p>
        <p className="aliancas-juntas__versiculo">O amor é o elo perfeito · Colossenses 3:14</p>
      </div>
    </section>
  );
}
