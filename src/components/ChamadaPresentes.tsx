import Link from "next/link";
import { Ramo } from "@/components/Ramo";

/** Bloco curto na página inicial que leva para a lista de presentes. */
export function ChamadaPresentes() {
  return (
    <section className="chamada" aria-labelledby="chamada-titulo">
      <div className="chamada__moldura">
        <Ramo className="chamada__ramo" />
        <h2 id="chamada-titulo" className="chamada__titulo">
          Lista de presentes
        </h2>
        <p className="chamada__texto">
          É uma alegria ter você acompanhando o começo da nossa família. Se desejar fazer parte desse início de um
          jeito especial, preparamos com carinho a nossa lista.
        </p>
        <Link href="/presentes" className="botao botao--claro">
          Ver a lista
        </Link>
      </div>
    </section>
  );
}
