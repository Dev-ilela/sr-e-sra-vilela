import type { Metadata } from "next";
import Link from "next/link";
import { Quadro } from "@/components/mural/Quadro";
import { casamento } from "@/config/casamento";
import { buscarRecados } from "@/lib/recados";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";

// Busca o banco de novo a cada minuto; aprovar um post-it também atualiza na hora.
export const revalidate = 60;

export const metadata: Metadata = {
  title: `Mural de post-its - ${casamento.noivo} & ${casamento.noiva}`,
  description: "Deixe um post-it de carinho pros noivos. O mural é nosso, mas é de todo mundo.",
  alternates: { canonical: "/mural" },
};

export default async function Mural() {
  const recados = (await buscarRecados()) ?? [];

  return (
    <main className="mural">
      <header className="lista__topo">
        <div className="lista__topo-conteudo">
          <Link href="/" className="lista__voltar">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
            {casamento.noivo} e {casamento.noiva}
          </Link>

          <p className="lista__chapeu">Pros noivos</p>
          <h1 className="lista__titulo">
            Mural de <PalavraPostIt plural />
          </h1>
          <div className="mural__intro">
            <p>
              Ei, se você está aqui, provavelmente nos conhece e já faz parte da nossa história. Que tal deixar essa
              marca registrada? Então <em>poste it</em>!
            </p>
            <p>
              Fique à vontade para colar uma mensagem de carinho nessa nossa jornada. O mural é nosso, mas é de todo
              mundo: todos podem ver e compartilhar.
            </p>
          </div>
          <p className="mural__vem">Vem pro mural!</p>
        </div>
      </header>

      <section className="mural__corpo" aria-label="Quadro de post-its">
        <Quadro recados={recados} />
      </section>
    </main>
  );
}
