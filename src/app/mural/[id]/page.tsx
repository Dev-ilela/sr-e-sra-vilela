import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contador } from "@/components/Contador";
import { Compartilhar } from "@/components/mural/Compartilhar";
import { PostIt } from "@/components/mural/PostIt";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";
import { casamento, dataCurta } from "@/config/casamento";
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
      <div className="registro__palco">
        <div className="registro__postit postit-caixa">
          <PostIt {...recado} semente={recado.id} inclinacao={-3} alfinete="rose" tamanho="grande" />
        </div>

        <div className="registro__lado">
          <p className="registro__chapeu">
            Mural de <PalavraPostIt plural />
          </p>
          <h1 className="registro__nomes">
            <Link href="/">
              {casamento.noivo} <span>&</span> {casamento.noiva}
            </Link>
          </h1>
          <p className="registro__de">Registro de {recado.nome}</p>
          <span className="registro__filete" aria-hidden="true" />
          <p className="registro__data">
            {dataCurta.replaceAll("/", ".")} · <Link href="/">sr-e-sra-vilela.com.br</Link>
          </p>
          <div className="registro__contador">
            <Contador alvo={casamento.dataHora} />
          </div>

          {recado.resposta && (
            <div className="registro__resposta">
              <p className="registro__resposta-quem">Os noivos responderam</p>
              <p className="registro__resposta-texto">{recado.resposta}</p>
            </div>
          )}

          <div className="registro__acoes">
            <Compartilhar id={recado.id} nome={recado.nome} mini />
            <Link href="/mural?escrever=1" className="registro__deixar">
              Deixe o seu também →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
