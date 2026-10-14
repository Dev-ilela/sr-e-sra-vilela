import { PilhaDeFotos, type Foto } from "@/components/PilhaDeFotos";
import { casamento } from "@/config/casamento";

const FOTOS: Foto[] = [
  { src: "/fotos/casal/aliancas.webp", alt: "Nós dois mostrando as alianças, ela com o buquê", legenda: "Ela disse sim", foco: "50% 40%" },
  { src: "/fotos/casal/ajoelhado.webp", alt: "Gabriel ajoelhado fazendo o pedido", legenda: "O pedido", foco: "50% 70%" },
  { src: "/fotos/casal/abraco.webp", alt: "Bianca abraçando Gabriel, sorrindo", legenda: "Aquele abraço", foco: "40% 50%" },
  { src: "/fotos/casal/giro.webp", alt: "Bianca girando de mãos dadas com Gabriel", legenda: "Um giro no gramado", foco: "45% 50%" },
  { src: "/fotos/casal/nariz.webp", alt: "Nós dois de rosto colado, com o mar ao fundo", legenda: "Nariz com nariz", foco: "55% 50%" },
  { src: "/fotos/casal/biblia.webp", alt: "Nós dois deitados na grama ao lado de uma Bíblia aberta", legenda: "Na grama, com a Palavra do lado", foco: "60% 50%" },
  { src: "/fotos/casal/drone-mar.webp", alt: "O drone trazendo as alianças sobre o mar", legenda: "As alianças chegando de drone", foco: "50% 30%" },
];

function Foto({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="casal__chip" src={src} alt={alt} loading="lazy" tabIndex={0} />
  );
}

export function Casal() {
  return (
    <section className="casal" aria-labelledby="casal-titulo">
      <header className="casal__topo">
        <h2 id="casal-titulo" className="casal__titulo">
          Prazer, {casamento.noivo} e {casamento.noiva}
        </h2>
        <p className="casal__sub">Dois jovens que sonham em ser uma família.</p>
      </header>

      <blockquote className="casal__historia">
        <p>
          Em 2021 a gente se conheceu na ETEC Aristóteles Ferreira e, aos poucos, Deus{" "}
          <Foto src="/fotos/casal/chip-oracao.webp" alt="Nós dois ajoelhados em oração com a família" /> foi nos
          unindo conforme o plano dEle. No dia 8 de abril de 2022 nos demos em namoro{" "}
          <Foto src="/fotos/casal/chip-maos.webp" alt="Nossas mãos dadas" /> e ali uma aliança começou. Quase
          quatro anos depois, no Morro da Asa Delta, as alianças do noivado chegaram de drone{" "}
          <Foto src="/fotos/casal/chip-drone.webp" alt="O drone no céu enquanto nos abraçamos" />. Hoje elas estão
          na mão direita <Foto src="/fotos/casal/chip-anel.webp" alt="Gabriel colocando a aliança na Bianca" />,
          esperando o dia de passar para a esquerda.
        </p>
      </blockquote>

      <PilhaDeFotos fotos={FOTOS} />
    </section>
  );
}
