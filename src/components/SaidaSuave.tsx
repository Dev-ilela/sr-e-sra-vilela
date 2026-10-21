"use client";

import { useEffect } from "react";

/**
 * Antes de trocar de página por um link interno, a tela atual esmaece rapidinho.
 * Junto com a entrada em fade (template.tsx), a troca fica cadenciada em vez de seca.
 */
export function SaidaSuave() {
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
      pagina?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-in", fill: "forwards" });
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
