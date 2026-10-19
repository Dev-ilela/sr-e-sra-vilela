import { emReais, type Presente } from "@/lib/presentes";

/** Presente da lista da Magalu: o botão abre a lista deles, onde o pagamento acontece. */
export function CartaoPresente({ presente }: { presente: Presente }) {
  return (
    <li className="presente">
      <div className="presente__foto">
        {presente.imagem_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={presente.imagem_url} alt="" loading="lazy" decoding="async" />
        )}
      </div>
      <h3 className="presente__nome">{presente.nome}</h3>
      {presente.descricao && <p className="presente__descricao">{presente.descricao}</p>}
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
    </li>
  );
}
