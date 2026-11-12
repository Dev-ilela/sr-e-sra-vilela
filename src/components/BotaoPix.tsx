"use client";

import { useRef, useState } from "react";
import { emReais } from "@/lib/formato";
import { FormularioAviso } from "@/components/presentes/FormularioAviso";

export type DadosPix = {
  /** Pix copia e cola (com o valor do presente, ou sem valor na contribuição livre). */
  copiaECola: string;
  /** QR Code do mesmo Pix, em SVG gerado no nosso servidor. */
  qrSvg: string;
  /** Chave e titular, mostrados para quem prefere digitar no app do banco. */
  chave: string;
  titular: string;
};

type Props = {
  titulo: string;
  valor: number | null;
  presenteId: string | null;
  pix: DadosPix;
  rotulo: string;
  variante: "rose" | "texto";
};

/**
 * Botão que abre a telinha do Pix: QR Code, copia e cola, a chave e um campo opcional
 * para o convidado avisar que mandou. O aviso só aparece na lista depois que os noivos
 * conferem o Pix e confirmam.
 */
export function BotaoPix({ titulo, valor, presenteId, pix, rotulo, variante }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [copiado, setCopiado] = useState<"codigo" | "chave" | null>(null);

  const abrir = () => dialogo.current?.showModal();
  const fechar = () => dialogo.current?.close();

  const copiar = async (texto: string, qual: "codigo" | "chave") => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(qual);
      setTimeout(() => setCopiado(null), 2500);
    } catch {
      // Sem permissão de área de transferência: seleciona o código para copiar na mão.
      dialogo.current?.querySelector<HTMLTextAreaElement>(".pix__codigo")?.select();
    }
  };

  const idTitulo = `pix-${presenteId ?? "livre"}`;

  return (
    <>
      <button
        type="button"
        className={variante === "rose" ? "botao botao--rose presente__botao" : "presente__pix"}
        onClick={abrir}
      >
        {rotulo}
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

          <p className="pix__chapeu">Presentear via Pix</p>
          <h3 id={idTitulo} className="pix__titulo">
            {titulo}
          </h3>
          <p className="pix__valor">{valor ? emReais(valor) : "Você escolhe o valor no app do banco"}</p>

          {/* SVG gerado no nosso servidor a partir do código Pix, não vem de fora. */}
          <div className="pix__qr" role="img" aria-label="QR Code do Pix" dangerouslySetInnerHTML={{ __html: pix.qrSvg }} />

          <p className="pix__dica">Aponte a câmera do app do banco, ou copie o código:</p>
          <textarea className="pix__codigo" readOnly rows={3} value={pix.copiaECola} aria-label="Pix copia e cola" />
          <button type="button" className="botao pix__copiar" onClick={() => copiar(pix.copiaECola, "codigo")}>
            {copiado === "codigo" ? "Copiado!" : "Copiar código Pix"}
          </button>

          <p className="pix__chave">
            Ou use a chave <strong>{pix.chave}</strong>{" "}
            <button type="button" className="pix__chave-copiar" onClick={() => copiar(pix.chave, "chave")}>
              {copiado === "chave" ? "copiada" : "copiar"}
            </button>
          </p>

          <FormularioAviso
            presenteId={presenteId}
            forma="pix"
            titulo="Já mandou? Conta pra gente quem foi"
            textoBotao="Avisar os noivos"
          />
        </div>
      </dialog>
    </>
  );
}
