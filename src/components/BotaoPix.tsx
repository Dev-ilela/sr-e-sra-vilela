"use client";

import { useRef, useState } from "react";
import { emReais } from "@/lib/formato";

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

type Envio = "parado" | "enviando" | "enviado" | "erro";

/**
 * Botão que abre a telinha do Pix: QR Code, copia e cola, a chave e um campo opcional
 * para o convidado deixar nome e recado. O recado só registra a intenção; o site não
 * tem como confirmar o pagamento.
 */
export function BotaoPix({ titulo, valor, presenteId, pix, rotulo, variante }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [copiado, setCopiado] = useState<"codigo" | "chave" | null>(null);
  const [envio, setEnvio] = useState<Envio>("parado");

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

  const avisar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !chave) {
      setEnvio("erro");
      return;
    }

    setEnvio("enviando");
    try {
      const resposta = await fetch(`${url}/rest/v1/contribuicoes_pix`, {
        method: "POST",
        headers: {
          apikey: chave,
          "Content-Type": "application/json",
          // O convidado não pode ler a tabela, então não pedimos a linha de volta.
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          presente_id: presenteId,
          nome_convidado: String(dados.get("nome") ?? "").trim(),
          mensagem: String(dados.get("mensagem") ?? "").trim() || null,
          valor,
        }),
      });
      setEnvio(resposta.ok ? "enviado" : "erro");
    } catch {
      setEnvio("erro");
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
            <br />
            em nome de {pix.titular}
          </p>

          {envio === "enviado" ? (
            <p className="pix__obrigado">Recebemos seu recado. Obrigado por nos abençoar!</p>
          ) : (
            <form className="pix__form" onSubmit={avisar}>
              <p className="pix__form-titulo">Conta pra gente quem enviou?</p>
              <label className="pix__campo">
                <span>Seu nome</span>
                <input name="nome" required minLength={2} maxLength={120} autoComplete="name" />
              </label>
              <label className="pix__campo">
                <span>Recado para os noivos (opcional)</span>
                <textarea name="mensagem" rows={3} maxLength={1000} />
              </label>
              <button type="submit" className="botao botao--contorno" disabled={envio === "enviando"}>
                {envio === "enviando" ? "Enviando..." : "Avisar os noivos"}
              </button>
              {envio === "erro" && (
                <p className="pix__erro" role="alert">
                  Não deu para enviar agora. O Pix funciona do mesmo jeito; se puder, tente de novo mais tarde.
                </p>
              )}
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
