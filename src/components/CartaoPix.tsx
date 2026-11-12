import { BotaoPix, type DadosPix } from "@/components/BotaoPix";
import { StickerPresente } from "@/components/presentes/StickersPresentes";
import { emReais } from "@/lib/formato";
import { quemPresenteou, type Doacao } from "@/lib/presentes";

type Props = {
  titulo: string;
  descricao: string | null;
  /** Nulo na contribuição livre. */
  valor: number | null;
  presenteId: string | null;
  sticker: string | null;
  pix: DadosPix;
  /** Pix pode ser dado por várias pessoas: o card segue aberto e mostra quem já deu. */
  doacoes: Doacao[];
};

/** Presente que é só Pix (momentos da lua de mel, ajuda para a casa, valor livre). */
export function CartaoPix({ titulo, descricao, valor, presenteId, sticker, pix, doacoes }: Props) {
  const ultimo = [...doacoes].reverse().find((d) => d.agradecimento);
  return (
    <li className={`presente presente--pix ${valor ? "" : "presente--livre"} ${doacoes.length ? "presente--com-doacao" : ""}`}>
      <span className="presente__filete" aria-hidden="true" />
      {doacoes.length > 0 && sticker && (
        <span className="presente__sticker presente__sticker--pix">
          <StickerPresente id={sticker} titulo={titulo} />
        </span>
      )}
      <h3 className="presente__nome presente__nome--pix">{titulo}</h3>
      {descricao && <p className="presente__descricao">{descricao}</p>}
      {doacoes.length > 0 && (
        <div className="presente__bilhete presente__bilhete--pix">
          <p className="presente__por">
            <span className="presente__contagem">{doacoes.length === 1 ? "Já presenteado" : `Presenteado ${doacoes.length}×`}</span>{" "}
            por <strong>{quemPresenteou(doacoes)}</strong>
          </p>
          {ultimo?.agradecimento && <p className="presente__obrigado">“{ultimo.agradecimento}”</p>}
        </div>
      )}
      <p className="presente__valor">{valor ? emReais(valor) : "Valor livre"}</p>
      <BotaoPix
        titulo={titulo}
        valor={valor}
        presenteId={presenteId}
        pix={pix}
        rotulo={valor ? "Presentear via Pix" : "Contribuir via Pix"}
        variante="rose"
      />
    </li>
  );
}
