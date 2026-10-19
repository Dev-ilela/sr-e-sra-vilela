"use client";

import { useRef, useState } from "react";
import { emReais, type Presente } from "@/lib/presentes";

type Props = {
  presente: Presente;
  /** Pix copia e cola já com o valor do presente. */
  copiaECola: string;
  /** QR Code do mesmo Pix, em SVG gerado no servidor. */
  qrSvg: string;
};

type Envio = "parado" | "enviando" | "enviado" | "erro";

/**
 * Presente via Pix: o card abre um diálogo com o QR Code e o copia e cola.
 * O convidado pode deixar o nome e um recado para a gente saber quem mandou;
 * isso só registra a intenção, o site não tem como confirmar o pagamento.
 */
export function PresentePix({ presente, copiaECola, qrSvg }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [copiado, setCopiado] = useState(false);
  const [envio, setEnvio] = useState<Envio>("parado");

  const abrir = () => dialogo.current?.showModal();
  const fechar = () => dialogo.current?.close();

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(copiaECola);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sem permissão de área de transferência: seleciona o texto para copiar na mão.
      const campo = dialogo.current?.querySelector<HTMLTextAreaElement>(".pix__codigo");
      campo?.select();
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
          presente_id: presente.id,
          nome_convidado: String(dados.get("nome") ?? "").trim(),
          mensagem: String(dados.get("mensagem") ?? "").trim() || null,
          valor: presente.valor,
        }),
      });
      setEnvio(resposta.ok ? "enviado" : "erro");
    } catch {
      setEnvio("erro");
    }
  };

  return (
    <li className="presente presente--pix">
      <div className="presente__foto presente__foto--pix">
        {presente.imagem_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={presente.imagem_url} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="presente__selo" aria-hidden="true">
            Pix
          </span>
        )}
      </div>
      <h3 className="presente__nome">{presente.nome}</h3>
      {presente.descricao && <p className="presente__descricao">{presente.descricao}</p>}
      <p className="presente__valor">{emReais(presente.valor)}</p>
      <button type="button" className="botao presente__botao" onClick={abrir}>
        Presentear via Pix
      </button>

      <dialog
        ref={dialogo}
        className="pix"
        aria-labelledby={`pix-${presente.id}`}
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

          <h3 id={`pix-${presente.id}`} className="pix__titulo">
            {presente.nome}
          </h3>
          <p className="pix__valor">{emReais(presente.valor)}</p>

          {/* SVG gerado no nosso servidor a partir do código Pix, não vem de fora. */}
          <div className="pix__qr" role="img" aria-label="QR Code do Pix" dangerouslySetInnerHTML={{ __html: qrSvg }} />

          <p className="pix__dica">Aponte a câmera do app do banco, ou copie o código:</p>
          <textarea className="pix__codigo" readOnly rows={3} value={copiaECola} aria-label="Pix copia e cola" />
          <button type="button" className="botao pix__copiar" onClick={copiar}>
            {copiado ? "Copiado!" : "Copiar código Pix"}
          </button>

          {envio === "enviado" ? (
            <p className="pix__obrigado">Recebemos seu recado. Obrigado pelo carinho!</p>
          ) : (
            <form className="pix__form" onSubmit={avisar}>
              <p className="pix__form-titulo">Conta pra gente quem mandou?</p>
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
    </li>
  );
}
