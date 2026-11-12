"use client";

import { useEffect } from "react";
import { ehErroDeVersao, recarregarParaVersaoNova } from "@/lib/versaoNova";

/** Fica no layout: se um pedaço do site antigo não carregar mais, recarrega na versão nova. */
export function VersaoNova() {
  useEffect(() => {
    const aoErro = (e: ErrorEvent | Event) => {
      // Script ou CSS do próprio site que não carregou (erro de recurso não sobe como ErrorEvent).
      const alvo = e.target as HTMLScriptElement | HTMLLinkElement | null;
      const endereco = alvo && "src" in alvo ? alvo.src : alvo && "href" in alvo ? alvo.href : "";
      if ((endereco && endereco.includes("/_next/static/")) || ehErroDeVersao((e as ErrorEvent).error ?? (e as ErrorEvent).message)) {
        recarregarParaVersaoNova();
      }
    };
    const aoRejeitar = (e: PromiseRejectionEvent) => {
      if (ehErroDeVersao(e.reason)) recarregarParaVersaoNova();
    };
    window.addEventListener("error", aoErro, true);
    window.addEventListener("unhandledrejection", aoRejeitar);
    return () => {
      window.removeEventListener("error", aoErro, true);
      window.removeEventListener("unhandledrejection", aoRejeitar);
    };
  }, []);

  return null;
}
