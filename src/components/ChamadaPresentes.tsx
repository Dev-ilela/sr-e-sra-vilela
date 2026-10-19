import Link from "next/link";
import { Ramo } from "@/components/Ramo";

/** Bloco curto na página inicial que leva para a lista de presentes. */
export function ChamadaPresentes() {
  return (
    <section className="chamada" aria-labelledby="chamada-titulo">
      <Ramo className="chamada__ramo" />
      <h2 id="chamada-titulo" className="chamada__titulo">
        Lista de presentes
      </h2>
      <p className="chamada__texto">
        Ter vocês com a gente nesse dia já é presente demais. Mas se quiser deixar sua marca nesse começo,
        separamos umas coisas para a casa nova e uns mimos para a lua de mel.
      </p>
      <Link href="/presentes" className="botao botao--claro">
        Ver a lista
      </Link>
    </section>
  );
}
