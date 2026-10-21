"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { PostIt } from "@/components/mural/PostIt";
import { STICKERS, Sticker } from "@/components/mural/Stickers";
import type { Recado } from "@/lib/recados";
import { entrar, moderar, type Status } from "./acoes";

export function FormularioEntrar() {
  const [erro, acao] = useActionState(entrar, null);
  return (
    <form action={acao} className="noivos__entrar">
      <p className="noivos__chapeu">Área dos noivos</p>
      <h1 className="noivos__titulo">Mural de post-its</h1>
      <label className="noivos__campo">
        <span>Senha</span>
        <input type="password" name="senha" autoComplete="current-password" required autoFocus />
      </label>
      {erro && (
        <p className="noivos__erro" role="alert">
          {erro}
        </p>
      )}
      <Enviar className="botao">Entrar</Enviar>
    </form>
  );
}

function Enviar({ children, className, name, value }: { children: React.ReactNode; className: string; name?: string; value?: string }) {
  const { pending, data } = useFormStatus();
  const esteBotao = !name || data?.get(name) === value;
  return (
    <button type="submit" className={className} name={name} value={value} disabled={pending}>
      {pending && esteBotao ? "Salvando..." : children}
    </button>
  );
}

const RESPOSTAS_RAPIDAS = [
  "Que lindo! Amamos vocês.",
  "Obrigado pelo carinho! Ficamos muito felizes.",
  "Que Deus te abençoe também!",
  "Contamos com sua oração por nós!",
];

const BOTOES: Record<Status, { status: Status; rotulo: string; classe: string }[]> = {
  pendente: [
    { status: "recusado", rotulo: "Reprovar", classe: "noivos__reprovar" },
    { status: "aprovado", rotulo: "Aprovar e colar no mural", classe: "botao botao--rose" },
  ],
  aprovado: [
    { status: "recusado", rotulo: "Tirar do mural", classe: "noivos__reprovar" },
    { status: "aprovado", rotulo: "Salvar resposta", classe: "botao" },
  ],
  recusado: [
    { status: "pendente", rotulo: "Voltar para pendentes", classe: "noivos__reprovar" },
    { status: "aprovado", rotulo: "Aprovar mesmo assim", classe: "botao botao--rose" },
  ],
};

function quando(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

/** Um post-it para moderar: texto, quem, quando, resposta, sticker e os botões. */
export function CartaoModeracao({ recado, aba }: { recado: Recado; aba: Status }) {
  const [resposta, setResposta] = useState(recado.resposta ?? "");
  const [sticker, setSticker] = useState(recado.sticker ?? "coracao");

  return (
    <li className="noivos__cartao">
      <div className="noivos__previa postit-caixa">
        <PostIt {...recado} sticker={sticker || null} tamanho="grande" alfinete={null} inclinacao={-1.5} />
      </div>

      <form action={moderar} className="noivos__form">
        <input type="hidden" name="id" value={recado.id} />
        <p className="noivos__quem">
          <strong>{recado.nome}</strong> · {quando(recado.created_at)}
        </p>
        <p className="noivos__mensagem">{recado.mensagem}</p>

        <label className="noivos__campo">
          <span>Nossa resposta (aparece pra pessoa e no post-it aberto)</span>
          <textarea name="resposta" rows={2} maxLength={200} value={resposta} onChange={(e) => setResposta(e.target.value)} />
        </label>
        <div className="noivos__rapidas">
          {RESPOSTAS_RAPIDAS.map((r) => (
            <button key={r} type="button" onClick={() => setResposta(r)}>
              {r}
            </button>
          ))}
        </div>

        <fieldset className="noivos__stickers">
          <legend>Sticker de presente</legend>
          <label className="noivos__sticker noivos__sticker--nenhum" title="Sem sticker">
            <input type="radio" name="sticker" value="" checked={sticker === ""} onChange={() => setSticker("")} />
            <span>nenhum</span>
          </label>
          {STICKERS.map((s) => (
            <label key={s.id} className="noivos__sticker" title={s.nome}>
              <input type="radio" name="sticker" value={s.id} checked={sticker === s.id} onChange={() => setSticker(s.id)} />
              <Sticker id={s.id} />
            </label>
          ))}
        </fieldset>

        <div className="noivos__botoes">
          {BOTOES[aba].map((b) => (
            <Enviar key={b.status + b.rotulo} className={b.classe} name="status" value={b.status}>
              {b.rotulo}
            </Enviar>
          ))}
        </div>
      </form>
    </li>
  );
}
