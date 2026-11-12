"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SAIDA = "saida-suave";

/**
 * Antes de trocar de página por um link interno, a tela atual esmaece rapidinho.
 * Junto com a entrada em fade (template.tsx), a troca fica cadenciada em vez de seca.
 *
 * O template só é recriado quando muda o primeiro trecho da rota; entre rotas irmãs
 * (ex.: /mural/noivos e /mural/noivos/presentes) a mesma ".pagina" continua na tela.
 * Por isso a saída é desfeita sempre que a rota muda, senão a página nova ficaria invisível.
 */
export function SaidaSuave() {
  const rota = usePathname();

  useEffect(() => {
    document
      .querySelector<HTMLElement>(".pagina")
      ?.getAnimations()
      .filter((a) => a.id === SAIDA)
      .forEach((a) => a.cancel());
  }, [rota]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destino = new URL(link.href, location.href);
      if (destino.origin !== location.origin) return;
      // Mesma página (só âncora ou só query): não esmaece.
      if (destino.pathname === location.pathname) return;

      const pagina = document.querySelector<HTMLElement>(".pagina");
      const saida = pagina?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-in", fill: "forwards" });
      if (!saida) return;
      saida.id = SAIDA;
      // Rede de segurança: se a navegação não acontecer, a página volta sozinha.
      setTimeout(() => saida.playState !== "idle" && location.pathname !== destino.pathname && saida.cancel(), 4000);
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
