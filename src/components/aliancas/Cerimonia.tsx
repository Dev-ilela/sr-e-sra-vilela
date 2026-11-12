"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AliancaLisa, Solitario } from "@/components/aliancas/Aneis";
import { CenaMaos, DESLOCAMENTO_INICIAL } from "@/components/aliancas/Maos";
import { casamento, dataCurta } from "@/config/casamento";
import { animar, esperar, semMovimento } from "@/lib/animar";

type Ponto = { x: number; y: number };
type Fase = "encontro" | "ela" | "ele" | "fim";

const TAM = 112; // tamanho de cada aliança voando, em px

/**
 * As alianças se encontram: voam para o centro, encostam e brilham; depois ele coloca
 * o solitário nela, ela coloca a aliança nele, e fica a mensagem de agradecimento.
 */
export function Cerimonia({ noiva, noivo, aoFechar }: { noiva: Ponto; noivo: Ponto; aoFechar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const solitario = useRef<HTMLDivElement>(null);
  const lisa = useRef<HTMLDivElement>(null);
  const clarao = useRef<HTMLDivElement>(null);
  const cena = useRef<HTMLDivElement>(null);
  const dando = useRef<SVGGElement>(null);
  const anel = useRef<SVGGElement>(null);
  const legenda = useRef<HTMLParagraphElement>(null);
  const pulou = useRef(false);
  const [fase, setFase] = useState<Fase>("encontro");

  // Encontro das alianças
  useLayoutEffect(() => {
    const d = dialogo.current;
    d?.showModal();
    if (semMovimento()) {
      setFase("fim");
      return;
    }
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const de = (p: Ponto) => `translate(${p.x - cx}px, ${p.y - cy}px) scale(.5)`;

    (async () => {
      animar(d, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
      await Promise.all([
        animar(solitario.current, [{ transform: de(noiva) }, { transform: "translate(-70px, 0) rotate(-12deg)" }], {
          duration: 900,
          easing: "cubic-bezier(.3,.7,.2,1)",
        }),
        animar(lisa.current, [{ transform: de(noivo) }, { transform: "translate(70px, 0) rotate(10deg)" }], {
          duration: 900,
          easing: "cubic-bezier(.3,.7,.2,1)",
        }),
      ]);
      if (pulou.current) return;
      await esperar(200);
      // Encostam...
      await Promise.all([
        animar(solitario.current, [{ transform: "translate(-70px, 0) rotate(-12deg)" }, { transform: "translate(-26px, -4px) rotate(-18deg)" }], {
          duration: 520,
          easing: "cubic-bezier(.6,0,.4,1)",
        }),
        animar(lisa.current, [{ transform: "translate(70px, 0) rotate(10deg)" }, { transform: "translate(26px, 6px) rotate(16deg)" }], {
          duration: 520,
          easing: "cubic-bezier(.6,0,.4,1)",
        }),
      ]);
      if (pulou.current) return;
      // ...e brilham.
      animar(clarao.current, [{ opacity: 0, transform: "scale(.2)" }, { opacity: 1, transform: "scale(1)", offset: 0.35 }, { opacity: 0, transform: "scale(1.6)" }], {
        duration: 1300,
        easing: "ease-out",
      });
      document.querySelectorAll(".cerimonia__faisca").forEach((f, i) => {
        const ang = (i / 10) * Math.PI * 2;
        const r = 120 + (i % 3) * 40;
        animar(f, [{ transform: "translate(0,0) scale(.2)", opacity: 1 }, { transform: `translate(${Math.cos(ang) * r}px, ${Math.sin(ang) * r}px) scale(1)`, opacity: 0 }], {
          duration: 1100,
          delay: 80,
          easing: "cubic-bezier(.2,.8,.3,1)",
        });
      });
      await esperar(1700);
      if (!pulou.current) setFase("ela");
    })();
  }, [noiva, noivo]);

  // Cenas das mãos
  useEffect(() => {
    if (fase !== "ela" && fase !== "ele") return;
    let vivo = true;
    (async () => {
      const desloc = `translateX(${DESLOCAMENTO_INICIAL}px)`;
      await animar(cena.current, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 450 });
      animar(legenda.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
      await esperar(500);
      // A mão chega com a aliança na ponta do dedo e desliza até a base do anelar.
      await Promise.all(
        [dando.current, anel.current].map((g) =>
          animar(g, [{ transform: desloc }, { transform: "translateX(0px)" }], { duration: 1500, easing: "cubic-bezier(.45,.05,.3,1)" }),
        ),
      );
      if (!vivo) return;
      await esperar(350);
      await animar(dando.current, [{ transform: "translateX(0px)", opacity: 1 }, { transform: "translateX(150px)", opacity: 0 }], {
        duration: 700,
        easing: "ease-in",
      });
      document.querySelectorAll(".cerimonia__cena .cerimonia__faisca-cena").forEach((f, i) =>
        animar(f, [{ opacity: 0, transform: "scale(.3)" }, { opacity: 1, transform: "scale(1.1)" }, { opacity: 0, transform: "scale(.6)" }], {
          duration: 900,
          delay: i * 120,
        }),
      );
      await esperar(1300);
      if (!vivo) return;
      await animar(cena.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 350 });
      if (vivo) setFase(fase === "ela" ? "ele" : "fim");
    })();
    return () => {
      vivo = false;
    };
  }, [fase]);

  useEffect(() => {
    const d = dialogo.current;
    d?.addEventListener("close", aoFechar);
    return () => d?.removeEventListener("close", aoFechar);
  }, [aoFechar]);

  const pular = () => {
    pulou.current = true;
    setFase("fim");
  };

  return (
    <dialog ref={dialogo} className="cerimonia" aria-labelledby="cerimonia-titulo" onCancel={(e) => fase !== "fim" && (e.preventDefault(), pular())}>
      {fase !== "fim" && (
        <button type="button" className="cerimonia__pular" onClick={pular}>
          Pular
        </button>
      )}

      {fase === "encontro" && (
        <div className="cerimonia__palco" aria-live="polite">
          <div ref={clarao} className="cerimonia__clarao" />
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className="cerimonia__faisca" />
          ))}
          <div ref={lisa} className="cerimonia__anel" style={{ width: TAM, height: TAM }}>
            <AliancaLisa />
          </div>
          <div ref={solitario} className="cerimonia__anel" style={{ width: TAM, height: TAM }}>
            <Solitario />
          </div>
          <p className="aliancas-sr" id="cerimonia-titulo">
            As alianças se encontraram!
          </p>
        </div>
      )}

      {(fase === "ela" || fase === "ele") && (
        <div key={fase} ref={cena} className="cerimonia__cena" style={{ opacity: 0 }}>
          <CenaMaos quem={fase} refs={{ dando, anel }} className="cerimonia__maos" />
          {[0, 1, 2].map((i) => (
            <span key={i} className={`cerimonia__faisca-cena cerimonia__faisca-cena--${fase}-${i}`} />
          ))}
          <p ref={legenda} className="cerimonia__legenda" style={{ opacity: 0 }}>
            {fase === "ela" ? `${casamento.noivo} coloca a solitária na ${casamento.noiva}...` : `...e a ${casamento.noiva} coloca a aliança no ${casamento.noivo}.`}
          </p>
        </div>
      )}

      {fase === "fim" && (
        <div className="cerimonia__fim">
          <div className="cerimonia__par" aria-hidden="true">
            <AliancaLisa className="cerimonia__par-lisa" />
            <Solitario className="cerimonia__par-solitario" />
          </div>
          <p className="cerimonia__chapeu">Achou!</p>
          <h2 id="cerimonia-titulo" className="cerimonia__titulo">
            O amor é o elo perfeito
          </h2>
          <p className="cerimonia__versiculo">Colossenses 3:14</p>
          <p className="cerimonia__texto">
            Obrigado por ajudar a gente a se encontrar. Agora é só esperar o grande dia: {dataCurta.replaceAll("/", ".")}.
          </p>
          <div className="cerimonia__acoes">
            <button type="button" className="botao botao--rose" onClick={() => dialogo.current?.close()}>
              Que lindo!
            </button>
            <Link href="/mural?escrever=1" className="cerimonia__link" onClick={() => dialogo.current?.close()}>
              Deixar um recado no mural
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
