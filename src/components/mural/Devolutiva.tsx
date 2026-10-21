"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { PostIt } from "@/components/mural/PostIt";
import { ehSticker, Sticker } from "@/components/mural/Stickers";
import { casamento } from "@/config/casamento";
import { animar, esperar } from "@/lib/animar";
import type { Recado } from "@/lib/recados";
import { PalavraPostIt } from "@/components/mural/PalavraPostIt";

/**
 * Quando o post-it de quem está visitando foi aprovado: aparece o post-it,
 * o sticker escolhido pelos noivos "bate" em cima dele e a resposta deles surge.
 */
export function Devolutiva({ recado, aoFechar }: { recado: Recado; aoFechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const caixa = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    dialogo.current?.showModal();
    const c = caixa.current;
    if (!c) return;
    const sequencia = async () => {
      await animar(c.querySelector(".devolutiva__postit"), [{ transform: "translateY(30px) rotate(-8deg)", opacity: 0 }, { transform: "rotate(-3deg)", opacity: 1 }], {
        duration: 520,
        easing: "cubic-bezier(.2,.8,.2,1)",
      });
      await esperar(250);
      // O sticker vem de cima, grandão, e cola com um "tapa".
      await animar(
        c.querySelector(".devolutiva__sticker"),
        [
          { transform: "translate(60px, -160px) scale(2.4) rotate(-40deg)", opacity: 0 },
          { transform: "translate(0, 0) scale(.86) rotate(14deg)", opacity: 1, offset: 0.72 },
          { transform: "scale(1.08, .94) rotate(10deg)", offset: 0.86 },
          { transform: "scale(1) rotate(12deg)", opacity: 1 },
        ],
        { duration: 620, easing: "cubic-bezier(.55,0,.7,.2)" },
      );
      animar(c.querySelector(".devolutiva__postit"), [{ scale: "1" }, { scale: ".96" }, { scale: "1" }], { duration: 220, fill: "none" });
      await animar(c.querySelector(".devolutiva__resposta"), [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
        duration: 380,
        delay: 120,
        easing: "ease-out",
      });
      await animar(c.querySelector(".devolutiva__acoes"), [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    };
    sequencia();
  }, []);

  useEffect(() => {
    const d = dialogo.current;
    const fechar = () => aoFechar();
    d?.addEventListener("close", fechar);
    return () => d?.removeEventListener("close", fechar);
  }, [aoFechar]);

  return (
    <dialog ref={dialogo} className="devolutiva" aria-labelledby="devolutiva-titulo">
      <div ref={caixa} className="devolutiva__caixa">
        <p className="devolutiva__chapeu">Chegou resposta!</p>
        <h2 id="devolutiva-titulo" className="devolutiva__titulo">
          Os noivos leram seu <PalavraPostIt />
        </h2>

        <div className="devolutiva__cena">
          <PostIt
            mensagem={recado.mensagem}
            nome={recado.nome}
            cor={recado.cor}
            alfinete={null}
            className="devolutiva__postit"
            style={{ opacity: 0 }}
          />
          {ehSticker(recado.sticker) && (
            <div className="devolutiva__sticker" style={{ opacity: 0 }}>
              <Sticker id={recado.sticker} />
            </div>
          )}
        </div>

        <div className="devolutiva__resposta" style={{ opacity: 0 }}>
          <p className="devolutiva__resposta-quem">
            {casamento.noivo} & {casamento.noiva} responderam:
          </p>
          <p className="devolutiva__resposta-texto">{recado.resposta ?? "Que carinho! Obrigado por fazer parte da nossa história."}</p>
        </div>

        <div className="devolutiva__acoes" style={{ opacity: 0 }}>
          <button type="button" className="botao botao--rose" onClick={() => dialogo.current?.close()}>
            Ver no mural
          </button>
          <Link className="devolutiva__link" href={`/mural/${recado.id}`}>
            Abrir pra compartilhar
          </Link>
        </div>
      </div>
    </dialog>
  );
}
