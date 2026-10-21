import type { CSSProperties } from "react";
import { ehSticker, Sticker } from "@/components/mural/Stickers";
import { posicaoDoSticker, type CorPostIt, type LadoDoSticker } from "@/lib/recados";

export type DadosPostIt = {
  mensagem: string;
  nome: string;
  cor: CorPostIt;
  sticker?: string | null;
  /** Força o lado do sticker (o dos noivos fica à esquerda). */
  ladoDoSticker?: LadoDoSticker;
};

type Props = DadosPostIt & {
  /** Base para sortear a posição do sticker (normalmente o id do post-it). */
  semente?: string;
  inclinacao?: number;
  alfinete?: "rose" | "ouro" | "marinho" | "salvia" | null;
  pendente?: boolean;
  tamanho?: "mini" | "normal" | "grande";
  className?: string;
  style?: CSSProperties;
};

function tamanhoDoTexto(mensagem: string) {
  if (mensagem.length > 200) return "postit--longo";
  if (mensagem.length > 120) return "postit--medio";
  if (mensagem.length < 60) return "postit--curto";
  return "";
}

/** O papelzinho: só aparência, sem comportamento. */
export function PostIt({
  mensagem,
  nome,
  cor,
  sticker,
  ladoDoSticker,
  semente,
  inclinacao = 0,
  alfinete = "rose",
  pendente = false,
  tamanho = "normal",
  className = "",
  style,
}: Props) {
  const temSticker = ehSticker(sticker);
  const pos = posicaoDoSticker(semente ?? mensagem, ladoDoSticker);

  return (
    <article
      className={`postit postit--${cor} postit--${tamanho} ${tamanhoDoTexto(mensagem)} ${pendente ? "postit--pendente" : ""} ${
        temSticker ? `postit--com-sticker postit--sticker-${pos.lado}` : ""
      } ${className}`}
      style={{ "--incl": `${inclinacao}deg`, ...style } as CSSProperties}
    >
      {alfinete && <span className={`postit__alfinete postit__alfinete--${alfinete}`} aria-hidden="true" />}
      <p className="postit__texto">{mensagem}</p>
      <p className="postit__nome">– {nome}</p>
      {temSticker && (
        <span
          className="postit__sticker"
          style={{ "--st-x": `${pos.x}%`, "--st-y": `${pos.y}%`, "--st-giro": `${pos.giro}deg` } as CSSProperties}
        >
          <Sticker id={sticker} />
        </span>
      )}
      {pendente && <span className="postit__selo">aguardando os noivos</span>}
    </article>
  );
}
