"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Destaque, type ItemDestaque } from "@/components/mural/Destaque";
import { Devolutiva } from "@/components/mural/Devolutiva";
import { Escritor } from "@/components/mural/Escritor";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";
import { PostIt } from "@/components/mural/PostIt";
import { animar } from "@/lib/animar";
import {
  buscarMeusAprovados,
  devolutivaJaVista,
  esquecerMeusRecados,
  marcarDevolutivaVista,
  meusRecados,
  type MeuRecado,
} from "@/lib/meusRecados";
import { corDoAlfinete, escalaDoPostIt, inclinacao, POST_IT_DOS_NOIVOS, type Recado } from "@/lib/recados";

type Aberto = { item: ItemDestaque; origem: HTMLElement | null; incl: number };

/** O quadro de cortiça com o bloquinho, o post-it dos noivos e todos os recados aprovados. */
export function Quadro({ recados: doServidor }: { recados: Recado[] }) {
  const [aprovados, setAprovados] = useState(doServidor);
  const [pendentes, setPendentes] = useState<MeuRecado[]>([]);
  const [aberto, setAberto] = useState<Aberto | null>(null);
  const [escrevendo, setEscrevendo] = useState(false);
  const [devolutivas, setDevolutivas] = useState<Recado[]>([]);
  const [novo, setNovo] = useState<string | null>(null);
  const folha = useRef<HTMLSpanElement>(null);
  const quadro = useRef<HTMLDivElement>(null);
  // No celular o bloquinho só aparece quando o quadro entra na tela, para não cobrir o texto do topo.
  const [quadroVisivel, setQuadroVisivel] = useState(true);

  useEffect(() => {
    const el = quadro.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observador = new IntersectionObserver(([e]) => setQuadroVisivel(e.isIntersecting || e.boundingClientRect.top < 0), {
      rootMargin: "0px 0px -15% 0px",
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // Post-its deste aparelho: os que ainda esperam aparecem no quadro; os aprovados trazem a devolutiva.
  useEffect(() => {
    let vivo = true;
    const meus = meusRecados();
    const noServidor = new Map(doServidor.map((r) => [r.id, r]));

    (async () => {
      const faltam = meus.filter((m) => !noServidor.has(m.id)).map((m) => m.id);
      const recemAprovados = await buscarMeusAprovados(faltam);
      if (!vivo) return;

      const aprovadosMeus = [...meus.filter((m) => noServidor.has(m.id)).map((m) => noServidor.get(m.id)!), ...recemAprovados];
      const idsAprovados = new Set(aprovadosMeus.map((r) => r.id));

      if (recemAprovados.length) setAprovados((atual) => [...recemAprovados.filter((r) => !noServidor.has(r.id)), ...atual]);
      setPendentes(meus.filter((m) => !idsAprovados.has(m.id)));
      setDevolutivas(aprovadosMeus.filter((r) => !devolutivaJaVista(r.id)));
      // Só sai da lista local depois que a pessoa viu a devolutiva (assim nada se perde se a página recarregar).
      esquecerMeusRecados(aprovadosMeus.filter((r) => devolutivaJaVista(r.id)).map((r) => r.id));
    })();

    // Veio de "Escrever o meu": abre o bloquinho uma vez e tira o ?escrever=1 do endereço,
    // senão voltar/avançar no navegador ou recarregar abriria o post-it de novo sozinho.
    const busca = new URLSearchParams(window.location.search);
    if (busca.get("escrever") === "1") {
      busca.delete("escrever");
      const resto = busca.toString();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${resto ? `?${resto}` : ""}${window.location.hash}`);
      setTimeout(() => vivo && setEscrevendo(true), 500);
    }
    return () => {
      vivo = false;
    };
  }, [doServidor]);

  // O post-it recém-enviado chega voando e é alfinetado.
  useEffect(() => {
    if (!novo) return;
    const item = document.querySelector<HTMLElement>(`[data-recado="${novo}"]`);
    if (!item) return;
    item.scrollIntoView({ behavior: "smooth", block: "center" });
    const papel = item.querySelector(".postit");
    animar(papel, [{ transform: "translateY(-60px) scale(1.25) rotate(-12deg)", opacity: 0 }, { transform: "rotate(var(--incl))", opacity: 1 }], {
      duration: 600,
      delay: 250,
      easing: "cubic-bezier(.2,.8,.3,1.2)",
      fill: "none",
    });
    animar(item.querySelector(".postit__alfinete"), [{ transform: "translate(-50%, -30px) scale(1.4)", opacity: 0 }, { transform: "translate(-50%, 0) scale(1)", opacity: 1 }], {
      duration: 260,
      delay: 820,
      easing: "cubic-bezier(.5,0,.6,1.6)",
      fill: "backwards",
    });
  }, [novo]);

  const abrir = (item: ItemDestaque, origem: HTMLElement, incl: number) => setAberto({ item, origem, incl });

  const aoEnviar = useCallback((meu: MeuRecado) => {
    setPendentes((atual) => [meu, ...atual]);
    setNovo(meu.id);
  }, []);

  // Aberto com o mouse: ao voltar, o foco não deixa contorno no bloquinho.
  const porMouse = useRef(false);
  const fecharEscritor = useCallback(() => {
    setEscrevendo(false);
    if (porMouse.current) requestAnimationFrame(() => (document.activeElement as HTMLElement | null)?.blur());
  }, []);

  const fecharDevolutiva = useCallback(() => {
    setDevolutivas((fila) => {
      if (fila[0]) {
        marcarDevolutivaVista(fila[0].id);
        esquecerMeusRecados([fila[0].id]);
      }
      return fila.slice(1);
    });
  }, []);

  return (
    <>
      <div className="quadro__barra">
        <div className="quadro__cabeca">
          <h2 className="quadro__titulo">Nosso mural:</h2>
          <p className="quadro__convite">
            Vai ser um prazer ler cada <PalavraPostIt /> e responder com um sticker feito pra você!
          </p>
          <p className="quadro__dica">
            Clique em um <PalavraPostIt /> para ver a nossa resposta.
          </p>
        </div>
        <ol className="quadro__passos" aria-label="Como colar o seu">
          <li>Destaque um <PalavraPostIt /></li>
          <li>Escreva uma mensagem aos noivos</li>
          <li>Cole no quadro!</li>
        </ol>
      </div>

      <div className="quadro" ref={quadro}>
        <ul className="quadro__grade">
          <ItemDoQuadro
            id={POST_IT_DOS_NOIVOS.id}
            dados={{ ...POST_IT_DOS_NOIVOS, compartilhavel: false }}
            incl={-2.5}
            alfinete="ouro"
            aoAbrir={abrir}
          />

          {pendentes.map((p) => (
            <ItemDoQuadro
              key={p.id}
              id={p.id}
              dados={{ ...p, compartilhavel: false, pendente: true }}
              incl={inclinacao(p.id)}
              alfinete="rose"
              aoAbrir={abrir}
            />
          ))}

          {aprovados.map((r) => (
            <ItemDoQuadro
              key={r.id}
              id={r.id}
              dados={{ ...r, compartilhavel: true }}
              incl={inclinacao(r.id)}
              alfinete={corDoAlfinete(r.id)}
              aoAbrir={abrir}
            />
          ))}
        </ul>
      </div>

      {/* Bloquinho flutuante no canto: a folha de cima é de onde sai o post-it novo. */}
      <button
        type="button"
        className={`bloquinho ${quadroVisivel ? "" : "bloquinho--recolhido"}`}
        onPointerDown={() => (porMouse.current = true)}
        onKeyDown={() => (porMouse.current = false)}
        onClick={() => setEscrevendo(true)}
        aria-label="Escrever um post-it pros noivos"
      >
        <span className="bloquinho__extra bloquinho__extra--azul" aria-hidden="true" />
        <span className="bloquinho__extra bloquinho__extra--rosa" aria-hidden="true" />
        <span className="bloquinho__pilha" aria-hidden="true" />
        <span className="bloquinho__pilha" aria-hidden="true" />
        <span ref={folha} className="bloquinho__folha">
          <span className="bloquinho__papel" aria-hidden="true" />
          <span className="bloquinho__convite">
            Escreva um <PalavraPostIt />
          </span>
          <span className="bloquinho__mais" aria-hidden="true">
            +
          </span>
          <span className="bloquinho__orelha" aria-hidden="true" />
        </span>
      </button>

      {aberto && <Destaque item={aberto.item} origem={aberto.origem} inclinacao={aberto.incl} aoFechar={() => setAberto(null)} />}
      {escrevendo && <Escritor origem={folha.current} aoEnviar={aoEnviar} aoFechar={fecharEscritor} />}
      {!escrevendo && !aberto && devolutivas[0] && <Devolutiva key={devolutivas[0].id} recado={devolutivas[0]} aoFechar={fecharDevolutiva} />}
    </>
  );
}

function ItemDoQuadro({
  id,
  dados,
  incl,
  alfinete,
  aoAbrir,
}: {
  id: string;
  dados: ItemDestaque;
  incl: number;
  alfinete: "rose" | "ouro" | "marinho" | "salvia";
  aoAbrir: (item: ItemDestaque, origem: HTMLElement, incl: number) => void;
}) {
  return (
    <li className="quadro__item" data-recado={id} style={{ "--escala": escalaDoPostIt(dados.mensagem) } as CSSProperties}>
      <button
        type="button"
        className="quadro__botao"
        onClick={(e) => aoAbrir({ ...dados, id }, e.currentTarget.closest("li")!, incl)}
        aria-label={`Abrir o post-it de ${dados.nome}`}
      >
        <PostIt {...dados} semente={id} inclinacao={incl} alfinete={alfinete} pendente={dados.pendente} />
      </button>
    </li>
  );
}
