import type { Metadata } from "next";
import Link from "next/link";
import { Ramo } from "@/components/Ramo";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";
import { casamento } from "@/config/casamento";
import { ZoePerdida } from "@/components/ZoePerdida";

export const metadata: Metadata = {
  title: `Página não encontrada - ${casamento.noivo} & ${casamento.noiva}`,
  robots: { index: false },
};

/** 404 no estilo do site: a Zoe aparece procurando a página e mostra o caminho de volta. */
export default function NaoEncontrada() {
  return (
    <main className="perdido">
      <div className="perdido__conteudo">
        <ZoePerdida />
        <p className="perdido__chapeu">Página não encontrada</p>
        <h1 className="perdido__titulo">Esse caminho não existe</h1>
        <Ramo className="perdido__ramo" />
        <p className="perdido__texto">
          <span className="perdido__frase">O link pode ter mudado ou sido digitado diferente.</span>{" "}
          <span className="perdido__frase">Mas o resto do site está aqui:</span>
        </p>
        <div className="perdido__acoes">
          <Link href="/" className="botao botao--rose">
            Voltar pro início
          </Link>
          <div className="perdido__links">
            <Link href="/presentes" className="perdido__link">
              Lista de presentes
            </Link>
            <Link href="/mural" className="perdido__link">
              Mural de <PalavraPostIt plural />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
