"use client";

import { useRef } from "react";
import { FormularioAviso } from "@/components/presentes/FormularioAviso";

/** Link discreto no card da Magalu: "Já comprou? Avise a gente", que abre o formulário. */
export function BotaoAvisar({ presenteId, titulo }: { presenteId: string; titulo: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const fechar = () => dialogo.current?.close();
  const idTitulo = `avisar-${presenteId}`;

  return (
    <>
      <button type="button" className="presente__avisar" onClick={() => dialogo.current?.showModal()}>
        Já comprou? Avise a gente
      </button>

      <dialog
        ref={dialogo}
        className="pix"
        aria-labelledby={idTitulo}
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
      >
        <div className="pix__caixa">
          <button type="button" className="pix__fechar" onClick={fechar} aria-label="Fechar">
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="pix__chapeu">Presente comprado</p>
          <h3 id={idTitulo} className="pix__titulo">
            {titulo}
          </h3>
          <p className="pix__dica">
            Conta pra gente quem presenteou. Quando o presente chegar, a gente confirma e ele aparece como dado na lista.
          </p>
          <FormularioAviso presenteId={presenteId} forma="objeto" titulo="Quem está presenteando?" textoBotao="Avisar os noivos" />
        </div>
      </dialog>
    </>
  );
}
