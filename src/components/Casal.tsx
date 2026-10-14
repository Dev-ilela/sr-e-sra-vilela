import { PilhaDeFotos, type Foto } from "@/components/PilhaDeFotos";
import { FotoNoTexto } from "@/components/FotoNoTexto";
import { Regua, type Marco } from "@/components/Regua";
import { casamento } from "@/config/casamento";

const FOTOS: Foto[] = [
  { src: "/fotos/casal/1-ajoelhado.webp", alt: "Gabriel ajoelhado fazendo o pedido", legenda: "O pedido" },
  { src: "/fotos/casal/2-anel.webp", alt: "Gabriel colocando a aliança na Bianca, com a cidade ao fundo", legenda: "A aliança no dedo" },
  { src: "/fotos/casal/3-aliancas.webp", alt: "Nós dois mostrando as alianças, ela com o buquê", legenda: "Ela disse sim" },
  { src: "/fotos/casal/4-abraco.webp", alt: "Bianca abraçando Gabriel, sorrindo", legenda: "Aquele abraço" },
  { src: "/fotos/casal/5-giro.webp", alt: "Bianca girando de mãos dadas com Gabriel", legenda: "Um giro no gramado" },
  { src: "/fotos/casal/6-nariz.webp", alt: "Nós dois de rosto colado, com o mar ao fundo", legenda: "Nariz com nariz" },
  { src: "/fotos/casal/7-biblia.webp", alt: "Nós dois deitados na grama ao lado de uma Bíblia aberta", legenda: "Ele, ela e a Bíblia" },
  { src: "/fotos/casal/8-drone.webp", alt: "O drone trazendo as alianças enquanto nos abraçamos", legenda: "As alianças chegando de drone" },
];

const MARCOS: Marco[] = [
  { data: "26.11.2021", titulo: "O 1º encontro" },
  { data: "08.04.2022", titulo: "O namoro" },
  { data: "10.01.2026", titulo: "O noivado" },
  { data: "09.07.2027", titulo: "O casamento" },
];

export function Casal() {
  return (
    <section className="casal" aria-labelledby="casal-titulo">
      <header className="casal__topo">
        <h2 id="casal-titulo" className="casal__titulo">
          Prazer,
          <br />
          {casamento.noivo} e {casamento.noiva}
        </h2>
        <p className="casal__sub">Dois jovens que sonham em ser uma família.</p>
      </header>

      <blockquote className="casal__historia">
        {/* div em vez de p: as fotos abrem num <dialog>, que não pode ficar dentro de <p>. */}
        <div className="casal__texto">
          Em 2021 a gente se conheceu na ETEC Aristóteles Ferreira e, aos poucos, Deus{" "}
          <FotoNoTexto chip="/fotos/casal/chip-comeco.webp" grande="/fotos/casal/grande-comeco.webp" alt="Nossa selfie do começo, os dois sorrindo de aparelho" /> foi nos
          unindo conforme o plano dEle. No dia 8 de abril de 2022 nos demos em namoro{" "}
          <FotoNoTexto chip="/fotos/casal/chip-namoro.webp" grande="/fotos/casal/grande-namoro.webp" alt="Nós dois juntinhos no começo do namoro" /> e ali uma aliança começou. No dia
          10 de janeiro de 2026, quase quatro anos depois, no Morro da Asa Delta, as alianças do noivado chegaram
          de drone{" "}
          <FotoNoTexto chip="/fotos/casal/chip-drone.webp" grande="/fotos/casal/grande-drone.webp" alt="O drone no céu enquanto nos abraçamos" />. Hoje elas estão
          na mão direita <FotoNoTexto chip="/fotos/casal/chip-anel.webp" grande="/fotos/casal/grande-anel.webp" alt="Gabriel colocando a aliança na Bianca" />,
          esperando o 9 de julho de 2027 para passar para a esquerda.
        </div>
      </blockquote>

      <Regua marcos={MARCOS} />

      <PilhaDeFotos fotos={FOTOS} />
    </section>
  );
}
