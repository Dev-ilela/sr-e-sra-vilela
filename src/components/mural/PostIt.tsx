import type { CSSProperties } from "react";
import { ehSticker, Sticker } from "@/components/mural/Stickers";
import type { CorPostIt } from "@/lib/recados";

export type DadosPostIt = {
  mensagem: string;
  nome: string;
  cor: CorPostIt;
  sticker?: string | null;
};

type Props = DadosPostIt & {
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
  inclinacao = 0,
  alfinete = "rose",
  pendente = false,
  tamanho = "normal",
  className = "",
  style,
}: Props) {
  return (
    <article
      className={`postit postit--${cor} postit--${tamanho} ${tamanhoDoTexto(mensagem)} ${pendente ? "postit--pendente" : ""} ${ehSticker(sticker) ? "postit--com-sticker" : ""} ${className}`}
      style={{ "--incl": `${inclinacao}deg`, ...style } as CSSProperties}
    >
      {alfinete && <span className={`postit__alfinete postit__alfinete--${alfinete}`} aria-hidden="true" />}
      <p className="postit__texto">{mensagem}</p>
      <p className="postit__nome">– {nome}</p>
      {ehSticker(sticker) && <Sticker id={sticker} className="postit__sticker" />}
      {pendente && <span className="postit__selo">aguardando os noivos</span>}
    </article>
  );
}
