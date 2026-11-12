import { BotaoPix, type DadosPix } from "@/components/BotaoPix";
import { BotaoAvisar } from "@/components/presentes/BotaoAvisar";
import { Agradecimento, CheckDoado, StickerColado } from "@/components/presentes/SeloDoado";
import { emReais } from "@/lib/formato";
import type { Doacao, Presente } from "@/lib/presentes";

type Props = {
  presente: Presente;
  /** Pix com o valor do item, para quem prefere mandar o dinheiro em vez de comprar. */
  pix: DadosPix | null;
  /** Doações confirmadas: com pelo menos uma, o item aparece como presenteado. */
  doacoes: Doacao[];
};

/** Presente da lista da Magalu: o botão abre a lista deles, onde o pagamento acontece. */
export function CartaoPresente({ presente, pix, doacoes }: Props) {
  const doado = doacoes.length > 0;

  return (
    <li className={`presente ${doado ? "presente--doado" : ""}`}>
      <div className="presente__foto">
        {presente.imagem_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={presente.imagem_url} alt="" loading="lazy" decoding="async" />
        )}
        {doado && (
          <>
            <span className="presente__fita">
              <CheckDoado /> Presenteado
            </span>
            <StickerColado id={presente.sticker} nome={presente.nome} />
          </>
        )}
      </div>
      <h3 className="presente__nome">{presente.nome}</h3>
      {presente.descricao && <p className="presente__descricao">{presente.descricao}</p>}

      {doado ? (
        <Agradecimento doacoes={doacoes} />
      ) : (
        <>
          <p className="presente__valor">{emReais(presente.valor)}</p>
          {presente.link_url && (
            <a
              className="botao presente__botao"
              href={presente.link_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Presentear: ${presente.nome} (abre a lista na Magalu)`}
            >
              Presentear
            </a>
          )}
          {pix && (
            <BotaoPix
              titulo={presente.nome}
              valor={presente.valor}
              presenteId={presente.id}
              pix={pix}
              rotulo="ou enviar via Pix"
              variante="texto"
            />
          )}
          <BotaoAvisar presenteId={presente.id} titulo={presente.nome} />
        </>
      )}
    </li>
  );
}
