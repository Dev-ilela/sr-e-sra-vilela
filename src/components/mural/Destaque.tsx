"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { Compartilhar } from "@/components/mural/Compartilhar";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";
import { PostIt, type DadosPostIt } from "@/components/mural/PostIt";
import { animar, caixa, deVolta, limparAnimacoes } from "@/lib/animar";
import { casamento } from "@/config/casamento";

export type ItemDestaque = DadosPostIt & {
  id: string;
  resposta?: string | null;
  compartilhavel: boolean;
  pendente?: boolean;
};

type Props = {
  item: ItemDestaque;
  origem: HTMLElement | null;
  inclinacao: number;
  aoFechar: () => void;
};

/**
 * Post-it em destaque: o alfinete salta, o papel "descola" do quadro, desentorta e vem
 * para o centro. Ao fechar, ele volta e cola de novo no mesmo lugar.
 */
/** O papel dentro do item do quadro (é ele que serve de referência na animação). */
function papelDe(origem: HTMLElement) {
  return origem.querySelector<HTMLElement>(".postit") ?? origem;
}

export function Destaque({ item, origem, inclinacao, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const papel = useRef<HTMLDivElement>(null);
  const extras = useRef<HTMLDivElement>(null);
  const fechando = useRef(false);

  useLayoutEffect(() => {
    const d = dialogo.current;
    const p = papel.current;
    if (!d || !p) return;
    d.showModal();
    origem?.classList.add("quadro__item--fora");

    const abrir = async () => {
      if (origem) {
        const alfinete = origem.querySelector(".postit__alfinete");
        const de = deVolta(caixa(papelDe(origem)), caixa(p), inclinacao);
        // O papel já começa no lugar dele no quadro (sem piscar no centro);
        // o alfinete pula fora e, logo em seguida, o papel descola e vem.
        animar(
          alfinete,
          [
            { transform: "translate(-50%, 0) rotate(0)", opacity: 1 },
            { transform: "translate(-50%, -26px) rotate(40deg)", opacity: 0 },
          ],
          { duration: 220, easing: "cubic-bezier(.3,.7,.4,1)" },
        );
        await animar(
          p,
          [
            { transform: de, boxShadow: "0 2px 4px rgba(20,35,59,.25)" },
            { transform: `${de} translateY(-10px) rotate(${-inclinacao * 0.6}deg)`, offset: 0.18 },
            { transform: "none", boxShadow: "0 40px 70px -24px rgba(20,35,59,.6)" },
          ],
          { duration: 620, delay: 200, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      } else {
        await animar(p, [{ transform: "scale(.6) rotate(-6deg)", opacity: 0 }, { transform: "none", opacity: 1 }], {
          duration: 380,
          easing: "cubic-bezier(.2,.8,.2,1)",
        });
      }
      await animar(extras.current, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], {
        duration: 260,
        easing: "ease-out",
      });
    };
    abrir();
    // Só ao abrir: o destaque é remontado a cada post-it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fechar = useCallback(async () => {
    if (fechando.current) return;
    fechando.current = true;
    const d = dialogo.current;
    const p = papel.current;
    d?.classList.add("destaque--fechando");
    await animar(extras.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 140 });
    if (origem && p) {
      limparAnimacoes(p);
      const de = deVolta(caixa(papelDe(origem)), caixa(p), inclinacao);
      await animar(p, [{ transform: "none" }, { transform: de, boxShadow: "0 2px 4px rgba(20,35,59,.25)" }], {
        duration: 480,
        easing: "cubic-bezier(.5,0,.2,1)",
      });
      origem.classList.remove("quadro__item--fora");
      const alfinete = origem.querySelector(".postit__alfinete");
      limparAnimacoes(alfinete);
      // Alfinete crava de volta e o papel dá aquele tranquinho.
      animar(
        alfinete,
        [
          { transform: "translate(-50%, -18px) scale(1.3)", opacity: 0 },
          { transform: "translate(-50%, 0) scale(1)", opacity: 1 },
        ],
        { duration: 200, easing: "cubic-bezier(.5,0,.6,1.6)", fill: "none" },
      );
      animar(origem.querySelector(".postit"), [{ scale: "1" }, { scale: ".97" }, { scale: "1" }], {
        duration: 220,
        delay: 160,
        fill: "none",
      });
    } else {
      await animar(p, [{ opacity: 1 }, { opacity: 0, transform: "scale(.8)" }], { duration: 220 });
      origem?.classList.remove("quadro__item--fora");
    }
    d?.close();
    aoFechar();
  }, [aoFechar, inclinacao, origem]);

  useEffect(() => {
    const d = dialogo.current;
    const aoCancelar = (e: Event) => {
      e.preventDefault();
      fechar();
    };
    d?.addEventListener("cancel", aoCancelar);
    return () => d?.removeEventListener("cancel", aoCancelar);
  }, [fechar]);

  return (
    <dialog
      ref={dialogo}
      className="destaque"
      aria-label={`Post-it de ${item.nome}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) fechar();
      }}
    >
      <div className="destaque__palco" onClick={(e) => e.target === e.currentTarget && fechar()}>
        <div ref={papel} className="destaque__papel">
          <PostIt {...item} tamanho="grande" alfinete={null} pendente={item.pendente} />
        </div>

        <div ref={extras} className="destaque__extras" style={{ opacity: 0 }}>
          {item.resposta && (
            <p className="destaque__resposta">
              <span className="destaque__resposta-quem">
                {casamento.noivo} & {casamento.noiva}:
              </span>{" "}
              {item.resposta}
            </p>
          )}
          {item.pendente && <p className="destaque__aviso">Esse é o seu. Assim que a gente ler, ele vai pro quadro de verdade.</p>}
          {item.compartilhavel && (
            <>
              <Link href={`/mural/${item.id}`} className="botao botao--rose">
                Abrir a página deste <PalavraPostIt />
              </Link>
              <Compartilhar id={item.id} nome={item.nome} />
            </>
          )}
          <button type="button" className="destaque__fechar" onClick={fechar}>
            Colar de volta no quadro
          </button>
        </div>
      </div>
    </dialog>
  );
}
