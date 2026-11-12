"use client";

import { useState } from "react";

type Envio = "parado" | "enviando" | "enviado" | "erro";

type Props = {
  presenteId: string | null;
  forma: "pix" | "objeto";
  titulo: string;
  textoBotao: string;
};

/**
 * Formulário em que o convidado conta que presenteou. Entra como pendente; os noivos
 * conferem se o Pix ou o objeto chegou, confirmam e aí o presente aparece como dado.
 */
export function FormularioAviso({ presenteId, forma, titulo, textoBotao }: Props) {
  const [envio, setEnvio] = useState<Envio>("parado");

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
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
      const resposta = await fetch(`${url}/rest/v1/doacoes`, {
        method: "POST",
        headers: {
          apikey: chave,
          "Content-Type": "application/json",
          // O convidado não lê a tabela, então não pedimos a linha de volta.
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          presente_id: presenteId,
          nome: String(dados.get("nome") ?? "").trim(),
          mensagem: String(dados.get("mensagem") ?? "").trim() || null,
          anonimo: dados.get("anonimo") === "on",
          forma,
        }),
      });
      setEnvio(resposta.ok ? "enviado" : "erro");
    } catch {
      setEnvio("erro");
    }
  };

  if (envio === "enviado") {
    return (
      <p className="pix__obrigado" role="status">
        Recebemos! Assim que a gente conferir, o presente aparece como dado aqui na lista. Obrigado por nos abençoar!
      </p>
    );
  }

  return (
    <form className="pix__form" onSubmit={enviar}>
      <p className="pix__form-titulo">{titulo}</p>
      <label className="pix__campo">
        <span>Seu nome</span>
        <input name="nome" required minLength={2} maxLength={60} autoComplete="name" />
      </label>
      <label className="pix__campo">
        <span>Recado para os noivos (opcional)</span>
        <textarea name="mensagem" rows={3} maxLength={280} />
      </label>
      <label className="pix__marcar">
        <input type="checkbox" name="anonimo" />
        <span>Não mostrar meu nome na lista</span>
      </label>
      <button type="submit" className="botao botao--contorno" disabled={envio === "enviando"}>
        {envio === "enviando" ? (
          <>
            <span className="carregando" aria-hidden="true" /> Enviando...
          </>
        ) : (
          textoBotao
        )}
      </button>
      {envio === "erro" && (
        <p className="pix__erro" role="alert">
          Não deu para enviar agora. Tente de novo daqui a pouco.
        </p>
      )}
    </form>
  );
}
