import { BotaoPix, type DadosPix } from "@/components/BotaoPix";
import { emReais } from "@/lib/formato";

type Props = {
  titulo: string;
  descricao: string | null;
  /** Nulo na contribuição livre. */
  valor: number | null;
  presenteId: string | null;
  pix: DadosPix;
};

/** Presente que é só Pix (momentos da lua de mel, ajuda para a casa, valor livre). */
export function CartaoPix({ titulo, descricao, valor, presenteId, pix }: Props) {
  return (
    <li className={`presente presente--pix ${valor ? "" : "presente--livre"}`}>
      <span className="presente__filete" aria-hidden="true" />
      <h3 className="presente__nome presente__nome--pix">{titulo}</h3>
      {descricao && <p className="presente__descricao">{descricao}</p>}
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
