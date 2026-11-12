"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AliancaLisa, Solitario } from "@/components/aliancas/Aneis";
import { EVENTO_REVER, EVENTO_UNIR, ponteiro, useEstadoAliancas, type DetalheUnir } from "@/lib/aliancas";

/**
 * A aliança dele, perdida no canto direito entre os presentes da Magalu e os de Pix.
 * Com o solitário na mão, é só clicar nela (ou arrastar o solitário até ela, no celular).
 */
export function AliancaNoivo() {
  const estado = useEstadoAliancas();
  const botao = useRef<HTMLButtonElement>(null);
  const dica = useRef<HTMLDialogElement>(null);
  const [mostrarDica, setMostrarDica] = useState(false);

  const clicar = () => {
    const r = botao.current!.getBoundingClientRect();
    if (estado === "carregando") {
      const noiva = ponteiro.x > 0 ? { x: ponteiro.x, y: ponteiro.y } : { x: window.innerWidth - 48, y: window.innerHeight - 48 };
      window.dispatchEvent(new CustomEvent<DetalheUnir>(EVENTO_UNIR, { detail: { noivo: r, noiva } }));
    } else if (estado === "unidas") {
      window.dispatchEvent(new CustomEvent(EVENTO_REVER, { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
    } else {
      setMostrarDica(true);
      requestAnimationFrame(() => dica.current?.showModal());
    }
  };

  return (
    <div className={`alianca-perdida alianca-perdida--noivo ${estado === "unidas" ? "alianca-perdida--juntas" : ""}`}>
      <button
        ref={botao}
        type="button"
        data-alianca-noivo={estado === "carregando" ? "" : undefined}
        className={`alianca-perdida__botao ${estado === "carregando" ? "alianca-perdida__botao--esperando" : ""} ${estado === "unidas" ? "alianca-perdida__botao--par" : ""}`}
        onClick={clicar}
        aria-label={estado === "carregando" ? "Aliança do noivo: entregar o solitário" : estado === "unidas" ? "As alianças juntas: ver de novo" : "Uma aliança perdida por aqui"}
      >
        <AliancaLisa className="alianca-perdida__anel alianca-perdida__anel--lisa" />
        {estado === "unidas" && <Solitario className="alianca-perdida__anel" />}
      </button>

      {mostrarDica && (
        <dialog
          ref={dica}
          className="pix"
          aria-labelledby="noivo-dica"
          onClose={() => setMostrarDica(false)}
          onClick={(e) => e.target === e.currentTarget && dica.current?.close()}
        >
          <div className="pix__caixa encontro-dica">
            <AliancaLisa className="encontro-dica__anel" />
            <h3 id="noivo-dica" className="pix__titulo">
              Opa, achou a aliança do noivo!
            </h3>
            <p className="pix__dica">Mas ela está sozinha... O solitário da noiva caiu por aí, lá na página inicial. Traz ele até aqui?</p>
            <div className="encontro__acoes">
              <Link href="/#alianca-dela" className="botao botao--rose" onClick={() => dica.current?.close()}>
                Ir procurar
              </Link>
              <button type="button" className="encontro__depois encontro__depois--claro" onClick={() => dica.current?.close()}>
                Agora não
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
