"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Solitario } from "@/components/aliancas/Aneis";
import { Cerimonia } from "@/components/aliancas/Cerimonia";
import { EVENTO_REVER, EVENTO_UNIR, mudarEstadoAliancas, ponteiro, semMouse, useEstadoAliancas, type DetalheUnir } from "@/lib/aliancas";

const INICIO = "aliancas:inicio";
const DICA_EM_MS = 45_000;

type Encontro = { noiva: { x: number; y: number }; noivo: { x: number; y: number } };

/** Está em cima da aliança do noivo? (para soltar arrastando, no celular) */
function aliancaDoNoivoEm(x: number, y: number) {
  const alvo = document.querySelector<HTMLElement>("[data-alianca-noivo]");
  if (!alvo) return null;
  const r = alvo.getBoundingClientRect();
  const folga = 28;
  return x > r.left - folga && x < r.right + folga && y > r.top - folga && y < r.bottom + folga ? r : null;
}

/**
 * Fica em todas as páginas: mostra o solitário "na mão" enquanto a pessoa procura o par
 * (seguindo o cursor, ou num bolsinho no canto no celular) e roda a cerimônia quando se encontram.
 */
export function AliancasGlobal() {
  const estado = useEstadoAliancas();
  const rota = usePathname();
  const [encontro, setEncontro] = useState<Encontro | null>(null);
  const [toque, setToque] = useState(false);
  const [dica, setDica] = useState(false);
  const mao = useRef<HTMLDivElement>(null);
  const bolso = useRef<HTMLDivElement>(null);

  const carregando = estado === "carregando" && !encontro;

  useEffect(() => {
    if (carregando) setToque(semMouse());
  }, [carregando, rota]);

  // Dica depois de um tempinho procurando (conta mesmo trocando de página).
  useEffect(() => {
    if (!carregando) return setDica(false);
    let inicio = Number(sessionStorage.getItem(INICIO));
    if (!inicio) {
      inicio = Date.now();
      sessionStorage.setItem(INICIO, String(inicio));
    }
    const falta = Math.max(0, inicio + DICA_EM_MS - Date.now());
    const t = setTimeout(() => setDica(true), falta);
    return () => clearTimeout(t);
  }, [carregando]);

  // Computador: o solitário acompanha o cursor, como se estivesse na mão.
  useEffect(() => {
    if (!carregando || toque) return;
    let quadro = 0;
    const mover = (e: PointerEvent) => {
      if (e.pointerType === "touch") return setToque(true);
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const el = mao.current;
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = `translate(${e.clientX + 6}px, ${e.clientY + 10}px) rotate(-14deg)`;
        // "Quente ou frio": brilha mais perto do par.
        const alvo = document.querySelector<HTMLElement>("[data-alianca-noivo]")?.getBoundingClientRect();
        const perto = alvo ? Math.hypot(alvo.left + alvo.width / 2 - e.clientX, alvo.top + alvo.height / 2 - e.clientY) < 220 : false;
        el.classList.toggle("alianca-mao--perto", perto);
      });
    };
    const el = mao.current;
    if (el && ponteiro.x > 0) {
      el.style.opacity = "1";
      el.style.transform = `translate(${ponteiro.x + 6}px, ${ponteiro.y + 10}px) rotate(-14deg)`;
    }
    window.addEventListener("pointermove", mover, { passive: true });
    return () => {
      window.removeEventListener("pointermove", mover);
      cancelAnimationFrame(quadro);
    };
  }, [carregando, toque]);

  // Pedido de união vindo da aliança do noivo (clique) ou do bolsinho (arrastar e soltar).
  useEffect(() => {
    const unir = (e: Event) => {
      const { noivo, noiva } = (e as CustomEvent<DetalheUnir>).detail;
      sessionStorage.removeItem(INICIO);
      setEncontro({ noiva, noivo: { x: noivo.left + noivo.width / 2, y: noivo.top + noivo.height / 2 } });
      mudarEstadoAliancas("unidas");
    };
    const rever = (e: Event) => {
      const p = (e as CustomEvent<{ x: number; y: number }>).detail;
      setEncontro({ noiva: { x: p.x - 40, y: p.y }, noivo: { x: p.x + 40, y: p.y } });
    };
    window.addEventListener(EVENTO_UNIR, unir);
    window.addEventListener(EVENTO_REVER, rever);
    return () => {
      window.removeEventListener(EVENTO_UNIR, unir);
      window.removeEventListener(EVENTO_REVER, rever);
    };
  }, []);

  // Celular: arrastar o bolsinho até a aliança dele.
  const arrastar = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const el = bolso.current;
    if (!el) return;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Sem captura o arrasto ainda funciona enquanto o dedo estiver sobre o bolsinho.
    }
    const ini = { x: e.clientX, y: e.clientY };
    let moveu = false;
    const mover = (ev: PointerEvent) => {
      const dx = ev.clientX - ini.x;
      const dy = ev.clientY - ini.y;
      if (Math.hypot(dx, dy) > 6) moveu = true;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
      el.classList.toggle("alianca-bolso--perto", !!aliancaDoNoivoEm(ev.clientX, ev.clientY));
    };
    const soltar = (ev: PointerEvent) => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerup", soltar);
      el.removeEventListener("pointercancel", soltar);
      el.classList.remove("alianca-bolso--perto");
      const alvo = aliancaDoNoivoEm(ev.clientX, ev.clientY);
      if (alvo) {
        el.style.transform = "";
        window.dispatchEvent(new CustomEvent<DetalheUnir>(EVENTO_UNIR, { detail: { noivo: alvo, noiva: { x: ev.clientX, y: ev.clientY } } }));
        return;
      }
      el.animate([{ transform: el.style.transform }, { transform: "none" }], { duration: 300, easing: "cubic-bezier(.3,1.4,.5,1)" });
      el.style.transform = "";
      if (!moveu) setDica(true);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);
  };

  const desistir = () => {
    sessionStorage.removeItem(INICIO);
    mudarEstadoAliancas("perdidas");
  };

  const fechar = useCallback(() => setEncontro(null), []);

  return (
    <>
      {carregando && !toque && (
        <div ref={mao} className="alianca-mao" aria-hidden="true">
          <Solitario />
        </div>
      )}

      {carregando && (
        <div className={`alianca-aviso ${toque ? "alianca-aviso--toque" : ""}`} role="status">
          {toque && (
            <div ref={bolso} className="alianca-bolso" onPointerDown={arrastar} aria-label="Solitário da noiva: arraste até a aliança do noivo">
              <Solitario />
            </div>
          )}
          <p className="alianca-aviso__texto">
            {dica ? (
              <>
                <strong>Dica:</strong> o noivo foi dar uma olhada na lista de presentes.
              </>
            ) : toque ? (
              "Arraste até o par dele."
            ) : (
              "Leve o solitário até o par dele."
            )}
          </p>
          <button type="button" className="alianca-aviso__soltar" onClick={desistir}>
            Devolver
          </button>
        </div>
      )}

      {encontro && <Cerimonia noiva={encontro.noiva} noivo={encontro.noivo} aoFechar={fechar} />}
    </>
  );
}
