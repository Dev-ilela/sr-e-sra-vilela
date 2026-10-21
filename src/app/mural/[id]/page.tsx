import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contador } from "@/components/Contador";
import { Compartilhar } from "@/components/mural/Compartilhar";
import { PostIt } from "@/components/mural/PostIt";
import { casamento } from "@/config/casamento";
import { buscarRecado } from "@/lib/recados";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recado = await buscarRecado(id);
  if (!recado) return { title: `Mural de post-its - ${casamento.noivo} & ${casamento.noiva}` };

  const titulo = `Um post-it de ${recado.nome} pro ${casamento.noivo} e a ${casamento.noiva}`;
  return {
    title: titulo,
    description: recado.mensagem,
    alternates: { canonical: `/mural/${id}` },
    openGraph: { title: titulo, description: recado.mensagem, url: `/mural/${id}`, type: "article" },
    twitter: { card: "summary_large_image", title: titulo, description: recado.mensagem },
  };
}

/** Página de um post-it só, feita para ser compartilhada. */
export default async function RegistroDoPostIt({ params }: Props) {
  const { id } = await params;
  const recado = await buscarRecado(id);
  if (!recado) notFound();

  return (
    <main className="registro">
      <header className="registro__topo">
        <Link href="/" className="registro__nomes">
          {casamento.noivo} <span>&</span> {casamento.noiva}
        </Link>
        <div className="registro__contador">
          <Contador alvo={casamento.dataHora} />
        </div>
      </header>

      <h1 className="registro__titulo">
        Registro de <span>{recado.nome}</span>
      </h1>

      <div className="registro__postit postit-caixa">
        <PostIt {...recado} inclinacao={-2} alfinete="rose" tamanho="grande" />
      </div>

      {recado.resposta && (
        <p className="registro__resposta">
          <span>
            {casamento.noivo} & {casamento.noiva}:
          </span>{" "}
          {recado.resposta}
        </p>
      )}

      <Compartilhar id={recado.id} nome={recado.nome} className="compartilhar--claro registro__compartilhar" />

      <nav className="registro__links" aria-label="Continuar no site">
        <Link href="/mural?escrever=1" className="botao botao--rose">
          Deixar o meu post-it
        </Link>
        <Link href="/" className="registro__site">
          Conheça a nossa história
        </Link>
      </nav>
    </main>
  );
}
