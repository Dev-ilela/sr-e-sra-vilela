import Link from "next/link";
import { PostIt } from "@/components/mural/PostIt";
import { buscarRecados, corDoAlfinete, POST_IT_DOS_NOIVOS } from "@/lib/recados";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";

/** Bloco na home: o post-it dos noivos bem grande e os últimos que chegaram no mural. */
export async function ChamadaMural() {
  const ultimos = (await buscarRecados(3)) ?? [];

  return (
    <section className="vitrine" aria-labelledby="vitrine-titulo">
      <div className="vitrine__nosso postit-caixa">
        <PostIt {...POST_IT_DOS_NOIVOS} semente={POST_IT_DOS_NOIVOS.id} inclinacao={-4} alfinete="ouro" tamanho="grande" />
      </div>

      <div className="vitrine__texto">
        <p className="vitrine__chapeu">Pros noivos</p>
        <h2 id="vitrine-titulo" className="vitrine__titulo">
          Mural de <PalavraPostIt plural />
        </h2>
        <p className="vitrine__convite">
          Indo ao casamento ou acompanhando de longe, deixa um recadinho pra gente. Cada <PalavraPostIt /> fica colado no nosso
          mural, à vista de todo mundo.
        </p>

        {ultimos.length > 0 && (
          <Link href="/mural" className="vitrine__ultimos" aria-label="Ver os últimos post-its no mural">
            {ultimos.map((r, i) => (
              <span key={r.id} className="vitrine__mini postit-caixa" style={{ zIndex: 3 - i }}>
                <PostIt {...r} sticker={null} tamanho="mini" inclinacao={[-6, 3, 8][i]} alfinete={corDoAlfinete(r.id)} />
              </span>
            ))}
          </Link>
        )}

        <div className="vitrine__acoes">
          <Link href="/mural" className="botao botao--rose">
            Ir pro mural
          </Link>
          <Link href="/mural?escrever=1" className="vitrine__escrever">
            Escrever o meu
          </Link>
        </div>
      </div>
    </section>
  );
}
