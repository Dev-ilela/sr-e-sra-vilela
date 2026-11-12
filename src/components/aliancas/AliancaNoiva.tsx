"use client";

import { useRef, useState } from "react";
import { AliancaLisa, Solitario } from "@/components/aliancas/Aneis";
import { animar } from "@/lib/animar";
import { EVENTO_REVER, mudarEstadoAliancas, ponteiro, semMouse, useEstadoAliancas } from "@/lib/aliancas";

const TAM_CENTRO = 150;

/**
 * O solitário dela, caído na linha entre as fotos e os presentes. Ao clicar, ele voa
 * para o meio da tela e pede ajuda para achar o par.
 */
export function AliancaNoiva() {
  const estado = useEstadoAliancas();
  const botao = useRef<HTMLButtonElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const voando = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);

  /** Transform que leva o anel do centro da tela até um ponto (e tamanho) da tela. */
  const ate = (x: number, y: number, tam: number, giro = 0) =>
    `translate(${x - window.innerWidth / 2}px, ${y - window.innerHeight / 2}px) scale(${tam / TAM_CENTRO}) rotate(${giro}deg)`;

  const deOnde = () => {
    const r = botao.current!.getBoundingClientRect();
    return ate(r.left + r.width / 2, r.top + r.height / 2, r.width, -24);
  };

  const abrir = () => {
    setAberto(true);
    requestAnimationFrame(() => {
      dialogo.current?.showModal();
      animar(dialogo.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 350 });
      animar(voando.current, [{ transform: deOnde() }, { transform: "translateY(-30px) scale(1.15) rotate(6deg)", offset: 0.7 }, { transform: "none" }], {
        duration: 850,
        easing: "cubic-bezier(.3,.8,.3,1)",
      });
      animar(dialogo.current?.querySelector(".encontro__texto"), [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
        duration: 450,
        delay: 650,
      });
    });
  };

  const fechar = async (pegou: boolean) => {
    const d = dialogo.current;
    animar(d?.querySelector(".encontro__texto"), [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
    if (pegou) {
      // Vai para a mão (cursor) ou para o bolsinho no canto (celular).
      const toque = semMouse();
      const x = toque ? window.innerWidth - 48 : ponteiro.x + 30;
      const y = toque ? window.innerHeight - 48 : ponteiro.y + 30;
      await animar(voando.current, [{ transform: "none" }, { transform: ate(x, y, toque ? 52 : 56, -14) }], {
        duration: 600,
        easing: "cubic-bezier(.5,0,.3,1)",
      });
      mudarEstadoAliancas("carregando");
    } else {
      await animar(voando.current, [{ transform: "none" }, { transform: deOnde() }], { duration: 650, easing: "cubic-bezier(.5,0,.3,1)" });
    }
    await animar(d, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
    d?.close();
    setAberto(false);
  };

  const rever = () => {
    const r = botao.current!.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent(EVENTO_REVER, { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
  };

  return (
    <div className="alianca-perdida alianca-perdida--noiva" id="alianca-dela">
      {estado === "perdidas" && (
        <button
          ref={botao}
          type="button"
          className="alianca-perdida__botao"
          onClick={abrir}
          style={{ visibility: aberto ? "hidden" : undefined }}
          aria-label="Um solitário caído por aqui"
        >
          <Solitario className="alianca-perdida__anel" />
        </button>
      )}

      {estado === "unidas" && (
        <button ref={botao} type="button" className="alianca-perdida__botao alianca-perdida__botao--par" onClick={rever} aria-label="As alianças juntas: ver de novo">
          <AliancaLisa className="alianca-perdida__anel alianca-perdida__anel--lisa" />
          <Solitario className="alianca-perdida__anel" />
        </button>
      )}

      {aberto && (
        <dialog ref={dialogo} className="encontro" aria-labelledby="encontro-titulo" onCancel={(e) => (e.preventDefault(), fechar(false))}>
          <div className="encontro__caixa">
            <div ref={voando} className="encontro__anel" style={{ width: TAM_CENTRO, height: TAM_CENTRO }}>
              <Solitario />
            </div>
            <div className="encontro__texto" style={{ opacity: 0 }}>
              <h2 id="encontro-titulo" className="encontro__titulo">
                Encontre meu par
              </h2>
              <p className="encontro__sub">Ele deve estar por aí em algum lugar...</p>
              <div className="encontro__acoes">
                <button type="button" className="botao botao--rose" onClick={() => fechar(true)} autoFocus>
                  Ok, deixa comigo
                </button>
                <button type="button" className="encontro__depois" onClick={() => fechar(false)}>
                  Procurar depois
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
