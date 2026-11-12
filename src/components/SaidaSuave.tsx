"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SAIDA = "saida-suave";
/** Tempo máximo que a tela pode ficar apagada esperando a próxima página. */
const LIMITE_MS = 1500;

/** Desfaz qualquer esmaecimento de saída que tenha ficado na tela. */
function desfazerSaida() {
  document.querySelectorAll<HTMLElement>(".pagina").forEach((pagina) =>
    pagina
      .getAnimations()
      .filter((a) => a.id === SAIDA)
      .forEach((a) => a.cancel()),
  );
}

/**
 * Antes de trocar de página por um link interno, a tela atual esmaece rapidinho.
 * Junto com a entrada em fade (template.tsx), a troca fica cadenciada em vez de seca.
 *
 * O esmaecimento nunca pode ficar preso (era a "tela toda azul" que só voltava com F5).
 * Ele é desfeito em qualquer um destes casos, o que vier primeiro:
 *  - a rota mudou (o template não é recriado entre rotas irmãs, como /mural e /mural/[id]);
 *  - o navegador voltou/avançou no histórico ou restaurou a página do cache (bfcache);
 *  - passou de LIMITE_MS sem a página nova aparecer (rede lenta, navegação cancelada).
 */
export function SaidaSuave() {
  const rota = usePathname();

  useEffect(desfazerSaida, [rota]);

  useEffect(() => {
    const aoVoltar = () => desfazerSaida();
    window.addEventListener("pageshow", aoVoltar);
    window.addEventListener("popstate", aoVoltar);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        window.removeEventListener("pageshow", aoVoltar);
        window.removeEventListener("popstate", aoVoltar);
      };
    }

    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const destino = new URL(link.href, location.href);
      if (destino.origin !== location.origin) return;
      // Mesma página (só âncora ou só query): não esmaece.
      if (destino.pathname === location.pathname) return;

      const pagina = document.querySelector<HTMLElement>(".pagina");
      if (!pagina) return;
      desfazerSaida();
      const saida = pagina.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-in", fill: "forwards" });
      saida.id = SAIDA;
      // Rede de segurança: se a página nova demorar, a atual volta a aparecer.
      window.setTimeout(() => saida.playState !== "idle" && saida.cancel(), LIMITE_MS);
    };

    document.addEventListener("click", aoClicar, true);
    return () => {
      document.removeEventListener("click", aoClicar, true);
      window.removeEventListener("pageshow", aoVoltar);
      window.removeEventListener("popstate", aoVoltar);
    };
  }, []);

  return null;
}
