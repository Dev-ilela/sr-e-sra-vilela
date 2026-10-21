"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { corDoAlfinete, inclinacao, POST_IT_DOS_NOIVOS, type Recado } from "@/lib/recados";

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

    if (new URLSearchParams(window.location.search).get("escrever") === "1") {
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

  const total = aprovados.length;

  return (
    <>
      <div className="quadro__barra">
        <p className="quadro__conta">
          {total === 0 ? (
            <>
              O quadro está esperando o primeiro <PalavraPostIt />
            </>
          ) : (
            <>
              {total} <PalavraPostIt plural={total > 1} /> {total > 1 ? "colados" : "colado"}
            </>
          )}
        </p>
        <button type="button" className="botao botao--rose" onClick={() => setEscrevendo(true)}>
          Colar um post-it
        </button>
      </div>

      <div className="quadro">
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
        className="bloquinho"
        onPointerDown={() => (porMouse.current = true)}
        onKeyDown={() => (porMouse.current = false)}
        onClick={() => setEscrevendo(true)}
        aria-label="Escrever um post-it pros noivos"
      >
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
    <li className="quadro__item" data-recado={id}>
      <button
        type="button"
        className="quadro__botao"
        onClick={(e) => aoAbrir({ ...dados, id }, e.currentTarget.closest("li")!, incl)}
        aria-label={`Abrir o post-it de ${dados.nome}`}
      >
        <PostIt {...dados} inclinacao={incl} alfinete={alfinete} pendente={dados.pendente} />
      </button>
    </li>
  );
}
